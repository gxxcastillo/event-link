import { Form, InputField, SubmitButton, TextAreaField } from '@gxxc/solid-forms';
import { useEventLink } from '@eventlink/web-sdk/solid';
import { type CreateEventMetadata, type EventSettings } from '@eventlink/web-sdk';

type FormValues = {
  title: string;
  date: string;
  message: string;
};

export function CreateEventForm() {
  async function onSubmit(data: FormValues) {
    if (!eventLink) {
      console.error('!!! EVENT LINK SERVICE NOT READY');
      return;
    }

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

    await eventLink.createEvent(metadata, settings);
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
