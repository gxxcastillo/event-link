use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Event {
    pub date_created: i64,
    pub date_updated: i64,
    pub creator: Pubkey,
    pub authority: Pubkey,    
    pub info_bump: u8,
    pub mint_authority_bump: u8,
    pub mint_bump: u8,
    pub id: [u8; 9],
    pub num_invites: u32,
    pub num_rsvps: u32,
    // @TODO Implement attendance verification
    // pub num_attendees: u32
}

#[account]
#[derive(InitSpace)]
pub struct EventInfo {
    pub date_updated: i64,
    pub authority: Pubkey,
    pub metadata: EventMetadata,
    pub settings: EventSettings
}

#[account]
#[derive(InitSpace)]
pub struct EventMetadata {
    #[max_len(64)]
    pub title: String,
    pub date: i64,
    #[max_len(120)]
    pub metadata_uri: String,
    pub status: EventStatus
}

#[account]
#[derive(InitSpace)]
pub struct EventSettings {
    pub max_attendees: u32,
    pub is_invite_only: bool,
    pub show_guest_list: bool
}

#[account]
#[derive(InitSpace)]
pub struct Invite {
    pub id: [u8; 6],
    pub event: Pubkey,
    pub rsvp: Option<Pubkey>,
}

#[account]
#[derive(InitSpace)]
pub struct RSVP {
    pub event: Pubkey,
    pub attendee: Pubkey,
    pub status: RsvpStatus,
    // @TODO Implement attendance verification
    // pub attended: bool,
    #[max_len(120)]
    pub metadata_uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
#[derive(InitSpace)]
pub enum RsvpStatus {
    None,
    Accepted,
    Rejected,
    Tentative,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
#[derive(InitSpace)]
pub enum EventStatus {
    Draft,
    Published,
}

