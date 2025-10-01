import { Transaction, VersionedTransaction, Keypair } from '@solana/web3.js';
import { sign } from 'tweetnacl';

import { KeyPairManager } from './KeypairManager';
import { type WebStorage, type ESModule } from './types';

export type LocalhostWalletOptions = {
  storage: WebStorage;
};

/**
 * A wallet meant only for localhost development. Responsible for managing keypairs & signatures.
 */
export class LocalhostWallet {
  public keypairs: KeyPairManager;
  public status = '';

  constructor(options: LocalhostWalletOptions) {
    this.keypairs = new KeyPairManager({ storage: options.storage });
  }

  get keypair(): Keypair | undefined {
    return this.keypairs.activeKeypair;
  }

  async load() {
    const entries = await loadAllKeypairs();
    entries.forEach(([path, keypair]) => {
      this.keypairs.add(path, keypair);
    });
    return this.keypairs;
  }

  saveActiveKeypair() {
    const keypair = this.keypairs.activeKeypair;
    if (!keypair) {
      return;
    }

    this.saveKeypair(keypair);
  }

  signTransaction(tx: Transaction | VersionedTransaction) {
    if (!this.keypair) {
      throw new Error('signTransaction failed.  A keypair is required');
    }

    if (tx instanceof Transaction) {
      tx.partialSign(this.keypair);
      return tx;
    } else if (tx instanceof VersionedTransaction) {
      tx.sign([this.keypair]);
      return tx;
    }

    throw new Error('Unsupported transaction type');
  }

  signAllTransactions(txs: (Transaction | VersionedTransaction)[]) {
    return txs.map((tx) => this.signTransaction(tx));
  }

  signMessage(message: Uint8Array): Uint8Array {
    if (!this.keypair) {
      throw new Error('signMessage failed.  A keypair is required');
    }

    return sign.detached(message, this.keypair.secretKey);
  }

  async createKeypair(setActive: boolean = false) {
    const keypair = Keypair.generate();
    const key = keypair.publicKey.toString();
    this.keypairs.add(key, keypair);
    if (setActive) {
      this.keypairs.setActive(key);
    }

    return keypair;
  }

  async saveKeypair(keypair: Keypair, defaultFilename = 'dev-keypair.json') {
    const result = await saveKeypairToFile(keypair, defaultFilename);
    if (result) {
      const { keypair, fileHandle } = result;
      const file = await fileHandle.getFile();
      const path = file.name;
      this.keypairs.add(path, keypair);
    }
  }

  async loadKeypair() {
    const result = await loadKeypairFromFile();
    if (result) {
      const { keypair, fileHandle } = result;
      const file = await fileHandle.getFile();
      const path = file.name;
      this.keypairs.add(path, keypair);
      this.keypairs.setActive(path);
      return keypair;
    }
  }
}

export async function saveKeypairToFile(
  keypair: Keypair,
  defaultFilename: string
): Promise<{ keypair: Keypair; fileHandle: FileSystemFileHandle } | undefined> {
  const secretKey = JSON.stringify(Array.from(keypair.secretKey), null, 2);

  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: defaultFilename,
        types: [
          {
            description: 'Solana Keypair',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(secretKey);
      await writable.close();

      return {
        keypair,
        fileHandle,
      };
    } catch (error) {
      console.error('User cancelled file save:', error);
    }
  } else {
    throw new Error('File System Access API is not supported in this environment.');
  }
}

export async function loadKeypairFromFile(): Promise<
  { keypair: Keypair; fileHandle: FileSystemFileHandle } | undefined
> {
  if (typeof window.showOpenFilePicker === 'function') {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Solana Keypair',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const file = await fileHandle.getFile();
      const text = await file.text();
      const secret = Uint8Array.from(JSON.parse(text));

      return {
        keypair: Keypair.fromSecretKey(secret),
        fileHandle,
      };
    } catch (error) {
      console.error('User cancelled file load:', error);
    }
  } else {
    throw new Error('File System Access API is not supported in this environment.');
  }
}

/**
 * Uses Vite's `import.meta.glob` to dynamically import every Solana `Keypair` in
 * the local `./keypairs` directory.
 */
export async function loadAllKeypairs(): Promise<[string, Keypair][]> {
  const imports = import.meta.glob<ESModule<string>>('./keypairs/*.json');

  const promises = Object.entries(imports).map(async ([path, loadModule]) => {
    const json = await loadModule().then((m) => m.default);
    const secret = Uint8Array.from(json);
    const keypair = Keypair.fromSecretKey(secret);
    return [path.split('/').pop() as string, keypair] as const;
  });

  const results = await Promise.allSettled(promises);
  return results.flatMap<[string, Keypair]>((result) => {
    if (result.status === 'fulfilled') {
      return [[...result.value]];
    } else {
      return [];
    }
  });
}
