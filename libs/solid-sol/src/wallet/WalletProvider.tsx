import { createContext, ParentProps } from 'solid-js';

import { createWalletStore } from './walletState';
import { WalletStore } from './types';
import { Connection, type ConnectionConfig } from '@solana/web3.js';

export interface ConnectionProviderProps extends ParentProps {
  endpoint: string;
  configs?: ConnectionConfig;
}

export const WalletContext = createContext<WalletStore>({} as WalletStore);

export function WalletProvider(props: ConnectionProviderProps) {
  const connection = new Connection(props.endpoint, props.configs);
  const store = createWalletStore({ connection });

  return <WalletContext.Provider value={store}>{props.children}</WalletContext.Provider>;
}
