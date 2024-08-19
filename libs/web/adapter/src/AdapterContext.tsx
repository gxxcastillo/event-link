import { createContext, ParentProps } from 'solid-js';

import { useWalletProviderState } from '@eventlink/solid-sol';
import { EventLinkProvider } from '@eventlink/web-sdk/solid';

export const AdapterContext = createContext();

export function AdapterProvider(props: ParentProps) {
  const walletState = useWalletProviderState();

  return (
    <EventLinkProvider wallet={walletState.wallet} connection={walletState.connection}>
      <AdapterContext.Provider value={{}}>{props.children}</AdapterContext.Provider>
    </EventLinkProvider>
  );
}
