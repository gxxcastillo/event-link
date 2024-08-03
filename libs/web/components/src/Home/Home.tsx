import { createAsyncStore } from '@solidjs/router';
import { For } from 'solid-js';
import { CompleteIcon, IncompleteIcon } from '@eventlink/web-components';
import { Event } from '@eventlink/web-sdk/types';

export function Home() {
  async function getEvents() {
    return [];
  }

  function filterList(events: Event[]) {
    return events;
  }

  const events = createAsyncStore(() => getEvents(), { initialValue: [], deferStream: true });

  return (
    <section class="Home">
      <header>
        <h1>Events</h1>
        <For each={filterList(events())}>
          {(event) => {
            return <div>{event.authority.toString()}</div>;
          }}
        </For>
        <CompleteIcon />
        <IncompleteIcon />
      </header>
    </section>
  );
}
