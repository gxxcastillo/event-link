import { web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

import { generateEventID, stringToNumberArray } from '../utils';
import {
  type CreateEventMetadata,
  type Event,
  type EventLinkProgram,
  type EventSettings,
  type EventStatus,
} from './types';
import { PublicKey, SystemProgram } from '@solana/web3.js';

export const DISCRIMINATOR_LENGTH = 8;
export const i64_LENGTH = 8;

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

  return program.methods
    .createEvent(stringToNumberArray(generateEventID(), 9), metadataArg, settings, initialFunds)
    .accounts(accounts)
    .rpcAndKeys();
}

export async function updateEvent() {
  // @TODO
}

export async function getEvents(
  program: EventLinkProgram,
  creator: PublicKey
): Promise<[PublicKey, Event][]> {
  const programAccounts = await program.account.event.all([
    {
      memcmp: {
        offset: DISCRIMINATOR_LENGTH + i64_LENGTH + i64_LENGTH,
        bytes: creator.toBase58(),
      },
    },
  ]);

  return programAccounts.map((program) => [program.publicKey, program.account]);
}

export async function getEventInfo(program: EventLinkProgram, eventPubkey: PublicKey) {
  console.log('!!! getting infor for publicKey', eventPubkey.toBase58());
  const pda = generateEventInfoPda(program.programId, eventPubkey);
  return program.account.eventInfo.fetch(pda);
}

export function generateEventInfoPda(programId: PublicKey, eventPubkey: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from('info'), eventPubkey.toBuffer()], programId);
  console.log('!!!!! PDA', pda.toBase58());
  return pda;
}
