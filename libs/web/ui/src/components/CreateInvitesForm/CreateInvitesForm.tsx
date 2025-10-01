import { Form, InputField, SubmitButton } from '@gxxc/solid-forms';
import { useEventLink } from '@eventlink/web-sdk/solid';
import { PublicKey } from '@solana/web3.js';

type FormValues = {
  event: string;
  numInvites: number;
};

export function CreateInvitesForm() {
  async function onSubmit(data: FormValues) {
    if (!eventLink) {
      console.error('!!! EVENT LINK SERVICE NOT READY');
      return;
    }

    const numInvites = data.numInvites;
    if (!numInvites) {
      throw new Error('numInvites is missing');
    }

    await eventLink.createInvites(new PublicKey(data.event), { numInvites });
  }

  const eventLink = useEventLink();

  return (
    <Form onSubmit={onSubmit}>
      <h1>Create Invites</h1>
      <InputField type="string" name="event" label="Event Public Key" />
      <InputField type="number" name="numInvites" label="Number of Invites" required />
      <SubmitButton />
    </Form>
  );
}
