import { Show } from 'solid-js';

import { useWalletProviderMutations, useWalletProviderState } from '@eventlink/solid-sol';

export function ConnectButton() {
  async function onConnectClick() {
    try {
      await connect();
    } catch (error) {
      console.error(error);
    }
  }

  async function onDisconnectClick() {
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  const wallet = useWalletProviderState();
  const { connect, disconnect } = useWalletProviderMutations();

  // @TODO - Use Switch component to handle various connected states
  return (
    <Show
      when={wallet.walletStatus !== 'connected'}
      fallback={
        <button onClick={onDisconnectClick}>disconnect ({wallet.publicKey?.toString() ?? ''})</button>
      }
    >
      <button onClick={onConnectClick}>connect</button>
    </Show>
  );
}
