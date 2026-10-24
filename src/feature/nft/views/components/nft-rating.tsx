import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';

export function NftRating({
  rating,
  count,
}: {
  rating: string;
  count: number;
}) {
  return (
    <div
      aria-label={`${rating} de 5, ${count} avaliações de colecionadores`}
      className="nft-rating"
    >
      <span className="hidden items-center gap-1 lg:flex">
        {Array.from({ length: 5 }, (_, index) => (
          <Icon
            key={index}
            asset={
              index === 4
                ? figmaAssets.nftDesktop.star1
                : figmaAssets.nftDesktop.star
            }
          />
        ))}
      </span>
      <span className="lg:hidden">
        <Icon asset={figmaAssets.nftMobile.star} />
      </span>
      <span className="lg:hidden">{rating}</span>
      <span className="hidden text-[15px] lg:inline">
        {count} avaliações de colecionadores
      </span>
      <span className="text-text-secondary lg:hidden">({count})</span>
    </div>
  );
}
