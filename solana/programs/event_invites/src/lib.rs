use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

pub mod context;
pub mod error;
pub mod instructions;
pub mod state;

use context::*;
use state::*;

declare_id!("HvdMiRfuZs9M5KC5LcWpAQnetxHqKdyjqGVFvGvRm3WY");

#[program]
mod event_invite {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        title: String,
        description: String,
        date: String,
        max_invites: u32,
        metadata_uri: String
    ) -> ProgramResult {
        instructions::create_event(ctx, title, description, date, max_invites, metadata_uri)
    }

    pub fn rsvp(ctx: Context<RSVP>, response: RsvpResponse) -> Result<()> {
        instructions::rsvp(ctx, response)
    }
}
