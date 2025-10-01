import { For, Show } from 'solid-js';

import { type Event } from '@eventlink/web-sdk';
import { EventListItem } from '../EventListItem/EventListItem';
import { type PublicKey } from '@solana/web3.js';

export type EventListProps = {
  events: [PublicKey, Event][] | undefined;
};

export function EventList(props: EventListProps) {
  return (
    <ul>
      <Show when={props.events} fallback={<li>Loading...</li>} keyed>
        {(events) => {
          return (
            <For each={events}>
              {([pubkey, event]) => {
                return <EventListItem eventPubKey={pubkey} event={event} />;
              }}
            </For>
          );
        }}
      </Show>
    </ul>
  );
}
