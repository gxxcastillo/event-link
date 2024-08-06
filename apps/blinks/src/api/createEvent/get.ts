export async function getHandler() {
  return {
    title: 'Create Event',
    icon: 'https://zycrypto.com/wp-content/uploads/2022/04/OpenSea-Listing-Solana-NFTs-Confirms-The-Networks-Potential-Across-Key-Industry-Verticals.jpg',
    description: 'Create a unique, secure event invites.',
    label: 'Send Invite',
    links: {
      actions: [
        {
          label: 'Yes',
          href: '/api/event/create',
        },
      ],
    },
  };
}
