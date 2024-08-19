import { Router } from '@solidjs/router';
import { Suspense } from 'solid-js';

import { type CreateRouteProps, createRoutes } from '@eventlink/web-router';

import './app.css';

export default function App() {
  const props: CreateRouteProps = {
    endpoint: import.meta.env.VITE_NETWORK,
    configs: { commitment: 'confirmed' },
  };

  const routes = createRoutes(props);
  return <Router root={(props) => <Suspense>{props.children}</Suspense>}>{routes}</Router>;
}
