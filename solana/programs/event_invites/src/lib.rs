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
        event_date: i64,
        max_attendees: u32,
        metadata_uri: String,
        is_invite_only: bool,
        initial_funds: u64
    ) -> ProgramResult {
        instructions::create_event(
            ctx,
            event_date,
            max_attendees,
            metadata_uri,
            is_invite_only,
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
        invite_id: Option<u32>,
        invite_bump: Option<u8>
    ) -> ProgramResult {
        if let Err(error) = instructions::rsvp(ctx, status, invite_id, invite_bump) {
            msg!("{:?}", error);
            return Err(error.into());
        }
        Ok(())
    }
}
