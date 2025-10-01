import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { type PublicKey, type Connection } from '@solana/web3.js';

import idl from '../anchor/idl/event_link.json';

import {
  type ConnectedWallet,
  type CreateEventMetadata,
  type EventLinkIdl,
  type EventLinkProgram,
  type EventSettings,
} from './types';
import { createEvent, getEventInfo, getEvents } from './events';
import { createInvites, type CreateInvitesOptions } from './invites';

export class EventLink {
  private program: EventLinkProgram;

  constructor(connection: Connection, wallet: ConnectedWallet) {
    const provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(idl as EventLinkIdl, provider);
  }

  async createEvent(metadata: CreateEventMetadata, settings: EventSettings) {
    return createEvent(this.program, metadata, settings);
  }

  async createInvites(event: PublicKey, options: CreateInvitesOptions) {
    return createInvites(this.program, event, options);
  }

  async getEvents(creator: PublicKey) {
    return getEvents(this.program, creator);
  }

  async getEventInfo(eventPubKey: PublicKey) {
    return getEventInfo(this.program, eventPubKey);
  }

  rsvp() {}

  destroy() {
    // @TODO
  }
}
