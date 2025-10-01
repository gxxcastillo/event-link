import { workspace, setProvider, AnchorProvider } from '@coral-xyz/anchor';

setProvider(AnchorProvider.env());
export const eventProgram = workspace.EventInvites;

console.log('RPC URL: ', eventProgram.provider.connection.rpcEndpoint);
