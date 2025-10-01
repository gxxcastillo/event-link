import { Connection, type ConnectionConfig } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';

import { LocalhostWallet, LocalhostWalletAdapter } from '@eventlink/localhost-wallet';
import { storage } from './web-storage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWallet = Record<string, any>;
export type PhantomWallet = Record<string, unknown>;

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomWallet;
    };
  }
}

export type Ports = {
  wallet: AnyWallet;
  walletAdapter: SignerWalletAdapter;
  connection: Connection;
};

export function createAdapters() {
  const endpoint = import.meta.env.VITE_NETWORK;
  const connectionConfigs: ConnectionConfig = { commitment: 'confirmed' };
  const connection = new Connection(endpoint, connectionConfigs);

  if (import.meta.env.DEV) {
    const wallet = new LocalhostWallet({ storage });
    const walletAdapter = new LocalhostWalletAdapter(wallet);

    return {
      connection,
      wallet,
      walletAdapter,
    };
  }

  const wallet = window.phantom?.solana;
  if (wallet) {
    const walletAdapter = new PhantomWalletAdapter();
    return {
      connection,
      wallet,
      walletAdapter,
    };
  }

  throw new Error('Unrecognized wallet');
}
