import { createStore } from 'solid-js/store';
import { type SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { WalletReadyState, type WalletAdapter } from '@solana/wallet-adapter-base';
import { type Connection } from '@solana/web3.js';

import { type WalletState, type WalletStatus } from './types';
import { createEffect, createMemo, onCleanup } from 'solid-js';

export type WalletService = ReturnType<typeof createWalletService>;

export type CreateWalletStoreProps = {
  connection: Connection;
  wallet: SignerWalletAdapter;
};

export function createWalletService(props: CreateWalletStoreProps) {
  function handleWalletConnectError(error: Error) {
    setState('status', 'available');
    throw error;
  }

  function handleWalletConnectSuccess() {
    setState('status', 'connected');
  }

  function handleWalletDisconnectError(error: Error) {
    setState('status', 'error');
    throw error;
  }

  function handleWalletDisconnectSuccess() {
    setState('status', 'disconnected');
  }

  function selectWallet(wallet: WalletAdapter) {
    console.log('@TODO IMPLEMENT', wallet);
  }

  async function connect() {
    const currentWallet = wallet();

    if (typeof currentWallet !== 'object') {
      console.info(`Unable to connect, wallet not defined`);
      return;
    }

    if (currentWallet.publicKey && currentWallet.publicKey.toBase58() !== state.address) {
      await disconnect();
    }

    if (!canConnect(state.status)) {
      console.info(`Unable to connect, wallet status: ${state.status}`);
      return;
    }

    setState('status', 'connecting');
    currentWallet.connect().then(handleWalletConnectSuccess).catch(handleWalletConnectError);
  }

  async function disconnect() {
    const currentWallet = wallet();

    if (typeof currentWallet !== 'object') {
      console.info(`Unable to disconnect, wallet not defined`);
      return;
    }

    setState('status', 'disconnecting');
    currentWallet.disconnect().then(handleWalletDisconnectSuccess).catch(handleWalletDisconnectError);
  }

  async function refresh() {
    const currentWallet = wallet();

    if (!currentWallet?.connected || !currentWallet.publicKey) {
      return;
    }

    try {
      const bal = await connection().getBalance(currentWallet.publicKey);
      setState('balance', bal);
    } catch (error) {
      console.error(`Failed to refresh balance`, error);
      setState('error', error);
    }
  }

  function sendTransaction() {
    return '';
  }

  function signTransaction() {
    return '';
  }

  function signAllTransactions() {
    return [''];
  }

  function signMessage() {
    return '';
  }

  function signIn() {}

  const wallet = createMemo(() => props.wallet);
  const connection = createMemo(() => props.connection);

  const status = resolveWalletStatus(props.wallet);
  const initialState: WalletState = {
    status,
    wallets: [],
  };

  const [state, setState] = createStore<WalletState>(initialState);

  createEffect(() => {
    async function onConnect() {
      const currentWallet = wallet();
      const currentConnection = connection();
      const pubkey = currentWallet.publicKey;

      setState('status', 'connected');
      setState('address', pubkey?.toString());
      if (pubkey) {
        try {
          const lamports = await currentConnection.getBalance(pubkey);
          setState('balance', lamports);
        } catch (err) {
          console.error('[WalletService] Failed to fetch balance on connect', err);
          setState('error', err as Error);
        }
      }
    }

    function onDisconnect() {
      setState('status', 'disconnected');
      setState('address', undefined);
      setState('balance', undefined);
    }

    const currentWallet = wallet();
    if (!currentWallet) {
      return;
    }

    currentWallet.on('connect', onConnect);
    currentWallet.on('disconnect', onDisconnect);

    onCleanup(() => {
      currentWallet.off('connect', onConnect);
      currentWallet.off('disconnect', onDisconnect);
    });
  });

  return {
    get status() {
      return state.status;
    },

    get error() {
      return state.error;
    },

    get balance() {
      return state.balance;
    },

    get address() {
      return state.address;
    },

    get wallets() {
      return state.wallets;
    },

    get canConnect() {
      return canConnect(state.status);
    },

    get wallet() {
      return wallet();
    },

    get connection() {
      return connection();
    },
    selectWallet,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    signIn,
    refresh,
  };
}

export function canConnect(walletStatus: WalletStatus) {
  return ['available', 'disconnected'].includes(walletStatus);
}

export function resolveWalletStatus(wallet: SignerWalletAdapter): WalletStatus {
  if (wallet.connected) return 'connected';
  if (wallet.connecting) return 'connecting';
  if (wallet.readyState === WalletReadyState.Installed) return 'available';
  return 'unavailable';
}
