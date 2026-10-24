import { createMemoryHistory } from '@tanstack/react-router';
import { createAppRouter } from '@/core/router/router';
import { useState, type FormEventHandler } from 'react';
import { useMediaQuery } from '@/core/hooks/use-media-query';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { App } from '@/core/app';
import { NftDetailsPage } from '@/feature/nft/views/nft-details.page';
import { CartPage } from '@/feature/cart/views/cart.page';
import { CheckoutPage } from '@/feature/checkout/views/checkout.page';
import { OrderConfirmationPage } from '@/feature/orders/views/order-confirmation.page';
import { ProfilePage } from '@/feature/profile/views/profile.page';
import { WalletsPage } from '@/feature/wallets/views/wallets.page';
import { LoginPage } from '@/feature/auth/views/login.page';
import { RegisterPage } from '@/feature/auth/views/register.page';
import type { WalletProvider } from '@/feature/checkout/entities/wallet-presentation.entity';
import {
  authFacets,
  authItems,
  checkoutItems,
  desktopCartItems,
  desktopTotals,
  mobileCartItems,
  mobileTotals,
  nftSpecimen,
  receiptSpecimen,
  relatedNfts,
  walletSpecimens,
} from './mocks/design.fixtures';
import './design-preview.css';

const previewRouter = createAppRouter(
  createMemoryHistory({ initialEntries: ['/'] }),
);

const screens = [
  { value: 'home', label: 'Início' },
  { value: 'nft', label: 'Detalhes do NFT' },
  { value: 'cart', label: 'Carrinho' },
  { value: 'checkout', label: 'Pagamento' },
  { value: 'confirmation', label: 'Confirmação' },
  { value: 'login', label: 'Login' },
  { value: 'register', label: 'Cadastro' },
  { value: 'profile', label: 'Perfil' },
  { value: 'wallets', label: 'Carteiras' },
] as const;
type Screen = (typeof screens)[number]['value'];

export function DesignPreview() {
  const params = new URLSearchParams(location.search);
  const initial =
    screens.find((screen) => screen.value === params.get('screen'))?.value ??
    'nft';
  const [screen, setScreen] = useState<Screen>(initial);
  const [quantity, setQuantity] = useState(1);
  const [edition, setEdition] = useState('fifty');
  const [wallet, setWallet] = useState('reserve');
  const [provider, setProvider] = useState<WalletProvider>('coinbase');
  const desktop = useMediaQuery('(min-width:1024px)');
  const notify = useUnavailable();
  const submit =
    (label: string): FormEventHandler<HTMLFormElement> =>
    (event) => {
      event.preventDefault();
      notify(label);
    };
  const common = { onAction: notify };
  const auth = {
    items: authItems,
    facets: authFacets,
    onAction: notify,
    onClose: () => setScreen('nft'),
  };
  return (
    <>
      <aside
        className={`design-preview-toolbar ${params.has('capture') ? 'design-preview-capture' : ''}`}
        aria-label="Ferramentas de revisão visual"
      >
        <label htmlFor="design-screen">Prévia visual do Figma</label>
        <select
          id="design-screen"
          aria-label="Tela da prévia"
          value={screen}
          onChange={(event) => {
            setScreen(event.target.value as Screen);
            window.scrollTo(0, 0);
          }}
        >
          {screens.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p>
          Dados ilustrativos · sem rotas novas ou operações de conta e compra
        </p>
      </aside>
      <div data-testid="design-canvas" aria-label="Espécime visual do Figma">
        {screen === 'home' && <App appRouter={previewRouter} />}
        {screen === 'nft' && (
          <NftDetailsPage
            {...common}
            nft={nftSpecimen}
            related={relatedNfts}
            quantity={quantity}
            edition={edition}
            onQuantityChange={setQuantity}
            onEditionChange={setEdition}
          />
        )}
        {screen === 'cart' && (
          <CartPage
            {...common}
            highlightedRemovalId="ivory"
            items={desktop ? desktopCartItems : mobileCartItems}
            totals={desktop ? desktopTotals : mobileTotals}
            related={relatedNfts}
            onQuantityChange={() =>
              notify('Alteração de quantidade do carrinho')
            }
            onRemove={() => notify('Remover item do carrinho')}
            onCoupon={submit('Aplicar código promocional')}
          />
        )}
        {screen === 'checkout' && (
          <CheckoutPage
            {...common}
            items={checkoutItems}
            totals={desktop ? desktopTotals : mobileTotals}
            wallets={walletSpecimens}
            wallet={wallet}
            provider={provider}
            onWalletChange={setWallet}
            onProviderChange={setProvider}
          />
        )}
        {screen === 'confirmation' && (
          <OrderConfirmationPage
            receipt={receiptSpecimen}
            onClose={() => notify('Fechar recibo')}
            onExplore={() => notify('Explorador de transação ilustrativa')}
          />
        )}
        {screen === 'login' && (
          <LoginPage
            {...auth}
            onSubmit={submit('Entrar na conta')}
            onSwitch={() => setScreen('register')}
          />
        )}
        {screen === 'register' && (
          <RegisterPage
            {...auth}
            onSubmit={submit('Criar conta')}
            onSwitch={() => setScreen('login')}
          />
        )}
        {screen === 'profile' && (
          <ProfilePage {...common} onSubmit={submit('Salvar perfil')} />
        )}
        {screen === 'wallets' && (
          <WalletsPage {...common} onSubmit={submit('Salvar carteira')} />
        )}
      </div>
    </>
  );
}
