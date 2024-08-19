import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';

import idl from '../anchor/idl/event_invite.json';

import { ConnectedWallet, CreateEventMetadata, EventLinkIdl, EventLinkProgram, EventSettings } from './types';
import { createEvent } from './events';
import { createInvites } from './invites';

export class EventLink {
  private program: EventLinkProgram;

  constructor(connection: Connection, wallet: ConnectedWallet) {
    const provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(idl as EventLinkIdl, provider);
  }

  createEvent(metadata: CreateEventMetadata, settings: EventSettings) {
    return createEvent(this.program, metadata, settings);
  }

  createInvites(event: PublicKey, options: { numInvites: number }) {
    return createInvites(this.program, event, options);
  }

  rsvp() {}

  destroy() {
    // @TODO
  }
}
