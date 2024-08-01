use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount, Token };
use anchor_spl::associated_token::AssociatedToken;

use crate::state::{ Event, RSVP, Invite };

#[derive(Accounts)]
pub struct CreateEventAccounts<'info> {
    #[account(init, payer = creator, space = 8 + 8 + 8 + 32 + 32 + 1 + 1 + 256 + 1 + 4 + 4 + 4)]
    pub event: Account<'info, Event>,
    #[account(mut, signer)]
    pub creator: Signer<'info>,
    /// CHECK: TODO
    #[account(
        init,
        owner = system_program.key(),
        payer = creator,
        space = 8,
        seeds = [b"authority", event.key().as_ref()],
        bump
    )]
    pub authority: UncheckedAccount<'info>,
    #[account(
        init,
        payer = creator,
        mint::decimals = 1,
        mint::authority = authority.key(),
        mint::freeze_authority = authority.key(),
        seeds = [b"mint", event.key().as_ref()],
        bump
    )]
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateInvitesAccounts<'info> {
    #[account(
        mut,
        has_one = creator
    )]
    pub event: Account<'info, Event>,
    #[account(mut, signer)]
    pub creator: Signer<'info>,
    #[account()]
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RsvpAccounts<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(
        init_if_needed,
        payer = attendee,
        space = 8 + 32 + 32 + 1 + 1,
        seeds = [b"rsvp", event.key().as_ref(), attendee.key().as_ref()],
        bump
    )]
    pub rsvp: Account<'info, RSVP>,
    #[account(mut)]
    pub invite: Option<Account<'info, Invite>>,
    #[account(mut, signer)]
    pub attendee: Signer<'info>,
    /// CHECK: TODO
    #[account(
        mut,
        seeds = [b"authority", event.key().as_ref()],
        bump = event.authority_bump
    )]
    pub authority: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"mint", event.key().as_ref()],
        bump = event.token_mint_bump
    )]
    pub token_mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = attendee,
        associated_token::mint = token_mint,
        associated_token::authority = attendee,
        constraint = attendee_token_account.mint == token_mint.key()
    )]
    pub attendee_token_account: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
