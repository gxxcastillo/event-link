import { web3, workspace, Program, IdlTypes, Provider } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ConfirmOptions, Connection, SendTransactionError } from '@solana/web3.js';
import { faker } from '@faker-js/faker';

import BN from 'bn.js';
import { EventInvite } from '../target/types/event_invite.js';

export type EventInfo = IdlTypes<EventInvite>['eventInfo'];
export type RsvpStatus = IdlTypes<EventInvite>['rsvpStatus'];
export type RsvpStatusKey = keyof RsvpStatus;

export type ICreateNewEvent = {
  creatorKP?: web3.Keypair;
  maxAttendees?: number;
  isInviteOnly?: boolean;
  showGuestList?: boolean;
};

export type ICreateInvites = {
  eventPK: web3.PublicKey;
  creatorKP: web3.Keypair;
  numInvites: number;
};

export type IRsvpToEvent = {
  eventPK: web3.PublicKey;
  infoPK: web3.PublicKey;
  attendeeKP?: web3.Keypair;
  rsvpStatus: RsvpStatusKey;
  authorityPK: web3.PublicKey;
  invitePK?: web3.PublicKey;
  inviteID?: number;
  inviteBump?: number;
  mintPK: web3.PublicKey;
};

const { Keypair, PublicKey } = web3;

// Overrides the default sendAndConfirm to allow for forcing a fresh blockhash
async function augmentProvider(provider: Provider) {
  const originalSendAndConfirm = provider.sendAndConfirm?.bind(provider);

  provider.sendAndConfirm = async (originalTx, signers, opts) => {
    try {
      return await originalSendAndConfirm(originalTx, signers, opts);
    } catch (error) {
      if (error instanceof SendTransactionError && error.message.toLowerCase().includes('blockhash')) {
        const latestBlockHash = await provider.connection.getLatestBlockhash();
        const tx = Object.assign(originalTx, {
          recentBlockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        });

        // lets try that once more...
        return await originalSendAndConfirm(tx, signers, opts);
      }

      throw error;
    }
  };

  return provider;
}

export const eventProgram = workspace.EventInvite as Program<EventInvite>;
await augmentProvider(eventProgram.provider);

const sol = 1000000000;
const txCost = 5108640;
const authorityFunds = sol + txCost;
const creatorFunds = 5 * sol + authorityFunds;
const attendeeFunds = creatorFunds;

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

function isFulfilled<T>(
  result: PromiseFulfilledResult<T> | PromiseRejectedResult
): result is { status: 'fulfilled'; value: T } {
  return result.status === 'fulfilled';
}

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
  showGuestList = true,
}: ICreateNewEvent = {}) {
  await fundAccount(eventProgram.provider.connection, creatorKP.publicKey, creatorFunds);

  const eventKP = web3.Keypair.generate();
  const accounts = {
    event: eventKP.publicKey,
    creator: creatorKP.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const title = faker.lorem.words({ min: 2, max: 4 });
  const date = new BN(faker.date.soon().valueOf());
  const metadataUri = faker.internet.url();
  const inviteOnly = isInviteOnly;
  const args = {
    metadata: {
      title,
      date,
      metadataUri,
    },
    settings: {
      isInviteOnly: inviteOnly,
      maxAttendees,
      showGuestList,
    },
    initialFunds: new BN(authorityFunds),
  } as const;

  const { pubkeys } = await eventProgram.methods
    .createEvent(args.metadata, args.settings, args.initialFunds)
    .accounts(accounts)
    .signers([eventKP, creatorKP])
    .rpcAndKeys(confirmOptions);

  return {
    creatorKP,
    args,
    pubkeys,
    authorityBalance: 1006055200, // INITIAL_ACCOUNT_BALANCE + args.initialFunds
  };
}

export async function createInvites({ eventPK, creatorKP, numInvites }: ICreateInvites) {
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
      eventProgram.programId
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

  const { pubkeys } = await eventProgram.methods
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
  infoPK,
  rsvpStatus,
  authorityPK,
  invitePK,
  inviteID,
  inviteBump,
  mintPK,
  attendeeKP = web3.Keypair.generate(),
}: IRsvpToEvent) {
  await fundAccount(eventProgram.provider.connection, attendeeKP.publicKey, attendeeFunds);

  const rsvpEnum = {
    [rsvpStatus as RsvpStatusKey]: {},
  } as unknown as RsvpStatus;

  const args = {
    rsvpEnum,
    inviteID: inviteID ?? null,
    inviteBump: inviteBump ?? null,
  };

  const rsvpAccounts = {
    event: eventPK,
    info: infoPK,
    invite: invitePK || null,
    attendee: attendeeKP.publicKey,
    authority: authorityPK,
    mint: mintPK,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const { pubkeys } = await eventProgram.methods
    .rsvp(args.rsvpEnum, args.inviteID, args.inviteBump)
    .accounts(rsvpAccounts)
    .signers([attendeeKP])
    .rpcAndKeys(confirmOptions);

  console.info(`Successfully RSVPd to event: ${eventPK}`);
  return {
    attendeeKP,
    pubkeys,
    args: {
      rsvpStatus,
    },
  };
}

export async function manyRsvpsToEvent({
  numRsvps,
  infoPK,
  eventPK,
  mintPK,
  rsvpStatus,
  authorityPK,
}: Omit<IRsvpToEvent, 'attendeeKP'> & { numRsvps: number }) {
  if (numRsvps > 5) {
    // Avoid the tests taking too long
    throw new Error('Too many rsvps');
  }

  const promises: ReturnType<typeof rsvpToEvent>[] = [];
  for (let i = 0; i < numRsvps; i++) {
    try {
      promises.push(rsvpToEvent({ eventPK, infoPK, authorityPK, mintPK, rsvpStatus }));
    } catch {
      /** noop */
    }
  }

  const count = await Promise.allSettled(promises).then((rsvps) =>
    rsvps.reduce((count, rsvp) => (isFulfilled(rsvp) ? count + 1 : count), 0)
  );
  console.info(`Successfully created ${count} rsvps`);
}
