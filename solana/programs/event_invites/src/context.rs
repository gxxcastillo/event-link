use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount, Token };

use crate::state::{ Event, Attendee };

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 256 + 256 + 32 + 256 + 4 + 4 + 32)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        mint::decimals = 1,
        mint::authority = creator,
        mint::freeze_authority = creator
    )]
    pub token_mint: Account<'info, Mint>,
    #[account(signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub fee_payer: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RSVP<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(init, payer = fee_payer, space = 8 + 32 + 1)]
    pub attendee: Account<'info, Attendee>,
    #[account(mut)]
    pub attendee_token_account: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,
    #[account(signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
