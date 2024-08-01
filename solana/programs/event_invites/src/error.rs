use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("An invite is required for this event.")]
    InviteRequired,
    #[msg("Invite not found.")]
    NoInviteFound,
    #[msg("Invite account already exists.")]
    InviteAlreadyExists,
    #[msg("Unable to convert data type.")]
    ConversionError,
    #[msg("Mismatched invite IDs and PDA public keys.")]
    MismatchedInviteData,
    #[msg("PDA mismatch.")]
    PdaMismatch,
    #[msg("The maximum number of attendees have accepted.")]
    MaxRsvpsReached,
}
