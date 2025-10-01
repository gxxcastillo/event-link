import { createResource, Show } from 'solid-js';
import { type Event } from '@eventlink/web-sdk';
import { type PublicKey } from '@solana/web3.js';
import { useEventLink } from '@eventlink/web-sdk/solid';
import logger from 'loglevel';

export type EventListItemProps = {
  eventPubKey: PublicKey;
  event: Event;
};

export function EventListItem(props: EventListItemProps) {
  async function getEventInfo() {
    try {
      return eventLink.getEventInfo(props.eventPubKey);
    } catch (error) {
      logger.log('Enable to fetch event info', error);
    }
  }

  const eventLink = useEventLink();
  const [eventInfo] = createResource(props.eventPubKey, getEventInfo);

  return (
    <li class="EventListItem">
      <Show when={eventInfo()} fallback="Loading..." keyed>
        {(info) => (
          <h4>
            <div>
              {info.metadata.title} {info.metadata.metadataUri} - {info.settings.maxAttendees}
            </div>
            <div>{props.event.numInvites}</div>
          </h4>
        )}
      </Show>

      <div class="text-sm text-gray-600">
        <div>Event PK: {props.eventPubKey.toBase58()}</div>
        <div>Authority: {props.event.authority.toBase58()}</div>
      </div>
    </li>
  );
}
