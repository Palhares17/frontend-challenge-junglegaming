import { NftDetailsLink } from '@/core/router/navigation-links';
import { artwork } from '@/core/lib/assets';
import { NftArtwork } from '@/core/components/general/nft-artwork';

export function FeaturedNft({ onSelect }: { onSelect: () => void }) {
  return (
    <aside className="featured-nft relative h-[470px] overflow-hidden pt-6">
      <h2 className="px-5 text-featured text-text-accent">NFT EM DESTAQUE</h2>
      <p className="mt-4 px-5 text-center text-[22px] leading-4 font-bold">
        OFERTA LIMITADA
      </p>
      <NftDetailsLink
        nftId="nft-2"
        className="mt-4 block h-[368px] w-full rounded-[22px]"
        onSelect={onSelect}
        label="Ver NFT em destaque"
      >
        <NftArtwork
          src={artwork.sage}
          alt="NFT em destaque: macaco de chapéu e roupa roxa"
          loading="lazy"
          className="size-full rounded-[22px]"
        />
      </NftDetailsLink>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[299px] left-4 size-[22px] rounded-[7px] border-2 border-[#46a358] opacity-20"
      />
      <span
        aria-hidden="true"
        className="featured-orbit pointer-events-none absolute top-[343px] left-[248px] size-[45px] rounded-full"
      />
      <span
        aria-hidden="true"
        className="featured-orbit pointer-events-none absolute top-[105px] left-[38px] size-[15px] rounded-full"
      />
    </aside>
  );
}
