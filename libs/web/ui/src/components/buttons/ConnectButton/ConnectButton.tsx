import { Show } from 'solid-js';

import { useWalletService } from '@eventlink/solid-sol';

export function ConnectButton() {
  async function onConnectClick() {
    try {
      await wallet.connect();
    } catch (error) {
      console.error(error);
    }
  }

  async function onDisconnectClick() {
    try {
      await wallet.disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  const wallet = useWalletService();

  // @TODO - Use Switch component to handle various connected states
  return (
    <Show when={wallet.status === 'connected'} fallback={<button onClick={onConnectClick}>connect</button>}>
      <button onClick={onDisconnectClick}>disconnect ({wallet.address ?? ''})</button>
    </Show>
  );
}
