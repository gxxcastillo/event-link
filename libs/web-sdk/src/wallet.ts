import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

export async function connectWallet() {
  const wallet = new PhantomWalletAdapter();
  await wallet.connect();

  if (!wallet.connected) {
    console.error('Wallet not connected');
    return;
  }

  return wallet;
}
