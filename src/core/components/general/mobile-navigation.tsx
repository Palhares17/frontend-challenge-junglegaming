import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { CatalogLink } from '@/core/router/navigation-links';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { decoration } from '@/core/lib/assets';
import { Icon } from './icon';
import { ScanMark } from './scan-mark';
import './mobile-navigation.css';

export function MobileNavigation() {
  const notify = useUnavailable();
  const navigation = useProductNavigation();
  return (
    <nav aria-label="Navegação mobile" className="mobile-navigation lg:hidden">
      <div className="mobile-navigation-background" aria-hidden="true" />
      <div className="relative grid h-[126px] grid-cols-5 items-end pb-5">
        <CatalogLink
          hash="inicio"
          label="Início"
          current={navigation ? undefined : 'page'}
          className="flex h-11 items-center justify-center rounded-full"
        >
          <Icon name="home" />
        </CatalogLink>
        <button
          type="button"
          aria-label="Favoritos"
          onClick={() => navigation ? navigation.onAction('Seus favoritos') : notify('Seus favoritos')}
          className="flex h-11 items-center justify-center rounded-full"
        >
          <Icon name="heart" />
        </button>
        <button
          type="button"
          aria-label="Explorar por imagem"
          onClick={() => notify('Explorar por imagem')}
          className="absolute top-0 left-1/2 flex size-[65px] -translate-x-1/2 items-center justify-center rounded-full"
          style={{ backgroundImage: `url(${decoration.navigationAction})` }}
        >
          <ScanMark />
        </button>
        <span aria-hidden="true" />
        {navigation ? (
          <Link
            to="/cart"
            aria-label="Carrinho"
            className="flex h-11 items-center justify-center rounded-full"
          >
            <Icon name="shop" />
            {!!navigation.cartCount && <span className="ml-1 text-xs font-bold text-text-accent">{navigation.cartCount}</span>}
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Carrinho"
            onClick={() => notify('Carrinho de NFTs')}
            className="flex h-11 items-center justify-center rounded-full"
          >
            <Icon name="shop" />
          </button>
        )}
        {navigation ? (
          <Link
            to="/account/profile"
            preload={false}
            aria-label="Meu perfil"
            className="flex h-11 items-center justify-center rounded-full"
          >
            <Icon name="user" />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Meu perfil"
            onClick={() => notify('Meu perfil')}
            className="flex h-11 items-center justify-center rounded-full"
          >
            <Icon name="user" />
          </button>
        )}
      </div>
    </nav>
  );
}
