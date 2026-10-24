import { Link } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/core/components/ui/dialog';
import { NftArtwork } from '@/core/components/general/nft-artwork';
import { useFavorites } from '../hooks/use-favorites';
export function FavoritesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Seus favoritos</DialogTitle>
        <DialogDescription>NFTs salvos na sua conta.</DialogDescription>
        {open && <FavoriteItems onSelect={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
function FavoriteItems({ onSelect }: { onSelect: () => void }) {
  const favorites = useFavorites();
  if (favorites.loading) return <p role="status">Carregando favoritos…</p>;
  if (favorites.error)
    return (
      <div role="alert">
        Não foi possível carregar favoritos.{' '}
        <button type="button" onClick={() => void favorites.retry()}>
          Tentar novamente
        </button>
      </div>
    );
  return !favorites.items.length ? (
    <p role="status">Você ainda não salvou NFTs.</p>
  ) : (
    <ul className="max-h-[60svh] space-y-4 overflow-y-auto">
      {favorites.items.map((nft) => (
        <li key={nft.id} className="flex items-center gap-4">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            onClick={onSelect}
            className="flex flex-1 items-center gap-3"
          >
            <NftArtwork
              src={nft.image}
              alt=""
              sizes="64px"
              className="size-16 rounded-input"
            />
            {nft.name}
          </Link>
          <button
            type="button"
            disabled={favorites.pending}
            onClick={() => favorites.toggle(nft)}
            aria-label={`Remover favorito ${nft.name}`}
            className="text-sm text-text-accent"
          >
            Remover
          </button>
        </li>
      ))}
    </ul>
  );
}
