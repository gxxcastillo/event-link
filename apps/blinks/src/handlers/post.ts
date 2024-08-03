import { ActionPostResponse, createPostResponse, MEMO_PROGRAM_ID } from '@solana/actions';
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export async function postHandler() {
  const account = Keypair.generate().publicKey;
  const connection = new Connection(process.env.SOLANA_RPC || clusterApiUrl('devnet'));

  const transaction = new Transaction().add(
    // note: `createPostResponse` requires at least 1 non-memo instruction
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1000,
    }),
    new TransactionInstruction({
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from('this is a placeholder event invite', 'utf8'),
      keys: [],
    })
  );

  transaction.feePayer = account;

  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction,
      message: 'Post this event invite on-chain',
    },
    // no additional signers are required for this transaction
    // signers: [],
  });

  return payload;
}
