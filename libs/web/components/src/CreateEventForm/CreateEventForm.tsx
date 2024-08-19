import { Form, InputField, SubmitButton, TextAreaField } from '@gxxc/solid-forms';
import { useEventLink } from '@eventlink/web-sdk/solid';
import { CreateEventMetadata, EventSettings } from 'libs/web-sdk/src';

// pub date_created: i64,
// pub date_updated: i64,
// pub creator: Pubkey,
// pub authority: Pubkey,
// pub info_bump: u8,
// pub mint_authority_bump: u8,
// pub mint_bump: u8,
// pub id: [u8; 9],
// pub num_invites: u32,
// pub num_rsvps: u32,

// pub title: String,
// pub date: i64,
// pub metadata_uri: String,
// pub status: EventStatus

// pub max_attendees: u32,
// pub is_invite_only: bool,
// pub show_guest_list: bool

type FormValues = {
  title: string;
  date: string;
  message: string;
};

export function CreateEventForm() {
  function onSubmit(data: FormValues) {
    const metadata: CreateEventMetadata = {
      title: data.title,
      date: data.date,
      metadataUri: 'https://localhost.test',
      status: 'published',
    };

    const settings: EventSettings = {
      maxAttendees: 5,
      isInviteOnly: false,
      showGuestList: true,
    };

    const api = eventLink?.();
    if (!api) {
      console.error('event link not initialized');
      return;
    }

    const txResult = api.createEvent(metadata, settings);
    console.log('!!!!!', txResult);
  }

  const eventLink = useEventLink();

  return (
    <Form onSubmit={onSubmit}>
      <h1>Create Event</h1>
      <InputField name="title" label="Title" />
      <InputField name="date" label="Date" />
      <TextAreaField name="message" />
      <SubmitButton />
    </Form>
  );
}
