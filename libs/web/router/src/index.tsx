import { lazy } from 'solid-js';
import { type RouteDefinition } from '@solidjs/router';
import { type ConnectionConfig } from '@solana/web3.js';
import { routes } from '@eventlink/web-routes';

export interface CreateRouteProps {
  endpoint: string;
  configs?: ConnectionConfig;
}

export function createRoutes(routeProps: CreateRouteProps) {
  if (!routeProps.endpoint) {
    throw new Error('ENDPOINT NOT DEFINED');
  }

  const routerConfig: RouteDefinition = {
    path: routes.root,
    component: (props) => {
      const AppRoute = lazy(() => import('@eventlink/web-pages/AppRoute'));
      return (
        <AppRoute endpoint={routeProps.endpoint} configs={routeProps.configs}>
          {props.children}
        </AppRoute>
      );
    },
    children: [
      {
        path: routes.root,
        component: lazy(() => import('@eventlink/web-pages/Home')),
      },
      {
        path: routes.view,
        component: lazy(() => import('@eventlink/web-pages/View')),
      },
    ],
  };

  return routerConfig;
}
