import { useState } from 'react';
import { NftArtwork } from '@/core/components/general/nft-artwork';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/core/components/ui/dialog';
import type { NftPresentation } from '../../entities/nft-presentation.entity';

export function NftGallery({
  nft,
  favorite,
  onBack,
  onFavorite,
}: {
  nft: NftPresentation;
  favorite?: boolean;
  onBack: () => void;
  onFavorite: () => void;
}) {
  const [selected, setSelected] = useState(1);
  const [zoom, setZoom] = useState(false);
  const image = nft.gallery[selected] ?? nft.gallery[0];
  return (
    <div className="nft-gallery">
      <div className="nft-mobile-gallery-actions">
        <button
          type="button"
          aria-label="Voltar"
          onClick={onBack}
          className="mobile-back-button"
        >
          <Icon
            asset={figmaAssets.nftMobile.arrowLeft2}
            className="rotate-90"
          />
        </button>
        <button
          type="button"
          aria-label="Favoritar NFT"
          aria-pressed={favorite}
          onClick={onFavorite}
          className="mobile-back-button"
        >
          <Icon asset={figmaAssets.nftMobile.vector} />
        </button>
      </div>
      <div className="nft-thumbnails" aria-label="Imagens do NFT">
        {nft.gallery.map((thumbnail, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ver imagem ${index + 1} de ${nft.name}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <NftArtwork src={thumbnail.src} alt={thumbnail.alt} />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="nft-main-artwork"
        onClick={() => setZoom(true)}
        aria-label={`Ampliar imagem de ${nft.name}`}
      >
        <NftArtwork src={image.src} alt={image.alt} fetchPriority="high" sizes="(min-width:1024px) 600px, 100vw" />
        <span className="nft-zoom-icon">
          <Icon asset={figmaAssets.nftDesktop.frame238} />
        </span>
      </button>
      <div className="nft-mobile-gallery-dots" aria-hidden="true">
        <Icon asset={figmaAssets.nftMobile.group62} />
      </div>
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-[min(90vw,740px)] sm:max-w-[min(90vw,740px)]">
          <DialogTitle>Imagem de {nft.name}</DialogTitle>
          <NftArtwork
            src={image.src}
            alt={image.alt}
            sizes="90vw"
            className="max-h-[75svh] w-full rounded-4xl object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
