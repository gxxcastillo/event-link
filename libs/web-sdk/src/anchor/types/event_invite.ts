/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/event_invite.json`.
 */
export type EventInvite = {
  address: 'HvdMiRfuZs9M5KC5LcWpAQnetxHqKdyjqGVFvGvRm3WY';
  metadata: {
    name: 'eventInvite';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'createEvent';
      discriminator: [49, 219, 29, 203, 22, 98, 100, 87];
      accounts: [
        {
          name: 'event';
          writable: true;
          signer: true;
        },
        {
          name: 'creator';
          writable: true;
          signer: true;
        },
        {
          name: 'authority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121];
              },
              {
                kind: 'account';
                path: 'event';
              }
            ];
          };
        },
        {
          name: 'mint';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 105, 110, 116];
              },
              {
                kind: 'account';
                path: 'event';
              }
            ];
          };
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'eventDate';
          type: 'i64';
        },
        {
          name: 'maxAttendees';
          type: 'u32';
        },
        {
          name: 'metadataUri';
          type: 'string';
        },
        {
          name: 'isInviteOnly';
          type: 'bool';
        },
        {
          name: 'initialFunds';
          type: 'u64';
        }
      ];
    },
    {
      name: 'createInvites';
      discriminator: [229, 62, 131, 131, 163, 149, 41, 183];
      accounts: [
        {
          name: 'event';
          writable: true;
        },
        {
          name: 'creator';
          writable: true;
          signer: true;
          relations: ['event'];
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'keys';
          type: {
            vec: {
              defined: {
                name: 'inviteKeys';
              };
            };
          };
        }
      ];
    },
    {
      name: 'rsvp';
      discriminator: [134, 164, 221, 33, 183, 12, 73, 32];
      accounts: [
        {
          name: 'event';
          writable: true;
        },
        {
          name: 'rsvp';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [114, 115, 118, 112];
              },
              {
                kind: 'account';
                path: 'event';
              },
              {
                kind: 'account';
                path: 'attendee';
              }
            ];
          };
        },
        {
          name: 'invite';
          writable: true;
          optional: true;
        },
        {
          name: 'attendee';
          writable: true;
          signer: true;
        },
        {
          name: 'authority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121];
              },
              {
                kind: 'account';
                path: 'event';
              }
            ];
          };
        },
        {
          name: 'mint';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 105, 110, 116];
              },
              {
                kind: 'account';
                path: 'event';
              }
            ];
          };
        },
        {
          name: 'attendeeTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'attendee';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              }
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'status';
          type: {
            defined: {
              name: 'rsvpStatus';
            };
          };
        },
        {
          name: 'inviteId';
          type: {
            option: 'u32';
          };
        },
        {
          name: 'inviteBump';
          type: {
            option: 'u8';
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'event';
      discriminator: [125, 192, 125, 158, 9, 115, 152, 233];
    },
    {
      name: 'invite';
      discriminator: [230, 17, 253, 74, 50, 78, 85, 101];
    },
    {
      name: 'rsvp';
      discriminator: [255, 91, 20, 106, 97, 136, 70, 46];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'inviteRequired';
      msg: 'An invite is required for this event.';
    },
    {
      code: 6001;
      name: 'noInviteFound';
      msg: 'Invite not found.';
    },
    {
      code: 6002;
      name: 'inviteAlreadyExists';
      msg: 'Invite account already exists.';
    },
    {
      code: 6003;
      name: 'conversionError';
      msg: 'Unable to convert data type.';
    },
    {
      code: 6004;
      name: 'mismatchedInviteData';
      msg: 'Mismatched invite IDs and PDA public keys.';
    },
    {
      code: 6005;
      name: 'pdaMismatch';
      msg: 'PDA mismatch.';
    },
    {
      code: 6006;
      name: 'maxRsvpsReached';
      msg: 'The maximum number of attendees have accepted.';
    }
  ];
  types: [
    {
      name: 'event';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'dateCreated';
            type: 'i64';
          },
          {
            name: 'dateUpdated';
            type: 'i64';
          },
          {
            name: 'eventDate';
            type: 'i64';
          },
          {
            name: 'creator';
            type: 'pubkey';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'authorityBump';
            type: 'u8';
          },
          {
            name: 'mintBump';
            type: 'u8';
          },
          {
            name: 'metadataUri';
            type: 'string';
          },
          {
            name: 'isInviteOnly';
            type: 'bool';
          },
          {
            name: 'maxAttendees';
            type: 'u32';
          },
          {
            name: 'numInvites';
            type: 'u32';
          },
          {
            name: 'numRsvps';
            type: 'u32';
          }
        ];
      };
    },
    {
      name: 'invite';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'event';
            type: 'pubkey';
          },
          {
            name: 'rsvp';
            type: {
              option: 'pubkey';
            };
          }
        ];
      };
    },
    {
      name: 'inviteKeys';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'u32';
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'rsvp';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'event';
            type: 'pubkey';
          },
          {
            name: 'attendee';
            type: 'pubkey';
          },
          {
            name: 'status';
            type: {
              defined: {
                name: 'rsvpStatus';
              };
            };
          }
        ];
      };
    },
    {
      name: 'rsvpStatus';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'none';
          },
          {
            name: 'accepted';
          },
          {
            name: 'rejected';
          },
          {
            name: 'tentative';
          }
        ];
      };
    }
  ];
};
