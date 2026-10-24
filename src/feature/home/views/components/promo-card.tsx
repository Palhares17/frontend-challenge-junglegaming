import { buttonVariants } from '@/core/components/ui/button';
import { Icon } from '@/core/components/general/icon';
import { NftArtwork } from '@/core/components/general/nft-artwork';
import { cn } from '@/core/lib/utils';

interface PromoCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function PromoCard({
  title,
  description,
  image,
  imageAlt,
}: PromoCardProps) {
  return (
    <article className="promo-card relative isolate grid min-h-[250px] grid-cols-2 overflow-hidden rounded-promo bg-card lg:h-[250px]">
      <NftArtwork
        src={image}
        alt={imageAlt}
        loading="lazy"
        className="h-full min-h-[250px] w-full rounded-[17px] lg:h-[250px]"
      />
      <div
        className="promo-mask pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-w-0 flex-col items-end py-7 pr-6 text-right lg:py-[37px] lg:pr-[30px]">
        <h2 className="text-promo whitespace-pre-line">{title}</h2>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          {description}
        </p>
        <a
          href="#catalogo"
          className={cn(buttonVariants(), 'mt-4 h-10 gap-2 px-5 text-sm')}
        >
          Explorar
          <Icon name="arrow" className="-rotate-90" />
        </a>
      </div>
    </article>
  );
}
