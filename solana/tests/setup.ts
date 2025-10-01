import { workspace, setProvider, AnchorProvider } from '@coral-xyz/anchor';

setProvider(AnchorProvider.env());
export const eventProgram = workspace.EventLink;

console.log('RPC URL: ', eventProgram.provider.connection.rpcEndpoint);
