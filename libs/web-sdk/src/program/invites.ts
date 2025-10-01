import { web3 } from '@coral-xyz/anchor';
import { type ConfirmOptions } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { type EventLinkProgram } from './types';
import { nanoid } from 'nanoid';
import { stringToNumberArray } from '../utils';
import logger from 'loglevel';

export type CreateInvitesOptions = {
  numInvites: number;
};

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

// @TODO = invites should have non-sequential ids - may need to use string ids that are
export async function createInvites(
  program: EventLinkProgram,
  eventPK: PublicKey,
  { numInvites }: CreateInvitesOptions
) {
  const creatorPK = program.provider.publicKey;
  if (!creatorPK) {
    throw new Error('Provider does not have a connected public key');
  }

  const accounts = {
    event: eventPK,
    creator: creatorPK,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  // ⚠️ Each invite needs a unique 6-character ID
  const remainingAccounts = Array.from({ length: numInvites }, () => {
    const idStr = nanoid(6); // e.g., "a1B2cD"
    const idBytes = Buffer.from(idStr, 'utf8'); // 6 bytes
    if (idBytes.length !== 6) throw new Error('Invite ID must be 6 bytes');

    const [pubkey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('invite'), eventPK.toBuffer(), idBytes],
      program.programId
    );

    return {
      idStr,
      id: stringToNumberArray(idStr), // [u8; 6]
      pubkey,
      bump,
    };
  });

  const inviteKeys = remainingAccounts.map(({ id, bump }) => ({ id, bump }));
  const invitePubkeys = remainingAccounts.map(({ pubkey }) => ({
    pubkey,
    isSigner: false,
    isWritable: true,
  }));

  const tx = program.methods.createInvites(inviteKeys).accounts(accounts).remainingAccounts(invitePubkeys);
  const { pubkeys } = await tx.rpcAndKeys(confirmOptions);

  logger.info(`Successfully created ${numInvites} invites for event: ${eventPK.toBase58()}`);
  return {
    pubkeys,
    inviteKeys: remainingAccounts.map(({ idStr, id, bump, pubkey }) => ({
      idStr,
      id,
      bump,
      pubkey,
    })),
  };
}

export function updateInvites() {
  // @TODO
}

export function getInvites() {
  // @TODO
}
