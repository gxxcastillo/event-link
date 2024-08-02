import { web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ConfirmOptions } from '@solana/web3.js';

import { events } from './utils';

// @TODO
import { nanoid } from 'nanoid';
nanoid(); //=> "V1StGXR8_Z5jdHi6B-myT"

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
  eventPK: web3.PublicKey;
  attendeeKP?: web3.Keypair;
  rsvpStatus: RsvpStatus;
  authorityPK: web3.PublicKey;
  invitePK?: web3.PublicKey;
  inviteID?: number;
  inviteBump?: number;
  tokenMintPK: web3.PublicKey;
};

const confirmOptions: ConfirmOptions = { commitment: 'confirmed', maxRetries: 10 };

export async function rsvp({
  rsvpStatus,
  eventPK,
  authorityPK,
  invitePK,
  inviteID,
  inviteBump,
  tokenMintPK,
  attendeeKP = web3.Keypair.generate(),
}: IRsvpToEvent) {
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

  const { pubkeys } = await events.methods
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
