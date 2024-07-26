import { web3, workspace } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { faker } from '@faker-js/faker';

import { EventInvite } from '../target/types/event_invite.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

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

type IRsvpToEvent = {
  eventKP: web3.Keypair;
  tokenMintKP: web3.Keypair;
  creatorKP: web3.Keypair;
  attendeeKP?: web3.Keypair;
  rsvpStatus: RsvpStatus;
};

const { Keypair, PublicKey } = web3;

async function fundAccount(connection: web3.Connection, publicKey: web3.PublicKey, amount: number) {
  const latestBlockHash = await connection.getLatestBlockhash();
  const signature = await connection.requestAirdrop(publicKey, amount);
  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });
}

export async function createNewEvent({ maxAttendees }: { maxAttendees?: number } = {}) {
  const program = workspace.EventInvite as Program<EventInvite>;

  const eventKP = Keypair.generate();
  const creatorKP = Keypair.generate();
  const tokenMintKP = Keypair.generate();
  const accounts = {
    event: eventKP.publicKey,
    creator: creatorKP.publicKey,
    tokenMint: tokenMintKP.publicKey,
  };

  await fundAccount(program.provider.connection, creatorKP.publicKey, 1000000000);

  const eventTitle = `${faker.word.adjective} ${faker.word.noun} Event`;
  const eventDescription = faker.lorem.paragraph(1);
  const eventDate = faker.date.soon().toUTCString();
  const eventMaxAttendees = maxAttendees || faker.number.int({ max: 50 });
  const eventMetadataUri = faker.internet.url();
  const args = {
    eventTitle,
    eventDescription,
    eventDate,
    eventMaxAttendees,
    eventMetadataUri,
  } as const;
  await program.methods
    .createEvent(eventTitle, eventDescription, eventDate, eventMaxAttendees, eventMetadataUri)
    .accounts(accounts)
    .signers([eventKP, creatorKP, tokenMintKP])
    .rpc();

  return {
    program,
    eventKP,
    creatorKP,
    tokenMintKP,
    args,
  };
}

export async function rsvpToEvent({
  eventKP,
  tokenMintKP,
  creatorKP,
  rsvpStatus,
  attendeeKP = web3.Keypair.generate(),
}: IRsvpToEvent) {
  const program = workspace.EventInvite as Program<EventInvite>;

  const [rsvpPK] = await PublicKey.findProgramAddress(
    [Buffer.from('rsvp'), eventKP.publicKey.toBuffer(), attendeeKP.publicKey.toBuffer()],
    program.programId
  );

  const attendeeAtaPK = await getAssociatedTokenAddress(tokenMintKP.publicKey, attendeeKP.publicKey);

  const rsvpAccounts = {
    event: eventKP.publicKey,
    rsvp: rsvpPK,
    attendee: attendeeKP.publicKey,
    attendeeTokenAccount: attendeeAtaPK,
    tokenMint: tokenMintKP.publicKey,
    mintAuthority: creatorKP.publicKey,
    feePayer: creatorKP.publicKey,
  };

  const rsvpEnum: RsvpStatusArg = {
    [rsvpStatus]: {},
  } as const as RsvpStatusArg;
  await program.methods.rsvp(rsvpEnum).accounts(rsvpAccounts).signers([attendeeKP, creatorKP]).rpc();

  return {
    attendeeKP,
    rsvpPK,
    attendeeAtaPK,
    args: {
      rsvpStatus,
    },
  };
}

export async function manyRsvpsToEvent({
  numRsvps,
  eventKP,
  tokenMintKP,
  creatorKP,
  rsvpStatus,
}: Omit<IRsvpToEvent, 'attendeeKP'> & { numRsvps: number }) {
  if (numRsvps > 5) {
    throw new Error('Too many rsvps');
  }

  let count = 0;
  for (let i = 0; i < numRsvps; i++) {
    try {
      await rsvpToEvent({ eventKP, tokenMintKP, creatorKP, rsvpStatus });
      count++;
    } catch (error) {
      /** noop */
    }
  }

  console.info(`Successfully created ${count} rsvps`);
}
