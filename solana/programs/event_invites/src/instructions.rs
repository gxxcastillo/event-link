use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_spl::token::{ self, MintTo };

use crate::context::{ CreateEvent, RSVP };
use crate::state::RsvpResponse;
use crate::error::ErrorCode;

pub fn create_event(
    ctx: Context<CreateEvent>,
    title: String,
    description: String,
    date: String,
    max_attendees: u32,
    metadata_uri: String
) -> ProgramResult {
    let event = &mut ctx.accounts.event;
    event.title = title;
    event.description = description;
    event.date = date;
    event.creator = ctx.accounts.creator.key();
    event.token_mint = ctx.accounts.token_mint.key();
    event.metadata_uri = metadata_uri;
    event.max_attendees = max_attendees;
    event.num_attendees = 0;
    event.fee_payer = ctx.accounts.fee_payer.key();
    event.mint_authority = ctx.accounts.mint_authority.key();

    Ok(())
}

pub fn rsvp(ctx: Context<RSVP>, response: RsvpResponse) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let attendee = &mut ctx.accounts.attendee;
    let prev_response = &attendee.response;

    if response == *prev_response {
        return Ok(());
    }

    if *prev_response == RsvpResponse::Accepted {
        event.num_attendees -= 1;
    } else if response == RsvpResponse::Accepted {
        require!(event.max_attendees >= event.num_attendees, ErrorCode::MaxAttendeesReached);

        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info().clone(),
            to: ctx.accounts.attendee_token_account.to_account_info().clone(),
            authority: ctx.accounts.mint_authority.to_account_info().clone(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_context, 1)?;
        event.num_attendees += 1;
    }

    // Transfer lamports to cover the transaction cost
    // **ctx.accounts.fee_payer.lamports.borrow_mut() -= ctx.accounts.rent.minimum_balance(0);
    // **ctx.accounts.attendee_token_account.to_account_info().lamports.borrow_mut() +=
    //     ctx.accounts.rent.minimum_balance(0);

    attendee.response = response;
    Ok(())
}
