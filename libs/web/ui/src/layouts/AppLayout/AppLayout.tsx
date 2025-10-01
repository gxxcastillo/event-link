import { type ParentProps } from 'solid-js';
import { SiteHeader } from '../../components/SiteHeader/SiteHeader';

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
