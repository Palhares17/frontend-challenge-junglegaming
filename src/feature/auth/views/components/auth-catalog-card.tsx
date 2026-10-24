import type { Nft } from '@/core/entities/nft.entity';
import { NftCard } from '@/core/components/general/nft-card';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';

/** Visible card states behind the desktop auth panel in the Figma specimen. */
export function AuthCatalogCard({
  nft,
  portrait,
  showActions,
  onAction,
}: {
  nft: Nft;
  portrait: boolean;
  showActions: boolean;
  onAction: (label: string) => void;
}) {
  const actions = [
    {
      label: 'Adicionar ao carrinho',
      asset: figmaAssets.loginDesktop.shopping1,
    },
    { label: 'Favoritar NFT', asset: figmaAssets.loginDesktop.heart1 },
    { label: 'Ampliar NFT', asset: figmaAssets.loginDesktop.frame },
  ];
  return (
    <div className="auth-catalog-card">
      <NftCard
        nft={nft}
        variant={portrait ? 'portrait' : 'default'}
        onSelect={() => onAction('Detalhes do NFT')}
        onFavorite={() => onAction('Favoritos')}
      />
      {nft.isRare && <span className="auth-rarity-badge">RARO</span>}
      {showActions && (
        <div className="auth-card-actions">
          {actions.map((action) => (
            <button
              type="button"
              key={action.label}
              aria-label={`${action.label}: ${nft.name}`}
              onClick={() => onAction(action.label)}
            >
              <Icon asset={action.asset} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
