export type WalletState = {
  status: WalletStatus;
  error?: unknown;
  balance?: number;
  address?: string;
  wallets: string[];
};

export type WalletStatus =
  | 'error'
  | 'unavailable'
  | 'available'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';
