export async function getHandler(eventID: string, inviteID: string, response: string) {
  console.log({ eventID, inviteID, response });
  return {
    title: 'EventLink RSVP',
    icon: 'https://zycrypto.com/wp-content/uploads/2022/04/OpenSea-Listing-Solana-NFTs-Confirms-The-Networks-Potential-Across-Key-Industry-Verticals.jpg',
    description: 'Will you attend?',
    label: 'RSVP',
    links: {
      actions: [
        {
          label: 'Yes',
          href: '/api/event/{eventId}/invite/{inviteId}/rsvp?response=accept',
        },
        {
          label: 'No',
          href: '/api/event/{eventId}/invite/{inviteId}/rsvp?response=reject',
        },
        {
          label: 'Maybe',
          href: '/api/event/{eventId}/invite/{inviteId}/rsvp?response=tentative',
        },
      ],
    },
  };
}
