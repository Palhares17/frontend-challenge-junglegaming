import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { CatalogLink } from '@/core/router/navigation-links';
import { useState } from 'react';
import { Button, buttonVariants } from '@/core/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/ui/dialog';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { artwork, decoration } from '@/core/lib/assets';
import { figmaAssets } from '@/core/lib/figma-assets';
import { cn } from '@/core/lib/utils';
import { Brand } from './brand';
import { Icon } from './icon';
import { IconButton } from './icon-button';
import { NftArtwork } from './nft-artwork';
import { SearchField } from './search-field';

interface SiteHeaderProps {
  query: string;
  onSearch: (query: string) => void;
  active?: 'home' | 'market' | null;
  divider?: boolean;
  onNavigate?: (label: string) => void;
}

export function SiteHeader({
  query,
  onSearch,
  active = 'home',
  divider = true,
  onNavigate,
}: SiteHeaderProps) {
  const notify = useUnavailable();
  const navigation = useProductNavigation();
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header
      className={cn(
        'hidden min-h-[45px] items-start justify-between lg:flex',
        divider && 'border-b-[0.3px] border-primary/50',
      )}
    >
      <Brand className="h-[35px] w-40" />
      <nav
        aria-label="Navegação principal"
        className="flex items-start gap-10 text-base leading-5"
      >
        <CatalogLink
          hash="inicio"
          current={active === 'home' ? 'page' : undefined}
          onClick={
            onNavigate
              ? (event) => {
                  event.preventDefault();
                  onNavigate('Início');
                }
              : undefined
          }
          className={cn(
            'relative pb-6',
            active === 'home' && 'font-bold text-text-accent',
          )}
        >
          Início
          {active === 'home' && (
            <img
              src={decoration.activeNavigation}
              width={58}
              height={3}
              alt=""
              className="absolute bottom-0 left-0"
            />
          )}
        </CatalogLink>
        <CatalogLink
          hash="catalogo"
          current={active === 'market' ? 'page' : undefined}
          onClick={
            onNavigate
              ? (event) => {
                  event.preventDefault();
                  onNavigate('Mercado');
                }
              : undefined
          }
          className={cn(
            'relative hover:text-text-accent',
            active === 'market' && 'pb-6 font-bold text-text-accent',
          )}
        >
          Mercado
          {active === 'market' && (
            <img
              src={figmaAssets.nftDesktop.activeUnderline.src}
              width={figmaAssets.nftDesktop.activeUnderline.width}
              height={figmaAssets.nftDesktop.activeUnderline.height}
              alt=""
              className="absolute bottom-0 left-0"
            />
          )}
        </CatalogLink>
        <button
          type="button"
          className="hover:text-text-accent"
          onClick={() => notify('Criadores')}
        >
          Criadores
        </button>
        <CatalogLink hash="diario" className="hover:text-text-accent">
          Aprenda
        </CatalogLink>
      </nav>
      <div className="-mt-1.5 flex items-center gap-2">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger
            render={<IconButton icon="search" label="Abrir busca" />}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buscar NFTs</DialogTitle>
              <DialogDescription>
                Encontre uma obra pelo nome.
              </DialogDescription>
            </DialogHeader>
            <SearchField
              query={query}
              onSearch={(value) => {
                (navigation && onNavigate ? navigation.onSearch : onSearch)(
                  value,
                );
                setSearchOpen(false);
                document.getElementById('catalogo')?.scrollIntoView();
              }}
            />
          </DialogContent>
        </Dialog>
        {navigation ? (
          <Link
            to="/cart"
            aria-label="Abrir carrinho"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-11')}
          >
            <Icon name="cart" />
            {!!navigation.cartCount && <span className="text-xs font-bold text-text-accent">{navigation.cartCount}</span>}
          </Link>
        ) : (
          <IconButton
            icon="cart"
            label="Abrir carrinho"
            onClick={() => notify('Carrinho de NFTs')}
          />
        )}
        {navigation ? (
          navigation.user ? (
            <Link
              to="/account/profile"
              preload={false}
              aria-label="Meu perfil"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'ml-3 size-11 rounded-full border-0 p-0',
              )}
            >
              <NftArtwork
                src={artwork.emerald}
                alt=""
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-full"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              data-auth-trigger
              resetScroll={false}
              search={{ redirect: navigation.returnTo }}
              className={cn(buttonVariants(), 'ml-3 h-[35px] gap-1 px-2 text-base font-medium')}
            >
              <Icon name="signIn" />
              Entrar
            </Link>
          )
        ) : (
          <Button
            className="ml-3 h-[35px] gap-1 px-2 text-base font-medium"
            onClick={() => notify('Entrar na Kurio')}
          >
            <Icon name="signIn" />
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
}
