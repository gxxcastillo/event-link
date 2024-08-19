import { createAsyncStore } from '@solidjs/router';
import { CompleteIcon, IncompleteIcon } from '@eventlink/web-components';
import { EventsList } from '../EventsList/EventsList';
import { CreateEventForm } from '../CreateEventForm/CreateEventForm';

export function Home() {
  async function getEvents() {
    return [];
  }

  const events = createAsyncStore(() => getEvents(), { initialValue: [], deferStream: true });

  return (
    <section class="Home">
      <CreateEventForm />
      <EventsList events={events()} />
      <CompleteIcon />
      <IncompleteIcon />
    </section>
  );
}
