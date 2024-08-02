import { web3 } from '@coral-xyz/anchor';
import { ConfirmOptions, PublicKey, Keypair } from '@solana/web3.js';

import { events } from './utils';

// @TODO
import { nanoid } from 'nanoid';
nanoid(); //=> "V1StGXR8_Z5jdHi6B-myT"

type CreateInvitesOptions = {
  numInvites: number;
};

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

// @TODO = invites should have non-sequential ids - may need to use string ids that are
export async function createInvites(
  creatorKP: Keypair,
  eventPK: PublicKey,
  { numInvites }: CreateInvitesOptions
) {
  const creatorPK = creatorKP.publicKey;
  const accounts = {
    event: eventPK,
    creator: creatorPK,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const remainingAccounts = Array.from({ length: numInvites }, (_, index) => {
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32LE(index);
    const [pubkey, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('invite'), eventPK.toBuffer(), indexBuffer],
      events.programId
    );

    return {
      id: index,
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
  const { pubkeys } = await events.methods
    .createInvites(inviteKeys)
    .accounts(accounts)
    .remainingAccounts(invitePubkeys)
    .signers([creatorKP])
    .rpcAndKeys(confirmOptions);

  console.info(`Successfully created event: ${eventPK}`);

  return {
    pubkeys,
  };
}

export function updateInvites() {
  // @TODO
}

export function getInvites() {
  // @TODO
}
