import { For } from 'solid-js';

import { Event } from '@eventlink/web-sdk';

export type EventsListProps = {
  events: Event[];
};

export function EventsList(props: EventsListProps) {
  function filterList(events: Event[]) {
    return events;
  }

  return (
    <For each={filterList(props.events)}>
      {(event) => {
        return <div>{event.authority.toString()}</div>;
      }}
    </For>
  );
}
