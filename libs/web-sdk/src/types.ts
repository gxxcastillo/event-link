import { IdlTypes } from '@coral-xyz/anchor';
import { EventInvite } from './anchor/types/event_invite';

export type Event = IdlTypes<EventInvite>['eventInfo'];
export type EventInfo = IdlTypes<EventInvite>['eventInfo'];
export type RsvpStatus = IdlTypes<EventInvite>['rsvpStatus'];
export type RsvpStatusKey = keyof RsvpStatus;
