import { type ParentProps } from 'solid-js';
import { type ConnectionConfig } from '@solana/web3.js';

import { WalletProvider } from '@eventlink/solid-sol';
import { AdapterProvider } from '@eventlink/web-adapter';

export interface AppRouteProps extends ParentProps {
  endpoint: string;
  configs?: ConnectionConfig;
}

export function AppRoute(props: AppRouteProps) {
  console.log('props', props);
  return (
    <WalletProvider endpoint={props.endpoint} configs={props.configs}>
      <AdapterProvider>{props.children}</AdapterProvider>
    </WalletProvider>
  );
}

export default AppRoute;
