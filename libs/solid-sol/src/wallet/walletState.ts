import { createStore } from 'solid-js/store';
import { WalletReadyState, type WalletAdapter } from '@solana/wallet-adapter-base';
import { Connection } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

import { WalletState, WalletStatus, type WalletStore } from './types';
import { mergeProps } from 'solid-js';

export interface CreateWalletStoreProps {
  connection: Connection;
}

export function getWalletStatus() {}

export function canConnect(walletStatus: WalletStatus) {
  return ['available', 'disconnected'].includes(walletStatus);
}

export function createWalletStore(props: CreateWalletStoreProps) {
  const wallet = new PhantomWalletAdapter();

  let walletStatus: WalletStatus;
  if (wallet.connected) {
    walletStatus = 'connected';
  } else if (wallet.connecting) {
    walletStatus = 'connecting';
  } else if (wallet.readyState === WalletReadyState.Installed) {
    walletStatus = 'available';
  } else {
    walletStatus = 'unavailable';
  }

  const initialState: WalletState = {
    connection: props.connection,
    walletStatus,
    wallets: [],
    wallet,
  };

  const [state, setState] = createStore<WalletState>(initialState);

  const getters = {
    get canConnect() {
      return canConnect(state.walletStatus);
    },

    get publicKey() {
      return state.wallet?.publicKey ?? undefined;
    },
  };

  function handleWalletConnectError(error: Error) {
    setState('walletStatus', 'available');
    throw error;
  }

  function handleWalletConnectSuccess() {
    setState('walletStatus', 'connected');
  }

  function handleWalletDisconnectError(error: Error) {
    setState('walletStatus', 'error');
    throw error;
  }

  function handleWalletDisconnectSuccess() {
    setState('walletStatus', 'disconnected');
  }

  function onSelectWallet(wallet: WalletAdapter) {
    console.log(wallet);
    // setState('wallet', wallet);
  }

  async function connect() {
    if (typeof state.wallet !== 'object') {
      console.info(`Unable to connect, wallet not defined`);
      return;
    }

    if (!canConnect(state.walletStatus)) {
      console.info(`Unable to connect, wallet status: ${state.walletStatus}`);
      return;
    }

    setState('walletStatus', 'connecting');
    state.wallet.connect().then(handleWalletConnectSuccess).catch(handleWalletConnectError);
  }

  async function disconnect() {
    if (typeof state.wallet !== 'object') {
      console.info(`Unable to disconnect, wallet not defined`);
      return;
    }

    setState('walletStatus', 'disconnecting');
    state.wallet.disconnect().then(handleWalletDisconnectSuccess).catch(handleWalletDisconnectError);
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

  return [
    mergeProps(state, getters),
    {
      select: onSelectWallet,
      connect,
      disconnect,
      sendTransaction,
      signTransaction,
      signAllTransactions,
      signMessage,
      signIn,
    },
  ] as WalletStore;
}
