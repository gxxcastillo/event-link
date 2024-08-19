/// <reference types="vite/client" />
import { type WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface ImportMetaEnv {
  readonly VITE_PROGRAM_ID: string;
  readonly VITE_AUTHORITY_PK: string;
  readonly VITE_NETWORK: WalletAdapterNetwork | `127.${number}.${number}.${number}:${number}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
