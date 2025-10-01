import { WalletProvider } from '@eventlink/solid-sol';

import { LocalhostWalletHeader } from './LocalHostWalletHeader';
import { LocalhostWalletActions } from './LocalhostWalletActions';

import styles from './LocalhostWalletUI.module.css';
import { LocalhostWalletProvider } from '../context/LocalhostWalletProvider';
import { type LocalhostWallet } from '../../LocalhostWallet';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { type Connection } from '@solana/web3.js';

export type LocalhostWalletUIProps = {
  wallet: LocalhostWallet;
  walletAdapter: SignerWalletAdapter;
  connection: Connection;
};

export function LocalhostWalletUI(props: LocalhostWalletUIProps) {
  return (
    <WalletProvider wallet={props.walletAdapter} connection={props.connection}>
      <LocalhostWalletProvider wallet={props.wallet}>
        <dialog class={styles.LocalhostWalletUI} open={true}>
          <LocalhostWalletHeader />
          <LocalhostWalletActions />
        </dialog>
      </LocalhostWalletProvider>
    </WalletProvider>
  );
}
