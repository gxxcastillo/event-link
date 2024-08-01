import { web3, workspace, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import { faker } from '@faker-js/faker';

import BN from 'bn.js';
import { EventInvite } from '../target/types/event_invite.js';

type RsvpStatusArg =
  | Record<'accepted', Record<string, never>>
  | Record<'rejected', Record<string, never>>
  | Record<'tentative', Record<string, never>>;
type RsvpStatus = `${RsvpEnum}`;
enum RsvpEnum {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Tentative = 'tentative',
}

type ICreateNewEvent = {
  creatorKP?: web3.Keypair;
  maxAttendees?: number;
  isInviteOnly?: boolean;
};

type ICreateInvites = {
  eventPK: web3.PublicKey;
  creatorKP: web3.Keypair;
  numInvites: number;
};

type IRsvpToEvent = {
  eventPK: web3.PublicKey;
  attendeeKP?: web3.Keypair;
  rsvpStatus: RsvpStatus;
  authorityPK: web3.PublicKey;
  invitePK?: web3.PublicKey;
  inviteID?: number;
  inviteBump?: number;
  tokenMintPK: web3.PublicKey;
};

const { Keypair, PublicKey } = web3;

const sol = 1000000000;
const txCost = 5108640;
const authorityFunds = sol + txCost;
const creatorFunds = 5 * sol + authorityFunds;
const attendeeFunds = creatorFunds;

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

async function fundAccount(connection: Connection, publicKey: web3.PublicKey, amount: number) {
  const latestBlockHash = await connection.getLatestBlockhash();
  const signature = await connection.requestAirdrop(publicKey, amount);
  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });
}

export async function createNewEvent({
  creatorKP = Keypair.generate(),
  maxAttendees = faker.number.int({ max: 50 }),
  isInviteOnly = false,
}: ICreateNewEvent = {}) {
  const program = workspace.EventInvite as Program<EventInvite>;

  await fundAccount(program.provider.connection, creatorKP.publicKey, creatorFunds);

  const eventKP = web3.Keypair.generate();
  const accounts = {
    event: eventKP.publicKey,
    creator: creatorKP.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const eventDate = new BN(faker.date.soon().valueOf());
  const eventMaxAttendees = maxAttendees;
  const eventMetadataUri = faker.internet.url();
  const inviteOnly = isInviteOnly;
  const args = {
    eventDate,
    eventMaxAttendees,
    eventMetadataUri,
    isInviteOnly: inviteOnly,
    initialFunds: authorityFunds,
  } as const;

  const { pubkeys } = await program.methods
    .createEvent(
      args.eventDate,
      args.eventMaxAttendees,
      args.eventMetadataUri,
      args.isInviteOnly,
      new BN(args.initialFunds)
    )
    .accounts(accounts)
    .signers([eventKP, creatorKP])
    .rpcAndKeys(confirmOptions);

  const tokenMintPK = pubkeys.tokenMint;
  const authorityPK = pubkeys.authority;
  const eventPK = pubkeys.event;

  return {
    program,
    eventPK,
    creatorKP,
    tokenMintPK,
    authorityPK,
    args,
    authorityBalance: 1006055200, // INITIAL_ACCOUNT_BALANCE + args.initialFunds
  };
}

export async function createInvites({ eventPK, creatorKP, numInvites }: ICreateInvites) {
  const program = workspace.EventInvite as Program<EventInvite>;

  const creatorPK = creatorKP.publicKey;
  const accounts = {
    event: eventPK,
    creator: creatorPK,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const remainingAccountTuples = Array.from({ length: numInvites }, (_, index) => {
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32LE(index);
    return PublicKey.findProgramAddressSync(
      [Buffer.from('invite'), eventPK.toBuffer(), indexBuffer],
      program.programId
    );
  });

  const remainingAccountKeys = remainingAccountTuples.map(([, bump], index) => ({ id: index, bump }));
  const remainingAccounts = remainingAccountTuples.map(([pubkey]) => {
    return {
      pubkey,
      isSigner: false,
      isWritable: true,
    };
  });

  const { pubkeys } = await program.methods
    .createInvites(remainingAccountKeys)
    .accounts(accounts)
    .remainingAccounts(remainingAccounts)
    .signers([creatorKP])
    .rpcAndKeys(confirmOptions);

  console.info(`Successfully created event: ${eventPK}`);

  return {
    inviteKeys: remainingAccountTuples.map(([pubkey, bump], index) => ({ pubkey, bump, id: index })),
    ...pubkeys,
  };
}

export async function rsvpToEvent({
  eventPK,
  rsvpStatus,
  authorityPK,
  invitePK,
  inviteID,
  inviteBump,
  tokenMintPK,
  attendeeKP = web3.Keypair.generate(),
}: IRsvpToEvent) {
  const program = workspace.EventInvite as Program<EventInvite>;
  await fundAccount(program.provider.connection, attendeeKP.publicKey, attendeeFunds);

  const rsvpAccounts = {
    event: eventPK,
    invite: invitePK || null,
    attendee: attendeeKP.publicKey,
    authority: authorityPK,
    tokenMint: tokenMintPK,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const rsvpEnum: RsvpStatusArg = {
    [rsvpStatus]: {},
  } as const as RsvpStatusArg;

  const { pubkeys } = await program.methods
    .rsvp(rsvpEnum, inviteID ?? null, inviteBump ?? null)
    .accounts(rsvpAccounts)
    .signers([attendeeKP])
    .rpcAndKeys(confirmOptions);

  console.info(`Successfully RSVPd to event: ${eventPK}`);

  return {
    attendeeKP,
    rsvpPK: pubkeys.rsvp,
    attendeeAtaPK: pubkeys.attendeeTokenAccount,
    args: {
      rsvpStatus,
    },
  };
}

export async function manyRsvpsToEvent({
  numRsvps,
  eventPK,
  tokenMintPK,
  rsvpStatus,
  authorityPK,
}: Omit<IRsvpToEvent, 'attendeeKP'> & { numRsvps: number }) {
  if (numRsvps > 5) {
    // Avoid the tests taking too long
    throw new Error('Too many rsvps');
  }

  let count = 0;
  for (let i = 0; i < numRsvps; i++) {
    try {
      await rsvpToEvent({ eventPK, authorityPK, tokenMintPK, rsvpStatus });

      // Not sure if this is needed but adding a bit of a delay to see if it avoids collisions
      await new Promise((r) => setTimeout(r, 100));
      count++;
    } catch (error) {
      /** noop */
    }
  }

  console.info(`Successfully created ${count} rsvps`);
}
