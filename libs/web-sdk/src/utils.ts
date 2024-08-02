import { workspace, type Program } from '@coral-xyz/anchor';
import { EventInvite } from './anchor/types/event_invite';

export const events = workspace.EventInvite as Program<EventInvite>;
