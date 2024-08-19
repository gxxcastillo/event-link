import { Home } from '@eventlink/web-components';
import { AppLayout } from '@eventlink/web-layouts';

export function HomePage() {
  // @TODO connect wallet, list all events that I am the owner of (e.g. I am the authority)
  return (
    <AppLayout title="Home">
      <Home />
    </AppLayout>
  );
}

export default HomePage;
