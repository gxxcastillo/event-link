import { describe, it, expect } from 'vitest';

import { web3, workspace } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { type EventInvite } from "../target/types/event_invite.js";

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

    const latestBlockHash = await program.provider.connection.getLatestBlockhash();
    const signature = await program.provider.connection.requestAirdrop(creatorKP.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction({
      signature,
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
    })

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
  });

  it.todo("Can RSVP to an event", async () => {
    const program = workspace.EventInvite as Program<EventInvite>;
  });  
});
