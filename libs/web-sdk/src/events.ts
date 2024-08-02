import { web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ConfirmOptions, Keypair } from '@solana/web3.js';
import BN from 'bn.js';

import { events } from './utils';

// @TODO Switch to using nanoid over incremental ids
// import { nanoid } from 'nanoid'
// nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"

type ICreateEvent = {
  eventDate: number;
  metadataUri: string;
  initialFunds: number;
  maxAttendees?: number;
  isInviteOnly?: boolean;
};

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

export async function createEvent(
  creatorKP: Keypair,
  {
    eventDate,
    maxAttendees = 0,
    metadataUri,
    initialFunds,
    isInviteOnly = false,
  }: ICreateEvent = {} as ICreateEvent
) {
  const eventKP = web3.Keypair.generate();
  const accounts = {
    event: eventKP.publicKey,
    creator: creatorKP.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const { pubkeys } = await events.methods
    .createEvent(new BN(eventDate), maxAttendees, metadataUri, isInviteOnly, new BN(initialFunds))
    .accounts(accounts)
    .signers([eventKP, creatorKP])
    .rpcAndKeys(confirmOptions);

  return {
    pubkeys,
  };
}

export async function updateEvent() {
  // @TODO
}

export async function getEvents() {
  // @TODO
}
