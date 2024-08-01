use anchor_lang::{ prelude::*, Discriminator };
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_instruction::create_account;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{ self, MintTo };

use crate::context::{ CreateEventAccounts, CreateInvitesAccounts, RsvpAccounts };
use crate::state::{ RsvpStatus, Invite };
use crate::error::ErrorCode;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InviteKeys {
    id: u32,
    bump: u8,
}

pub fn create_event(
    ctx: Context<CreateEventAccounts>,
    event_date: i64,
    max_attendees: u32,
    metadata_uri: String,
    is_invite_only: bool,
    initial_funds: u64
) -> ProgramResult {
    let event = &mut ctx.accounts.event;
    event.date_created = Clock::get()?.unix_timestamp;
    event.date_updated = event.date_created;
    event.event_date = event_date;
    event.creator = ctx.accounts.creator.key();
    event.authority = event.creator;
    event.authority_bump = ctx.bumps.authority;
    event.token_mint_bump = ctx.bumps.token_mint;
    event.metadata_uri = metadata_uri;
    event.max_attendees = max_attendees;
    // event.foof = false;
    event.num_invites = 0;
    event.num_rsvps = 0;
    event.is_invite_only = is_invite_only;

    invoke(
        &transfer(&ctx.accounts.creator.key(), &ctx.accounts.authority.key(), initial_funds),
        &[
            ctx.accounts.creator.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ]
    )?;

    Ok(())
}

pub fn create_invites<'a, 'b, 'c, 'd>(
    ctx: Context<'a, 'b, 'c, 'd, CreateInvitesAccounts<'d>>,
    keys: Vec<InviteKeys>
) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let creator = &ctx.accounts.creator;
    let system_program = &ctx.accounts.system_program;

    let space = 32 + 32 + 8 + 1;
    let lamports = Rent::get()?.minimum_balance(space);
    let discriminator = Invite::discriminator();

    let invite_accounts = &ctx.remaining_accounts;
    let num_invites = invite_accounts.len();
    require!(keys.len() == num_invites, ErrorCode::MismatchedInviteData);

    for (index, invite_keys) in keys.iter().enumerate() {
        let id = invite_keys.id.to_le_bytes();
        let bump = [invite_keys.bump];
        let event_pk = event.key();
        let seeds: &[&[u8]] = &[b"invite", event_pk.as_ref(), &id, &bump];

        let invite_info = &invite_accounts[index];
        let pda = Pubkey::create_program_address(seeds, ctx.program_id).map_err(|_| ErrorCode::PdaMismatch)?;
        require!(invite_info.key() == pda, ErrorCode::PdaMismatch);
        require!(invite_info.lamports() == 0, ErrorCode::InviteAlreadyExists);

        let create_account_ix = create_account(
            &creator.key(),
            &invite_info.key(),
            lamports,
            space as u64,
            &ctx.program_id
        );

        invoke_signed(
            &create_account_ix,
            &[creator.to_account_info(), invite_info.to_account_info(), system_program.to_account_info()],
            &[seeds]
        )?;

        let mut info = invite_info.try_borrow_mut_data()?;
        info[..8].copy_from_slice(&discriminator);

        let invite = Invite {
            event: event_pk,
            rsvp: None,
        };

        invite.serialize(&mut &mut info[8..])?;
    }

    event.date_updated = Clock::get()?.unix_timestamp;
    event.num_invites = num_invites.try_into().map_err(|_| ErrorCode::ConversionError)?;
    Ok(())
}

pub fn rsvp(
    ctx: Context<RsvpAccounts>,
    status: RsvpStatus,
    invite_id: Option<u32>,
    invite_bump: Option<u8>
) -> Result<()> {
    let event: &mut Account<crate::Event> = &mut ctx.accounts.event;
    let rsvp: &mut Account<crate::RSVP> = &mut ctx.accounts.rsvp;
    let prev_status: RsvpStatus = rsvp.status.clone();

    if status == prev_status {
        return Ok(());
    }

    if event.is_invite_only {
        require!(invite_id != None && invite_bump != None, ErrorCode::InviteRequired);

        let invite_pk = Pubkey::create_program_address(
            &[
                b"invite",
                event.key().as_ref(),
                &invite_id.unwrap().to_le_bytes(),
                &invite_bump.unwrap().to_le_bytes(),
            ],
            ctx.program_id
        ).map_err(|_| ProgramError::InvalidAccountData)?;

        if let Some(invite) = &mut ctx.accounts.invite {
            require!(invite.key() == invite_pk, ErrorCode::NoInviteFound);
            invite.rsvp = Some(rsvp.key());
        } else {
            return Err(ErrorCode::NoInviteFound.into());
        }
    }

    // if prev_response == accepted, we can assume that current_response != accepted
    if prev_status == RsvpStatus::Accepted && event.num_rsvps > 0 {
        event.num_rsvps -= 1;
    } else if status == RsvpStatus::Accepted {
        if event.max_attendees > 0 {
            require!(event.max_attendees > event.num_rsvps, ErrorCode::MaxRsvpsReached);
        }

        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.attendee_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let authority_bump = event.authority_bump;
        let event_key = event.key();
        let seeds = &[b"authority", event_key.as_ref(), &[authority_bump]];
        let signer_seeds = &[&seeds[..]];
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::mint_to(cpi_context, 1)?;

        event.num_rsvps += 1;
    }

    if rsvp.event == Pubkey::default() {
        rsvp.event = ctx.accounts.event.key();
        rsvp.attendee = ctx.accounts.attendee.key();
    }

    rsvp.status = status;
    Ok(())
}
