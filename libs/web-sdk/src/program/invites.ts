import { web3 } from '@coral-xyz/anchor';
import { ConfirmOptions, PublicKey } from '@solana/web3.js';
import { type EventLinkProgram } from './types';

type CreateInvitesOptions = {
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
      program.programId
    );

    return {
      id: index,
      pubkey,
      bump,
    };
  });

  const r = {};

  const inviteKeys = remainingAccounts.map(({ id, bump }) => ({ id, bump }));
  const invitePubkeys = remainingAccounts.map(({ pubkey }) => ({
    pubkey,
    isSigner: false,
    isWritable: true,
  }));
  const { pubkeys } = await program.methods
    .createInvites(inviteKeys)
    .accounts(accounts)
    .remainingAccounts(invitePubkeys)
    .signers([r])
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
