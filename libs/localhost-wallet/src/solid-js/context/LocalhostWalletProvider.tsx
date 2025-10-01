import { type ParentProps } from 'solid-js';
import { createContext, createResource, Show, useContext } from 'solid-js';
import { type LocalhostWallet } from '../../LocalhostWallet';

const LocalhostWalletContext = createContext<LocalhostWallet>();

export function useLocalhostWallet() {
  const ctx = useContext(LocalhostWalletContext);
  if (!ctx) {
    throw new Error(
      'LocalhostWalletContext not found. Make sure you wrapped your component with <LocalhostWalletProvider>.'
    );
  }

  return ctx;
}

export function LocalhostWalletProvider(props: ParentProps & { wallet: LocalhostWallet }) {
  // Create a resource that resolves once wallet.load() resolves
  const [loaded] = createResource(async () => {
    await props.wallet.load();
    return props.wallet;
  });

  return (
    <Show when={loaded()} fallback="loading wallets...">
      <LocalhostWalletContext.Provider value={props.wallet}>{props.children}</LocalhostWalletContext.Provider>
    </Show>
  );
}
