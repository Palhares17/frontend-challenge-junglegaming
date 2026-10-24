export interface SavedWalletPresentation {
  id: string;
  label: string;
  address: string;
  network: string;
}
export type WalletProvider = 'walletconnect' | 'metamask' | 'coinbase';
