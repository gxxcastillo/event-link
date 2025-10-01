import { type IdlTypes, type Program } from '@coral-xyz/anchor';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { type PublicKey } from '@solana/web3.js';

import { type EventLink } from '../anchor/types/event_link';

type EventLinkTypes = IdlTypes<EventLink>;

export type EventLinkProgram = Program<EventLink>;
export type Event = EventLinkTypes['event'];
export type EventInfo = EventLinkTypes['eventInfo'];

export type RsvpStatus = EventLinkTypes['rsvpStatus'];
export type RsvpStatusKey = keyof RsvpStatus;

export type EventStatus = EventLinkTypes['eventStatus'];
export type EventStatusKey = keyof EventStatus;

export type EventMetadata = EventLinkTypes['eventMetadata'];
export type EventSettings = EventLinkTypes['eventSettings'];

export type CreateEventMetadata = Omit<EventMetadata, 'date' | 'status'> & {
  date: string;
  status: EventStatusKey;
};

export type Wallet = SignerWalletAdapter;
export type ConnectedWallet = Omit<Wallet, 'publicKey'> & { publicKey: PublicKey };

export { type EventLink as EventLinkIdl };
