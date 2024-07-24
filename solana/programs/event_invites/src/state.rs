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
    pub fee_payer: Pubkey,
}

#[account]
pub struct Attendee {
    pub response: RsvpResponse,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum RsvpResponse {
    Accepted,
    Rejected,
    Tentative,
}
