use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount, Token };
use anchor_spl::associated_token::AssociatedToken;

use crate::state::{ Event, RSVP };

#[derive(Accounts)]
pub struct CreateEventAccounts<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 256 + 256 + 32 + 256 + 4 + 4 + 32)]
    pub event: Account<'info, Event>,
    #[account(mut, signer)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        mint::decimals = 1,
        mint::authority = creator,
        mint::freeze_authority = creator
    )]
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RsvpAccounts<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(
        init_if_needed,
        payer = fee_payer,
        space = 8 + 32 + 32 + 1 + 1,
        seeds = [b"rsvp", event.key().as_ref(), attendee.key().as_ref()],
        bump
    )]
    pub rsvp: Account<'info, RSVP>,
    #[account(mut, signer)]
    pub attendee: Signer<'info>,
    #[account(
        init_if_needed,
        payer = fee_payer,
        associated_token::mint = token_mint,
        associated_token::authority = attendee,
        constraint = attendee_token_account.mint == token_mint.key()
    )]
    pub attendee_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut, signer)]
    pub mint_authority: Signer<'info>,
    #[account(mut, signer)]
    pub fee_payer: Signer<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
