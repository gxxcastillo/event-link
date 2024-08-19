import { useContext } from 'solid-js';

import { WalletContext } from '../wallet/WalletProvider';

export const useWalletProviderState = () => useContext(WalletContext)[0];
export const useWalletProviderMutations = () => useContext(WalletContext)[1];
