import { web3 } from '@coral-xyz/anchor';
import { describe, it, expect } from 'vitest';

import { createNewEvent, createInvites, rsvpToEvent, manyRsvpsToEvent } from './fixtures.js';

const { PublicKey } = web3;

describe('event_invites', () => {
  it('Can create an event', async () => {
    const {
      program,
      args: { eventDate, eventMaxAttendees, eventMetadataUri, isInviteOnly },
      eventPK,
      authorityPK,
      tokenMintPK,
      authorityBalance,
    } = await createNewEvent();

    const event = await program.account.event.fetch(eventPK, 'confirmed');

    expect(event).toMatchObject({
      eventDate: eventDate,
      metadataUri: eventMetadataUri,
      maxAttendees: eventMaxAttendees,
      dateCreated: event.dateUpdated,
      numInvites: 0,
      numRsvps: 0,
      isInviteOnly: isInviteOnly,
      tokenMintBump: event.tokenMintBump,
      authorityBump: event.authorityBump,
    });

    const balance = await program.provider.connection.getBalance(authorityPK);
    expect(balance).toBe(authorityBalance);

    const [authority, authorityBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('authority'), eventPK.toBuffer()],
      program.programId
    );
    expect(authority).toStrictEqual(authorityPK);
    expect(authorityBump).toBe(event.authorityBump);

    const [tokenMint, tokenMintBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('mint'), eventPK.toBuffer()],
      program.programId
    );
    expect(tokenMint).toStrictEqual(tokenMintPK);
    expect(tokenMintBump).toBe(event.tokenMintBump);
  });

  describe('createInvites()', () => {
    it('User can create invites to an event', async () => {
      const { program, eventPK, creatorKP } = await createNewEvent({ maxAttendees: 10 });
      const { inviteKeys } = await createInvites({ eventPK, creatorKP, numInvites: 5 });

      const event = await program.account.event.fetch(eventPK, 'confirmed');

      expect(event.dateUpdated).to.not.equal(event.dateCreated);
      expect(event.numInvites).to.equal(5);

      const invitePubkeys = inviteKeys.map((invite) => invite.pubkey);
      const invites = await program.account.invite.fetchMultiple(invitePubkeys);

      invites.forEach((invite) => {
        expect(invite).to.have.property('event');
        expect(invite?.event.toString()).to.equal(eventPK.toString());

        expect(invite).to.have.property('rsvp').to.equal(null);
      });
    });
  });

  describe('rsvp()', () => {
    it('Users can rsvp to an event', async () => {
      const { program, tokenMintPK, authorityPK, eventPK } = await createNewEvent();

      // attendee 1
      const rsvp1 = await rsvpToEvent({
        eventPK,
        authorityPK,
        tokenMintPK,
        rsvpStatus: 'accepted',
      });

      const rsvp1State = await program.account.rsvp.fetch(rsvp1.rsvpPK, 'confirmed');
      expect(rsvp1State).toMatchObject({
        attendee: rsvp1.attendeeKP.publicKey,
        event: eventPK,
        status: { accepted: {} },
      });

      // attendee 2
      const rsvp2 = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'rejected',
      });
      const rsvp2State = await program.account.rsvp.fetch(rsvp2.rsvpPK, 'confirmed');
      expect(rsvp2State).toMatchObject({
        attendee: rsvp2.attendeeKP.publicKey,
        event: eventPK,
        status: { rejected: {} },
      });

      // attendee 3
      const rsvp3 = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'tentative',
      });
      const rsvp3State = await program.account.rsvp.fetch(rsvp3.rsvpPK, 'confirmed');
      expect(rsvp3State).toMatchObject({
        attendee: rsvp3.attendeeKP.publicKey,
        event: eventPK,
        status: { tentative: {} },
      });

      // attendee 4
      const rsvp4 = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'accepted',
      });
      const rsvp4State = await program.account.rsvp.fetch(rsvp4.rsvpPK, 'confirmed');
      expect(rsvp4State).toMatchObject({
        attendee: rsvp4.attendeeKP.publicKey,
        event: eventPK,
        status: { accepted: {} },
      });

      const eventState2 = await program.account.event.fetch(eventPK, 'confirmed');
      expect(eventState2.numRsvps).toBe(2);
    });

    it('Users can update their rsvp', async () => {
      const { program, tokenMintPK, authorityPK, eventPK } = await createNewEvent();

      // attendee 1
      const rsvp1 = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'accepted',
      });
      const rsvp1State = await program.account.rsvp.fetch(rsvp1.rsvpPK, 'confirmed');
      expect(rsvp1State).toMatchObject({
        attendee: rsvp1.attendeeKP.publicKey,
        event: eventPK,
        status: { accepted: {} },
      });

      // attendee 2
      const rsvp2 = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'accepted',
      });
      const rsvp2State = await program.account.rsvp.fetch(rsvp2.rsvpPK, 'confirmed');
      expect(rsvp2State).toMatchObject({
        attendee: rsvp2.attendeeKP.publicKey,
        event: eventPK,
        status: { accepted: {} },
      });

      // attendee 1 changes their rsvp
      const rsvp3 = await rsvpToEvent({
        eventPK,
        attendeeKP: rsvp1.attendeeKP,
        rsvpStatus: 'rejected',
        tokenMintPK,
        authorityPK,
      });
      const rsvp3State = await program.account.rsvp.fetch(rsvp3.rsvpPK, 'confirmed');

      expect(rsvp1.attendeeAtaPK).toEqual(rsvp3.attendeeAtaPK);
      expect(rsvp1.rsvpPK).toEqual(rsvp3.rsvpPK);
      expect(rsvp1State.event).toEqual(rsvp3State.event);
      expect(rsvp1State.attendee).toEqual(rsvp3State.attendee);
      expect(rsvp3State.status).toEqual({ rejected: {} });

      const eventState2 = await program.account.event.fetch(eventPK, 'confirmed');
      expect(eventState2.numRsvps).toBe(1);
    });

    it('Does not allow > max_attendees', { timeout: 10000 }, async () => {
      const { program, tokenMintPK, authorityPK, eventPK } = await createNewEvent({ maxAttendees: 4 });
      await manyRsvpsToEvent({
        numRsvps: 5,
        eventPK,
        rsvpStatus: 'accepted',
        authorityPK,
        tokenMintPK,
      });

      const eventState = await program.account.event.fetch(eventPK, 'confirmed');
      expect(eventState.maxAttendees).toBe(4);
      expect(eventState.numRsvps).toBe(4);
    });

    it('Requires an invite to RSVP for an "is_invite_only" event', async () => {
      const { tokenMintPK, authorityPK, eventPK } = await createNewEvent({ isInviteOnly: true });

      expect(async () => {
        await rsvpToEvent({
          eventPK,
          tokenMintPK,
          authorityPK,
          rsvpStatus: 'accepted',
        });
      }).rejects.toThrow();
    });

    it('Permits a user with an invite to RSVP for an "is_invite_only" event', async () => {
      const { program, creatorKP, tokenMintPK, authorityPK, eventPK } = await createNewEvent({
        isInviteOnly: true,
      });
      const { inviteKeys } = await createInvites({ eventPK, creatorKP, numInvites: 5 });
      const invitePK = inviteKeys[0].pubkey;
      const bump = inviteKeys[0].bump;
      const id = inviteKeys[0].id;

      const { rsvpPK, attendeeKP } = await rsvpToEvent({
        eventPK,
        tokenMintPK,
        authorityPK,
        rsvpStatus: 'accepted',
        invitePK,
        inviteID: id,
        inviteBump: bump,
      });

      const rsvp = await program.account.rsvp.fetch(rsvpPK, 'confirmed');
      expect(rsvp).toMatchObject({
        attendee: attendeeKP.publicKey,
        event: eventPK,
        status: { accepted: {} },
      });
    });
  });
});
