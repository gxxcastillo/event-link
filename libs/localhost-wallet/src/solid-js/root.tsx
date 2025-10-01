import { render } from 'solid-js/web';

import { LocalhostWalletUI } from './WalletUI/LocalhostWalletUI';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { type LocalhostWallet } from '../LocalhostWallet';
import { type Connection } from '@solana/web3.js';

export function renderLocalhostWalletUI(props: {
  connection: Connection;
  wallet: LocalhostWallet;
  walletAdapter: SignerWalletAdapter;
}) {
  const root = document.createElement('div');
  root.id = 'test-wallet-root';
  document.body.appendChild(root);

  return render(() => <LocalhostWalletUI {...props} />, root);
}
