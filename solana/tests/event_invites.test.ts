import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { eventProgram, createNewEvent, createInvites, rsvpToEvent, manyRsvpsToEvent } from './fixtures.js';

describe('event_invites', () => {
  it('Can create an event', async () => {
    const { args, pubkeys, creatorKP, authorityBalance } = await createNewEvent();

    const event = await eventProgram.account.event.fetch(pubkeys.event, 'confirmed');
    expect(event).toMatchObject({
      dateCreated: expect.any(BN),
      dateUpdated: expect.any(BN),
      creator: creatorKP.publicKey,
      authority: creatorKP.publicKey,
      infoBump: event.infoBump,
      mintAuthorityBump: event.mintAuthorityBump,
      mintBump: event.mintBump,
      numInvites: event.numInvites,
      numRsvps: event.numRsvps,
    });

    const eventInfo = await eventProgram.account.eventInfo.fetch(pubkeys.info, 'confirmed');
    expect(eventInfo).toMatchObject({
      dateUpdated: expect.any(BN),
      authority: creatorKP.publicKey,
      metadata: args.metadata,
      settings: args.settings,
    });

    const balance = await eventProgram.provider.connection.getBalance(pubkeys.mintAuthority);
    expect(balance).toBe(authorityBalance);

    const [info, infoBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('info'), pubkeys.event.toBuffer()],
      eventProgram.programId
    );
    expect(info).toStrictEqual(pubkeys.info);
    expect(infoBump).toBe(event.infoBump);

    const [mintAuthority, mintAuthorityBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('mint_authority'), pubkeys.event.toBuffer()],
      eventProgram.programId
    );
    expect(mintAuthority).toStrictEqual(pubkeys.mintAuthority);
    expect(mintAuthorityBump).toBe(event.mintAuthorityBump);

    const [mint, mintBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('mint'), pubkeys.event.toBuffer()],
      eventProgram.programId
    );
    expect(mint).toStrictEqual(pubkeys.mint);
    expect(mintBump).toBe(event.mintBump);
  });

  describe('createInvites()', () => {
    it('User can create invites to an event', async () => {
      const { pubkeys, creatorKP } = await createNewEvent({ maxAttendees: 10 });
      const { inviteKeys } = await createInvites({ eventPK: pubkeys.event, creatorKP, numInvites: 5 });

      const event = await eventProgram.account.event.fetch(pubkeys.event, 'confirmed');

      expect(event.dateUpdated).to.not.equal(event.dateCreated);
      expect(event.numInvites).to.equal(5);

      const invitePubkeys = inviteKeys.map((invite) => invite.pubkey);
      const invites = await eventProgram.account.invite.fetchMultiple(invitePubkeys);

      invites.forEach((invite) => {
        expect(invite).to.have.property('event');
        expect(invite?.event.toString()).to.equal(pubkeys.event.toString());

        expect(invite).to.have.property('rsvp').to.equal(null);
      });
    });
  });

  describe('rsvp()', () => {
    it('Users can rsvp to an event', async () => {
      const { pubkeys } = await createNewEvent();

      const [rsvp1, rsvp2, rsvp3, rsvp4] = await Promise.all([
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'accepted',
        }),
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'rejected',
        }),
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'tentative',
        }),
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'accepted',
        }),
      ]);

      const [rsvp1State, rsvp2State, rsvp3State, rsvp4State, eventState] = await Promise.all([
        eventProgram.account.rsvp.fetch(rsvp1?.pubkeys.rsvp as PublicKey, 'confirmed'),
        eventProgram.account.rsvp.fetch(rsvp2?.pubkeys.rsvp as PublicKey, 'confirmed'),
        eventProgram.account.rsvp.fetch(rsvp3?.pubkeys.rsvp as PublicKey, 'confirmed'),
        eventProgram.account.rsvp.fetch(rsvp4?.pubkeys.rsvp as PublicKey, 'confirmed'),
        await eventProgram.account.event.fetch(pubkeys.event, 'confirmed'),
      ]);

      expect(rsvp1State).toMatchObject({
        attendee: rsvp1?.pubkeys.attendee,
        event: pubkeys.event,
        status: { accepted: {} },
      });

      expect(rsvp2State).toMatchObject({
        attendee: rsvp2?.pubkeys.attendee,
        event: pubkeys.event,
        status: { rejected: {} },
      });

      expect(rsvp3State).toMatchObject({
        attendee: rsvp3?.pubkeys.attendee,
        event: pubkeys.event,
        status: { tentative: {} },
      });

      expect(rsvp4State).toMatchObject({
        attendee: rsvp4?.pubkeys.attendee,
        event: pubkeys.event,
        status: { accepted: {} },
      });

      expect(eventState.numRsvps).toBe(2);
    });

    it('Users can update their rsvp', async () => {
      const { pubkeys } = await createNewEvent();

      const [rsvp1, rsvp2] = await Promise.all([
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'accepted',
        }),
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'accepted',
        }),
      ]);

      const [rsvp1State, rsvp2State, rsvp3] = await Promise.all([
        eventProgram.account.rsvp.fetch(rsvp1.pubkeys.rsvp, 'confirmed'),
        eventProgram.account.rsvp.fetch(rsvp2.pubkeys.rsvp, 'confirmed'),

        // attendee 1 changes their rsvp
        rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          attendeeKP: rsvp1.attendeeKP,
          rsvpStatus: 'rejected',
        }),
      ]);

      // attendee 1
      expect(rsvp1State).toMatchObject({
        attendee: rsvp1.pubkeys.attendee,
        event: pubkeys.event,
        status: { accepted: {} },
      });

      // attendee 2
      expect(rsvp2State).toMatchObject({
        attendee: rsvp2.pubkeys.attendee,
        event: pubkeys.event,
        status: { accepted: {} },
      });

      expect(rsvp1.pubkeys.attendeeTokenAccount).toEqual(rsvp3.pubkeys.attendeeTokenAccount);
      expect(rsvp1.pubkeys.rsvp).toEqual(rsvp3.pubkeys.rsvp);

      const [rsvp3State, eventState] = await Promise.all([
        eventProgram.account.rsvp.fetch(rsvp3.pubkeys.rsvp, 'confirmed'),
        eventProgram.account.event.fetch(pubkeys.event, 'confirmed'),
      ]);

      expect(rsvp1State.event).toEqual(rsvp3State.event);
      expect(rsvp1State.attendee).toEqual(rsvp3State.attendee);
      expect(rsvp3State.status).toEqual({ rejected: {} });

      expect(eventState.numRsvps).toBe(1);
    });

    it('Does not allow > max_attendees', { timeout: 10000 }, async () => {
      const { pubkeys } = await createNewEvent({ maxAttendees: 4 });
      await manyRsvpsToEvent({
        eventPK: pubkeys.event,
        infoPK: pubkeys.info,
        mintPK: pubkeys.mint,
        authorityPK: pubkeys.mintAuthority,
        numRsvps: 5,
        rsvpStatus: 'accepted',
      });

      const eventState = await eventProgram.account.event.fetch(pubkeys.event, 'confirmed');
      expect(eventState.numRsvps).toBe(4);
    });

    it('Requires an invite to RSVP for an "is_invite_only" event', async () => {
      const { pubkeys } = await createNewEvent({ isInviteOnly: true });

      expect(async () => {
        await rsvpToEvent({
          eventPK: pubkeys.event,
          infoPK: pubkeys.info,
          mintPK: pubkeys.mint,
          authorityPK: pubkeys.mintAuthority,
          rsvpStatus: 'accepted',
        });
      }).rejects.toThrow();
    });

    it('Permits a user with an invite to RSVP for an "is_invite_only" event', async () => {
      const { creatorKP, pubkeys: eventPubkeys } = await createNewEvent({
        isInviteOnly: true,
      });

      const { inviteKeys } = await createInvites({ eventPK: eventPubkeys.event, creatorKP, numInvites: 5 });
      const invitePK = inviteKeys[0].pubkey;
      const bump = inviteKeys[0].bump;
      const id = inviteKeys[0].id;

      const { attendeeKP, pubkeys: rsvpPubkeys } = await rsvpToEvent({
        eventPK: eventPubkeys.event,
        infoPK: eventPubkeys.info,
        mintPK: eventPubkeys.mint,
        authorityPK: eventPubkeys.mintAuthority,
        rsvpStatus: 'accepted',
        invitePK,
        inviteID: id,
        inviteBump: bump,
      });

      const rsvp = await eventProgram.account.rsvp.fetch(rsvpPubkeys.rsvp, 'confirmed');
      expect(rsvp).toMatchObject({
        attendee: attendeeKP.publicKey,
        event: eventPubkeys.event,
        status: { accepted: {} },
      });
    });
  });
});
