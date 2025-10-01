import { createMemo, Show } from 'solid-js';
import { useWalletService } from '@eventlink/solid-sol';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function LocalhostWalletHeader() {
  const wallet = useWalletService();

  const solBalance = createMemo(() => {
    const balanceValue = wallet.balance;
    return balanceValue == null ? null : balanceValue / LAMPORTS_PER_SOL;
  });

  return (
    <div class="LocalhostWalletHeader">
      <h1 class="text-xl font-bold mb-2">Localhost Wallet</h1>
      <p>Status: {wallet.status}</p>

      <Show when={wallet.status === 'connected'}>
        <div>
          <p class="text-sm break-all">🔑 {wallet.address}</p>
          <p>💰 Balance: {solBalance()} SOL</p>
        </div>
      </Show>
    </div>
  );
}
