use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub date_created: i64,
    pub date_updated: i64,
    pub event_date: i64,
    pub creator: Pubkey,
    pub authority: Pubkey,
    pub authority_bump: u8,
    pub token_mint_bump: u8,
    pub metadata_uri: String,
    pub is_invite_only: bool,
    pub max_attendees: u32,
    pub num_invites: u32,
    pub num_rsvps: u32,
}

#[account]
pub struct Invite {
    pub event: Pubkey,
    pub rsvp: Option<Pubkey>,
}

#[account]
pub struct RSVP {
    pub event: Pubkey,
    pub attendee: Pubkey,
    pub status: RsvpStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RsvpStatus {
    None,
    Accepted,
    Rejected,
    Tentative,
}
