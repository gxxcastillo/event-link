import { type Connection } from '@solana/web3.js';
import { useContext } from 'solid-js';

import { type ParentProps } from 'solid-js';
import { createContext } from 'solid-js';
import { type Wallet } from '../program/types';
import { type EventLinkService } from './eventLinkService';
import { createEventLinkService } from './eventLinkService';

export interface EventLinkProviderProps extends ParentProps {
  connection: Connection;
  wallet: Wallet;
}

export const EventLinkContext = createContext<EventLinkService>();

export function useEventLink(): EventLinkService {
  const ctx = useContext(EventLinkContext);
  if (!ctx) {
    throw new Error(
      'EventLinkContext not found. Make sure you wrapped your component with <EventLinkProvider>.'
    );
  }
  return ctx;
}

export function EventLinkProvider(props: EventLinkProviderProps) {
  const store = createEventLinkService(props);
  return <EventLinkContext.Provider value={store}>{props.children}</EventLinkContext.Provider>;
}
