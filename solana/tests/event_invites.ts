import { describe, it, expect } from 'vitest';

import { web3, workspace } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EventInvite } from "../target/types/event_invite.js";

async function fundAccount(connection: web3.Connection, publicKey: web3.PublicKey, amount: number ) {
  const latestBlockHash = await connection.getLatestBlockhash();
  const signature = await connection.requestAirdrop(publicKey, amount);
  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
  })
}

describe("event_invites", () => {
  it("Can create an event", async () => {
    const program = workspace.EventInvite as Program<EventInvite>;

    const eventKP = web3.Keypair.generate();
    const creatorKP = web3.Keypair.generate();
    const tokenMintKP = web3.Keypair.generate();
    const mintAuthorityKP = web3.Keypair.generate();
    const payerKP = web3.Keypair.generate();
    const feePayerKP = web3.Keypair.generate();
    const accounts = {
      event: eventKP.publicKey,
      creator: creatorKP.publicKey,
      tokenMint: tokenMintKP.publicKey,
      mintAuthority: mintAuthorityKP.publicKey,
      payer: payerKP.publicKey,
      feePayer: feePayerKP.publicKey,
    }
    
    await fundAccount(program.provider.connection, creatorKP.publicKey, 1000000000);
    await program.methods
      .createEvent('Phantasmic Event', 'An event like no other', '2024-07-23T05:55:40.892Z', 12, 'https://????.??' )
      .accounts(accounts)
      .signers([eventKP, creatorKP, tokenMintKP, mintAuthorityKP, payerKP])
      .rpc();

    const eventState = await program.account.event.fetch(eventKP.publicKey)
    
    expect(eventState).toMatchObject({
      title: 'Phantasmic Event',
      description: 'An event like no other',
      date: '2024-07-23T05:55:40.892Z'
    });
    
    const attendeeKP = web3.Keypair.generate();
    const rsvpAccounts = {
      event: eventKP.publicKey,
      attendee: attendeeKP.publicKey,
      tokenMint: tokenMintKP.publicKey,
      mintAuthority: mintAuthorityKP.publicKey,
      feePayer: feePayerKP.publicKey
    }

    await fundAccount(program.provider.connection, feePayerKP.publicKey, 1000000000);
    await program.methods
      .rsvp({ accepted: {} })
      .accounts(rsvpAccounts)
      .signers([feePayerKP, attendeeKP, mintAuthorityKP])
      .rpc();  
      
    const attendeeState = await program.account.attendee.fetch(attendeeKP.publicKey)      

    expect(attendeeState).toMatchObject({ response: { accepted: {} } });    
  });

  // it.todo("Can RSVP to an event", async () => {
  //   const program = workspace.EventInvite as Program<EventInvite>;
  //   const accounts = {};

  //   await program.methods
  //     .createEvent('Phantasmic Event', 'An event like no other', '2024-07-23T05:55:40.892Z', 12, 'https://????.??' )
  //     .accounts(accounts)
  //     .signers([])
  //     .rpc();    
  // });  
});
