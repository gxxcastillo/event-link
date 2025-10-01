import { AppLayout } from '../../layouts/AppLayout/AppLayout';
import { Home } from '../../components/Home/Home';

export function HomePage() {
  // @TODO connect wallet, list all events that I am the owner of (e.g. I am the authority)
  return (
    <AppLayout title="Home">
      <Home />
    </AppLayout>
  );
}

export default HomePage;
