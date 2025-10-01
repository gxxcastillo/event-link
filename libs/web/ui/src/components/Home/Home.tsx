import { createResource } from 'solid-js';

import { useEventLink } from '@eventlink/web-sdk/solid';

import { useWalletService } from '@eventlink/solid-sol';
import { PublicKey } from '@solana/web3.js';

import { EventList } from '../EventList/EventList';
import { CreateEventForm } from '../CreateEventForm/CreateEventForm';
import { CompleteIcon, IncompleteIcon } from '../Icons/Icons';
import { CreateInvitesForm } from '../CreateInvitesForm/CreateInvitesForm';

export function Home() {
  async function getEvents(address: string) {
    if (!eventLink) {
      console.error('!!!! event link not initialized');
      return [];
    }

    if (!address) {
      console.info('!!!! not connected');
      return [];
    }

    return eventLink.getEvents(new PublicKey(address));
  }

  const eventLink = useEventLink();
  const wallet = useWalletService();
  const [events] = createResource(() => wallet.address ?? '', getEvents);

  return (
    <section class="Home">
      <CreateEventForm />
      <EventList events={events()} />
      <CreateInvitesForm />
      <CompleteIcon />
      <IncompleteIcon />
    </section>
  );
}
