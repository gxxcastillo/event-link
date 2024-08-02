use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

pub mod context;
pub mod error;
pub mod instructions;
pub mod state;

use context::*;
use state::*;
use instructions::*;

declare_id!("HvdMiRfuZs9M5KC5LcWpAQnetxHqKdyjqGVFvGvRm3WY");

#[program]
mod event_invite {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEventAccounts>,
        id: [u8; 9],
        metadata: EventMetadata,
        settings: EventSettings,
        initial_funds: u64,
    ) -> ProgramResult {
        instructions::create_event(
            ctx,
            id,
            metadata,
            settings,
            initial_funds
        )
    }

    pub fn create_invites<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateInvitesAccounts<'info>>,
        keys: Vec<InviteKeys>
    ) -> ProgramResult {
        if let Err(error) = instructions::create_invites(ctx, keys) {
            msg!("{:?}", error);
            return Err(error.into());
        }
        Ok(())
    }

    pub fn rsvp(
        ctx: Context<RsvpAccounts>,
        status: RsvpStatus,
        invite_id: Option<[u8; 6]>,
        invite_bump: Option<u8>,
    ) -> ProgramResult {
        if let Err(error) = instructions::rsvp(ctx, status, invite_id, invite_bump) {
            msg!("{:?}", error);
            return Err(error.into());
        }
        Ok(())
    }
}
