import { SignerWalletAdapter, WalletAdapter } from '@solana/wallet-adapter-base';
import { Connection, PublicKey } from '@solana/web3.js';

export type WalletState = {
  connection: Connection | undefined;
  walletStatus: WalletStatus;
  wallets: SignerWalletAdapter[];
  wallet: SignerWalletAdapter | undefined;
};

export type WalletStateGetters = {
  canConnect: boolean;
  publicKey: PublicKey | undefined;
};

export type WalletStore = [WalletState & WalletStateGetters, WalletStateMutations];

export type WalletStatus =
  | 'error'
  | 'unavailable'
  | 'available'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';

export type WalletStateMutations = {
  select: (wallet: WalletAdapter) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: () => string;
  signTransaction: () => string;
  signAllTransactions: () => string[];
  signMessage: () => string;
  signIn: () => void;
};
