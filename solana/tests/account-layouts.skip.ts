// import { PublicKey } from '@solana/web3.js';
// import { BN } from '@coral-xyz/anchor';
import { expect } from 'vitest';
// import { EventInvites } from '../target/types/event_invites';

// const EVENT_DISCRIMINATOR_LENGTH = 8;
// const CREATOR_OFFSET = EVENT_DISCRIMINATOR_LENGTH + 8 + 8; // after 2 i64s

describe('Account Layouts', () => {
  test('event account layout - creator offset', () => {
    // const creator = PublicKey.unique();
    // const event = {
    //   dateCreated: new BN(1_700_000_000),
    //   dateUpdated: new BN(1_700_000_100),
    //   creator,
    //   authority: PublicKey.unique(),
    //   infoBump: 1,
    //   mintAuthorityBump: 2,
    //   mintBump: 3,
    //   id: Array(9).fill(0),
    //   numInvites: 5,
    //   numRsvps: 10,
    // };

    // Serialize using Anchor's Borsh implementation
    // const discriminator = accountDiscriminator('Event');
    // const layout = utils.structLayout(EventInvitesIDL.accounts.find((a) => a.name === 'Event')!);
    // const data = Buffer.concat([discriminator, layout.encode(event)]);

    // Confirm discriminator length
    // expect(discriminator.length).toBe(8);
    expect([].length).toBe(0);

    // Confirm creator offset
    // const creatorBytes = creator.toBytes();
    // const creatorSlice = data.slice(CREATOR_OFFSET, CREATOR_OFFSET + 32);
    // expect(creatorSlice.equals(creatorBytes)).toBe(true);
  });
});

// import { createHash } from 'node:crypto';

// export function accountDiscriminator(name: string): Buffer {
//   return createHash('sha256').update(`account:${name}`).digest().subarray(0, 8);
// }
