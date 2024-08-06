import { ActionPostResponse, createPostResponse } from '@solana/actions';
import { ComputeBudgetProgram, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';

export async function postHandler(eventID: string, inviteID: string, response: string) {
  console.log({ eventID, inviteID, response });

  const transaction = new Transaction().add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1000,
    }),
    new TransactionInstruction({
      programId: Keypair.generate().publicKey,
      data: Buffer.from('this is a placeholder event invite', 'utf8'),
      keys: [],
    })
  );

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction,
      message: '@TODO MESSAGE',
    },
  });

  return payload;
}
