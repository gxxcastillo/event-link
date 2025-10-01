import { render } from 'solid-js/web';
import { type ConnectionConfig } from '@solana/web3.js';
import { type Ports } from '@eventlink/web-adapters';

import { App } from './components/App/App';

export interface CreateUIProps {
  endpoint: string;
  configs?: ConnectionConfig;
}

export function renderApplicationUI(ports: Ports, root: HTMLElement) {
  if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
      'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
    );
  }

  return render(() => <App {...ports} />, root);
}
