use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The maximum number of attendees have accepted.")]
    MaxAttendeesReached,
}
