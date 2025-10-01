import { type ParentProps } from 'solid-js';
import { createContext } from 'solid-js';

import { useWalletService, WalletProvider } from '@eventlink/solid-sol';
import { EventLinkProvider } from '@eventlink/web-sdk/solid';
import { type Ports } from '@eventlink/web-adapters';

export const AdapterContext = createContext();

export function ContextProvider(props: Ports & ParentProps) {
  return (
    <WalletProvider wallet={props.walletAdapter} connection={props.connection}>
      <EventLinkProviderWithProps>{props.children}</EventLinkProviderWithProps>
    </WalletProvider>
  );
}

export function EventLinkProviderWithProps(props: ParentProps) {
  const wallet = useWalletService();
  return (
    <EventLinkProvider wallet={wallet.wallet} connection={wallet.connection}>
      {props.children}
    </EventLinkProvider>
  );
}
