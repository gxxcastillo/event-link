import { lazy } from 'solid-js';
import { routes } from '@eventlink/web-routes';

export const routerConfig = [
  {
    path: routes.root,
    component: lazy(() => import('@eventlink/web-pages/Home')),
    children: [
      {
        path: routes.home,
        components: lazy(() => import('@eventlink/web-pages/Home')),
      },
    ],
  },
  {
    path: '/*all',
    component: () => null,
  },
];
