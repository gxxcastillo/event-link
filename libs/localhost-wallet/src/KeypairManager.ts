import { type Keypair } from '@solana/web3.js';
import { type WebStorage, type OpenFilePickerOptions, type SaveFilePickerOptions } from './types';

declare global {
  interface Window {
    showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}

export type PersistedData = { 'active-address': string };

export class KeyPairManager {
  private storage: WebStorage<PersistedData>;
  private keypairs = new Map<string, Keypair>();
  private activeKeypairPath?: string;

  constructor({ storage }: { storage: WebStorage }) {
    this.storage = storage as WebStorage<PersistedData>;

    const persistedKeypair = storage.get('active-address');
    if (persistedKeypair) {
      this.activeKeypairPath = persistedKeypair;
    }
  }

  public get activeKeypair() {
    if (!this.keypairs.size) {
      return;
    }

    const activePath = this.activeKeypairPath;
    if (activePath) {
      return this.keypairs.get(activePath);
    }

    return;
  }

  public get size() {
    return this.keypairs.size;
  }

  setActive(path: string) {
    if (this.keypairs.has(path)) {
      this.activeKeypairPath = path;
      this.storage.set('active-address', path);
    }
  }

  setActiveDefault() {
    if (!this.keypairs.size || this.activeKeypairPath) {
      return this.activeKeypairPath;
    }

    const [[activePath]] = Array.from(this.keypairs.entries());
    this.setActive(activePath);
  }

  add(path: string, kp: Keypair) {
    this.keypairs.set(path, kp);
  }

  remove(path: string) {
    this.keypairs.delete(path);
    if (this.activeKeypairPath === path && this.keypairs.size) {
      this.setActiveDefault();
    } else {
      this.activeKeypairPath = undefined;
    }
  }

  clear() {
    this.activeKeypairPath = undefined;
    this.keypairs.clear();
  }
}
