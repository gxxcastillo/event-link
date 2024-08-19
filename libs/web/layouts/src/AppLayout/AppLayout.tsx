import { ParentProps } from 'solid-js';

import { SiteHeader } from '@eventlink/web-components';

export type AppLayoutProps = {
  title: string;
};

export function AppLayout(props: ParentProps<AppLayoutProps>) {
  return (
    <div>
      <SiteHeader />
      {props.children}
    </div>
  );
}
