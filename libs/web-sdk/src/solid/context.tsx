import { Accessor, createContext, createEffect, createSignal, ParentProps } from 'solid-js';
import { EventLink } from '../program/EventLink';
import { Connection } from '@solana/web3.js';
import { ConnectedWallet, Wallet } from '../program/types';

export interface EventLinkProviderProps extends ParentProps {
  connection?: Connection;
  wallet?: Wallet;
}

export const EventLinkContext = createContext<Accessor<EventLink | undefined>>();

export function EventLinkProvider(props: EventLinkProviderProps) {
  const [apiClient, setApiClient] = createSignal<EventLink>();

  createEffect(() => {
    if (props.wallet) {
      props.wallet.on('connect', () => {
        setApiClient((prevApiClient) => {
          if (prevApiClient) {
            prevApiClient.destroy();
          }

          if (!props.connection || !props.wallet) {
            console.log('Lost connection before initialization');
            return;
          }

          return new EventLink(props.connection, props.wallet as ConnectedWallet);
        });
      });
    }
  });

  return <EventLinkContext.Provider value={apiClient}>{props.children}</EventLinkContext.Provider>;
}
