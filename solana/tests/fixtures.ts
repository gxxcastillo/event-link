import { type Program, type IdlTypes } from '@coral-xyz/anchor';
import { web3, workspace } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { type ConfirmOptions, type Connection } from '@solana/web3.js';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { faker } from '@faker-js/faker';
import BN from 'bn.js';
import { nanoid } from 'nanoid';

import { type EventLink } from '../target/types/event_link.js';

export type EventInfo = IdlTypes<EventLink>['eventInfo'];
export type RsvpStatus = IdlTypes<EventLink>['rsvpStatus'];
export type RsvpStatusKey = keyof RsvpStatus;

export type ICreateNewEvent = {
  creatorKP: web3.Keypair;
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
  inviteID?: string;
  inviteBump?: number;
  mintPK: web3.PublicKey;
};

export const eventProgram = workspace.EventLink as Program<EventLink>;

const txCost = 5108640;
const authorityFunds = LAMPORTS_PER_SOL + txCost;
const creatorFunds = 5 * LAMPORTS_PER_SOL + authorityFunds;
const attendeeFunds = creatorFunds;

const confirmOptions: ConfirmOptions = { commitment: 'processed', maxRetries: 10 };

function padByteArray(uint8Array: Uint8Array, size: number) {
  const paddedArray = new Uint8Array(size);
  paddedArray.set(uint8Array);
  return paddedArray;
}

function stringToByteArray(id: string, size: number = id.length) {
  const uint8array = new TextEncoder().encode(id).slice(0, size);
  return uint8array.length < size ? padByteArray(uint8array, size) : uint8array;
}

function stringToNumberArray(id: string, size: number = id.length) {
  return Array.from(stringToByteArray(id, size));
}

function isFulfilled<T>(
  result: PromiseFulfilledResult<T> | PromiseRejectedResult
): result is { status: 'fulfilled'; value: T } {
  return result.status === 'fulfilled';
}

async function fundAccount(connection: Connection, pubkey: PublicKey, lamports: number) {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const signature = await connection.requestAirdrop(pubkey, lamports);

  await Promise.race([
    connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Airdrop confirmation timed out')), 60_000)),
  ]);
}

export async function createUserAccount(creatorKP = Keypair.generate()) {
  await fundAccount(eventProgram.provider.connection, creatorKP.publicKey, creatorFunds);
  return creatorKP;
}

export async function createNewEvent({
  creatorKP,
  maxAttendees = faker.number.int({ max: 50 }),
  isInviteOnly = false,
  showGuestList = true,
}: ICreateNewEvent) {
  const accounts = {
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
    id: nanoid(9),
    metadata: {
      title,
      date,
      metadataUri,
      status: {
        published: {},
      },
    },
    settings: {
      isInviteOnly: inviteOnly,
      maxAttendees,
      showGuestList,
    },
    initialFunds: new BN(authorityFunds),
  } as const;

  const { pubkeys } = await eventProgram.methods
    .createEvent(stringToNumberArray(args.id, 9), args.metadata, args.settings, args.initialFunds)
    .accounts(accounts)
    .signers([creatorKP])
    .rpcAndKeys(confirmOptions);

  console.info(`Successfully created event: ${pubkeys.event}`);

  return {
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

  const remainingAccountTuples = Array.from({ length: numInvites }, () => {
    const id = nanoid(6);
    const [pubkey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('invite'), eventPK.toBuffer(), stringToByteArray(id, 6)],
      eventProgram.programId
    );

    return {
      id,
      pubkey,
      bump,
    };
  });

  const remainingAccountKeys = remainingAccountTuples.map(({ id, bump }) => {
    return { id: stringToNumberArray(id), bump };
  });

  const remainingAccounts = remainingAccountTuples.map(({ pubkey }) => {
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

  console.info(`Successfully created invites to event: ${eventPK}`);

  return {
    inviteKeys: remainingAccountTuples,
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

  const numberArray = inviteID ? stringToNumberArray(inviteID) : null;
  const { pubkeys } = await eventProgram.methods
    .rsvp(args.rsvpEnum, numberArray, args.inviteBump)
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
