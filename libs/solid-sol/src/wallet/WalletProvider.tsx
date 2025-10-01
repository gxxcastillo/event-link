import { type ParentProps } from 'solid-js';
import { createContext, useContext } from 'solid-js';
import { type Connection } from '@solana/web3.js';

import { type WalletService } from './walletService';
import { createWalletService } from './walletService';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';

export interface WalletProviderProps extends ParentProps {
  wallet: SignerWalletAdapter;
  connection: Connection;
}

export const WalletContext = createContext<WalletService | undefined>();

export function useWalletService(): WalletService {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('WalletContext not found. Make sure you wrapped your component with <WalletProvider>.');
  }
  return ctx;
}

export function WalletProvider(props: WalletProviderProps) {
  const service = createWalletService({ connection: props.connection, wallet: props.wallet });
  return <WalletContext.Provider value={service}>{props.children}</WalletContext.Provider>;
}
