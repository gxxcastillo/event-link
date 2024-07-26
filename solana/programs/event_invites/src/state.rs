use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub title: String,
    pub description: String,
    pub date: String,
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub mint_authority: Pubkey,
    pub metadata_uri: String,
    pub max_attendees: u32,
    pub num_attendees: u32,
}

#[account]
pub struct RSVP {
    pub event: Pubkey,
    pub attendee: Pubkey,
    pub status: Option<RsvpStatus>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum RsvpStatus {
    Accepted,
    Rejected,
    Tentative,
}
