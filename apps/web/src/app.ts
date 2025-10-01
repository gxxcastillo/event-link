/* @refresh reload */
import 'solid-devtools';

import { renderApplicationUI } from '@eventlink/web-ui';
import { type Ports, createAdapters } from '@eventlink/web-adapters';
import { type LocalhostWallet } from 'libs/localhost-wallet/src';

export async function createClientApplication() {
  const adapters = createAdapters();
  const uiPromise = renderClientApplication(adapters);

  if (import.meta.env.DEV) {
    await Promise.all([uiPromise, renderTestWalletUI(adapters)]);
  }

  await uiPromise;
  return adapters;
}

export async function renderClientApplication(ports: Ports) {
  const root = document.getElementById('root') as HTMLElement;

  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
    );
  }

  return renderApplicationUI(ports, root);
}

export async function renderTestWalletUI(ports: Ports) {
  const { renderLocalhostWalletUI } = await import('@eventlink/localhost-wallet/solid');

  return renderLocalhostWalletUI({
    walletAdapter: ports.walletAdapter,
    wallet: ports.wallet as LocalhostWallet,
    connection: ports.connection,
  });
}
