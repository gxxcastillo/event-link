import { describe, it, expect } from 'vitest';

import { createNewEvent, manyRsvpsToEvent, rsvpToEvent } from './fixtures.js';

describe('event_invites', () => {
  it('Can create an event', async () => {
    const {
      program,
      eventKP,
      args: { eventTitle, eventDescription, eventDate, eventMaxAttendees, eventMetadataUri },
    } = await createNewEvent();

    const eventState = await program.account.event.fetch(eventKP.publicKey);

    expect(eventState).toMatchObject({
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      metadataUri: eventMetadataUri,
      maxAttendees: eventMaxAttendees,
      numAttendees: 0,
    });
  });

  describe('rsvp()', () => {
    it('Users can rsvp to an event', async () => {
      const { program, eventKP, creatorKP, tokenMintKP } = await createNewEvent();

      // attendee 1
      const rsvp1 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'accepted',
      });
      const rsvp1State = await program.account.rsvp.fetch(rsvp1.rsvpPK);
      expect(rsvp1State).toMatchObject({
        attendee: rsvp1.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { accepted: {} },
      });

      // attendee 2
      const rsvp2 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'rejected',
      });
      const rsvp2State = await program.account.rsvp.fetch(rsvp2.rsvpPK);
      expect(rsvp2State).toMatchObject({
        attendee: rsvp2.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { rejected: {} },
      });

      // attendee 3
      const rsvp3 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'tentative',
      });
      const rsvp3State = await program.account.rsvp.fetch(rsvp3.rsvpPK);
      expect(rsvp3State).toMatchObject({
        attendee: rsvp3.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { tentative: {} },
      });

      // attendee 4
      const rsvp4 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'accepted',
      });
      const rsvp4State = await program.account.rsvp.fetch(rsvp4.rsvpPK);
      expect(rsvp4State).toMatchObject({
        attendee: rsvp4.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { accepted: {} },
      });

      const eventState2 = await program.account.event.fetch(eventKP.publicKey);
      expect(eventState2.numAttendees).toBe(2);
    });

    it('Users can update their rsvp', async () => {
      const { program, eventKP, creatorKP, tokenMintKP } = await createNewEvent();

      // attendee 1
      const rsvp1 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'accepted',
      });
      const rsvp1State = await program.account.rsvp.fetch(rsvp1.rsvpPK);
      expect(rsvp1State).toMatchObject({
        attendee: rsvp1.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { accepted: {} },
      });

      // attendee 2
      const rsvp2 = await rsvpToEvent({
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'accepted',
      });
      const rsvp2State = await program.account.rsvp.fetch(rsvp2.rsvpPK);
      expect(rsvp2State).toMatchObject({
        attendee: rsvp2.attendeeKP.publicKey,
        event: eventKP.publicKey,
        status: { accepted: {} },
      });

      // attendee 1 changes their rsvp
      const rsvp3 = await rsvpToEvent({
        eventKP,
        attendeeKP: rsvp1.attendeeKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'rejected',
      });
      const rsvp3State = await program.account.rsvp.fetch(rsvp3.rsvpPK);

      expect(rsvp1.attendeeAtaPK).toEqual(rsvp3.attendeeAtaPK);
      expect(rsvp1.rsvpPK).toEqual(rsvp3.rsvpPK);
      expect(rsvp1State.event).toEqual(rsvp3State.event);
      expect(rsvp1State.attendee).toEqual(rsvp3State.attendee);
      expect(rsvp3State.status).toEqual({ rejected: {} });

      const eventState2 = await program.account.event.fetch(eventKP.publicKey);
      expect(eventState2.numAttendees).toBe(1);
    });

    it('Does not allow > max_attendees', async () => {
      const { program, eventKP, creatorKP, tokenMintKP } = await createNewEvent({ maxAttendees: 4 });
      await manyRsvpsToEvent({
        numRsvps: 5,
        eventKP,
        tokenMintKP,
        creatorKP,
        rsvpStatus: 'accepted',
      });

      const eventState = await program.account.event.fetch(eventKP.publicKey);
      expect(eventState.numAttendees).toBe(4);
    });
  });
});
