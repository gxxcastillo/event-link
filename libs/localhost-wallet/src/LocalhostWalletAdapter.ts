import { type TransactionOrVersionedTransaction, type WalletName } from '@solana/wallet-adapter-base';
import {
  BaseSignerWalletAdapter,
  isVersionedTransaction,
  WalletNotConnectedError,
  WalletReadyState,
  WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import { type LocalhostWallet } from './LocalhostWallet';

import { type PublicKey } from '@solana/web3.js';

export class LocalhostWalletAdapter extends BaseSignerWalletAdapter<'LocalhostWallet'> {
  name = 'LocalhostWallet' as WalletName<'LocalhostWallet'>;
  url = 'https://localhost-wallet';
  icon = '🔧';
  readyState = WalletReadyState.Installed;
  supportedTransactionVersions: Set<0 | 'legacy'> = new Set(['legacy']);

  private _connected = false;
  private _connecting = false;

  constructor(private wallet: LocalhostWallet) {
    super();

    // This would be nice but the ui doesn't update correctly (it won't show the wallet address or balance)
    // try to get it working again later...for now keep using the wallet class directly and manually calling connect
    // (what this tries to solve for is to avoid having to manually click the connect button if a wallet is auto-loaded)
    // wallet.load().then((wallets) => {
    //   const numWallets = wallets.size;
    //   if (numWallets > 0) {
    //     console.log(`!!!! ${numWallets} found, auto connecting...`)
    //     return this.autoConnect();
    //   }
    // });
  }

  get publicKey() {
    return this.wallet.keypairs.activeKeypair?.publicKey ?? null;
  }

  override get connected() {
    return this._connected;
  }

  get connecting() {
    return this._connecting;
  }

  async connect(): Promise<void> {
    if (this._connected || this._connecting) {
      return;
    }

    this._connecting = true;

    if (!this.publicKey) {
      await this.wallet.loadKeypair();
    }

    if (!this.publicKey) {
      this._connecting = false;
      throw new Error('Failed to connect');
    }

    this._connected = true;
    this._connecting = false;
    this.emit('connect', this.publicKey as PublicKey);
  }

  async disconnect(): Promise<void> {
    if (!this._connected) {
      return;
    }

    this._connected = false;
    this.emit('disconnect');
  }

  async signTransaction<T extends TransactionOrVersionedTransaction<this['supportedTransactionVersions']>>(
    transaction: T
  ): Promise<T> {
    if (!this._connected || !this.wallet.keypair) {
      throw new WalletNotConnectedError();
    }

    if (isVersionedTransaction(transaction)) {
      throw new WalletSignTransactionError(`Versioned transactions are not supported by LocalhostWallet`);
    }

    transaction.partialSign(this.wallet.keypair);
    return transaction;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this._connected) throw new WalletNotConnectedError();
    return this.wallet.signMessage(message);
  }
}
