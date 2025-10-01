import { ContextProvider } from '../../context/ContextProvider';
import { type ParentProps } from 'solid-js';
import { Router } from '@solidjs/router';
import { Suspense } from 'solid-js';
import { createRoutes } from '../../router';
import { type Ports } from '@eventlink/web-adapters';

import './App.css';

export function App(props: Ports & ParentProps) {
  const routes = createRoutes();

  return (
    <ContextProvider {...props}>
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>{routes}</Router>
    </ContextProvider>
  );
}
