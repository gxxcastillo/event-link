import { lazy } from 'solid-js';
import { type RouteDefinition } from '@solidjs/router';
import { routes } from '@eventlink/web-routes';

export function createRoutes() {
  const routerConfig: RouteDefinition = {
    children: [
      {
        path: routes.root,
        component: lazy(() => import('../pages/HomePage/HomePage')),
      },
      {
        path: routes.view,
        component: lazy(() => import('../pages/ViewPage/ViewPage')),
      },
    ],
  };

  return routerConfig;
}
