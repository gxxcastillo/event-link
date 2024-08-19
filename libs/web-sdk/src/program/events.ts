import { web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

import { generateEventID, stringToNumberArray } from '../utils';
import { CreateEventMetadata, EventLinkProgram, EventSettings, EventStatus } from './types';
import { SystemProgram } from '@solana/web3.js';

export async function createEvent(
  program: EventLinkProgram,
  metadata: CreateEventMetadata,
  settings: EventSettings
) {
  // @TODO parse metadata and format to fix the IDL

  const creatorPubKey = program.provider.publicKey;
  if (!creatorPubKey) {
    throw new Error('Wallet is not connected');
  }

  const initialFunds = new BN(0);
  const accounts = {
    creator: creatorPubKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const metadataArg = {
    ...metadata,
    date: new BN(metadata.date),
    status: { [metadata.status]: {} } as unknown as EventStatus,
  };

  const rr = stringToNumberArray(generateEventID(), 9);
  return await program.methods
    // .createEvent(stringToNumberArray(args.id, 9), args.metadata, args.settings, args.initialFunds)
    .createEvent(rr, metadataArg, settings, initialFunds)
    .accounts(accounts)
    .rpcAndKeys();
}

export async function updateEvent() {
  // @TODO
}

export async function getEvents() {
  // @TODO
}
