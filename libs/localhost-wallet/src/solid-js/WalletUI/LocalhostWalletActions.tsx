import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import logger from 'loglevel';
import { Show } from 'solid-js';

import { useWalletService } from '@eventlink/solid-sol';
import { useLocalhostWallet } from '../context/LocalhostWalletProvider';

import styles from './LocalhostWalletActions.module.css';

export function LocalhostWalletActions() {
  async function requestAirdrop() {
    const address = wallet.address;
    const connection = wallet.connection;

    if (!address) {
      logger.warn('Failed to request airdrop. Wallet not connected to an account.');
      return;
    }

    console.log(`REquesting an airdrop`);
    const signature = await connection.requestAirdrop(new PublicKey(address), 1 * LAMPORTS_PER_SOL);
    console.log(`Airdrop transaction submitted: ${signature}`);

    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash,
    });

    console.log(`Airdrop confirmed.`);
    wallet.refresh();
  }

  async function signMessage() {
    const msg = new TextEncoder().encode('Hello from localhost wallet');
    logger.error('NOT SET UP YET', msg);
  }

  async function saveKeypair() {
    localHostWallet.saveActiveKeypair();
  }

  async function createKeypair() {
    const keypair = await localHostWallet.createKeypair();
    await localHostWallet.saveKeypair(keypair);
  }

  async function selectKeypair() {
    await localHostWallet.loadKeypair();
    wallet.connect();
  }

  const wallet = useWalletService();
  const localHostWallet = useLocalhostWallet();

  return (
    <div class={styles.LocalhostWalletActions}>
      <Show
        when={wallet.status === 'connected'}
        fallback={
          <>
            <button class="btn" onClick={wallet.connect}>
              Connect
            </button>
            <button class="btn" onClick={selectKeypair}>
              Load Keypair
            </button>
          </>
        }
      >
        <button class="btn" onClick={wallet.disconnect}>
          Disconnect
        </button>
        <button class="btn" onClick={requestAirdrop}>
          Request Airdrop
        </button>
        <button class="btn" onClick={signMessage}>
          Sign Message
        </button>
        <button class="btn" onClick={saveKeypair}>
          Save Keypair
        </button>
        <button class="btn" onClick={createKeypair}>
          Create Keypair
        </button>
        <button class="btn" onClick={selectKeypair}>
          Load Keypair
        </button>
      </Show>
    </div>
  );
}
