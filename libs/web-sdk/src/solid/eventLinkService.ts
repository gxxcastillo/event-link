import { createSignal, createEffect, onCleanup, createMemo } from 'solid-js';
import { type Connection, type PublicKey } from '@solana/web3.js';
import { until } from '@solid-primitives/promise';
import { EventLink } from '../program/EventLink';
import {
  type Wallet,
  type ConnectedWallet,
  type CreateEventMetadata,
  type EventSettings,
} from '../program/types';

export type CreateEventLinkServiceOptions = {
  connection: Connection;
  wallet: Wallet;
};

export type EventLinkService = ReturnType<typeof createEventLinkService>;

export function createEventLinkService(options: CreateEventLinkServiceOptions) {
  async function createEvent(metadata: CreateEventMetadata, settings: EventSettings) {
    const eventLink = await ready();
    return eventLink.createEvent(metadata, settings);
  }

  async function getEvents(creator: PublicKey) {
    const eventLink = await ready();
    return eventLink.getEvents(creator);
  }

  async function getEventInfo(eventPubKey: PublicKey) {
    const eventLink = await ready();
    return eventLink.getEventInfo(eventPubKey);
  }

  async function createInvites(eventPubKey: PublicKey, options: { numInvites: number }) {
    const eventLink = await ready();
    return eventLink.createInvites(eventPubKey, options);
  }

  async function ready(): Promise<EventLink> {
    return until(eventLink).then((sdk) => sdk);
  }

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  options.wallet.on('connect', onConnect);
  options.wallet.on('disconnect', onDisconnect);

  createEffect(() => {
    if (!options.connection || !options.wallet || !isConnected()) {
      return;
    }

    const instance = new EventLink(options.connection, options.wallet as ConnectedWallet);
    setEventLink(instance);

    const onWalletDisconnect = () => {
      setEventLink(undefined);
      instance.destroy();
    };

    options.wallet.on('disconnect', onWalletDisconnect);

    onCleanup(() => {
      options.wallet.off('disconnect', onWalletDisconnect);
      instance.destroy();
    });
  });

  onCleanup(() => {
    options.wallet.off('connect', onConnect);
    options.wallet.off('disconnect', onDisconnect);
  });

  const [isConnected, setIsConnected] = createSignal<boolean>(options.wallet.connected);
  const [eventLink, setEventLink] = createSignal<EventLink>();
  const isReady = createMemo(() => !!eventLink());

  return {
    isReady,
    ready,
    createEvent,
    getEvents,
    getEventInfo,
    createInvites,
  };
}
