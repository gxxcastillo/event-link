use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_spl::token::{ self, MintTo };

use crate::context::{ CreateEventAccounts, RsvpAccounts };
use crate::state::RsvpStatus;
use crate::error::ErrorCode;

pub fn create_event(
    ctx: Context<CreateEventAccounts>,
    title: String,
    description: String,
    date: String,
    max_attendees: u32,
    metadata_uri: String
) -> ProgramResult {
    let event = &mut ctx.accounts.event;
    event.creator = ctx.accounts.creator.key();
    event.token_mint = ctx.accounts.token_mint.key();
    event.title = title;
    event.description = description;
    event.date = date;
    event.metadata_uri = metadata_uri;
    event.max_attendees = max_attendees;
    event.num_attendees = 0;

    Ok(())
}

pub fn rsvp(ctx: Context<RsvpAccounts>, status: RsvpStatus) -> Result<()> {
    let event: &mut Account<crate::Event> = &mut ctx.accounts.event;
    let rsvp: &mut Account<crate::RSVP> = &mut ctx.accounts.rsvp;
    let prev_status: Option<RsvpStatus> = rsvp.status.clone();
    let current_status: Option<RsvpStatus> = Some(status.clone());

    if current_status == prev_status {
        return Ok(());
    }

    // if prev_response == accepted, we can assume that current_response != accepted
    if prev_status == Some(RsvpStatus::Accepted) && event.num_attendees > 0 {
        event.num_attendees -= 1;
    } else if status == RsvpStatus::Accepted {
        require!(event.max_attendees > event.num_attendees, ErrorCode::MaxAttendeesReached);

        let cpi_accounts: MintTo = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.attendee_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_program: AccountInfo = ctx.accounts.token_program.to_account_info();
        let cpi_context: CpiContext<MintTo> = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_context, 1)?;

        event.num_attendees += 1;
    }

    if rsvp.event == Pubkey::default() {
        rsvp.event = ctx.accounts.event.key();
        rsvp.attendee = ctx.accounts.attendee.key();
    }

    rsvp.status = Some(status);
    Ok(())
}
