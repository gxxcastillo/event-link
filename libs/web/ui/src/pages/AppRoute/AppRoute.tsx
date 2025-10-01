import { type ParentProps } from 'solid-js';
import { type ConnectionConfig } from '@solana/web3.js';

import { ContextProvider } from '../../context/ContextProvider';

export interface AppRouteProps extends ParentProps {
  wallet: string;
  connection: ConnectionConfig;
}

export function AppRoute(props: AppRouteProps) {
  return (
    <ContextProvider wallet={props.wallet} connection={props.connection}>
      {props.children}
    </ContextProvider>
  );
}

export default AppRoute;
