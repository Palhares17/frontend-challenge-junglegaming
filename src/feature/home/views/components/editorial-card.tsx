import { useUnavailable } from '@/core/hooks/use-unavailable';
import { NftArtwork } from '@/core/components/general/nft-artwork';

export interface EditorialCardProps {
  title: string;
  description: string;
  meta: string;
  image: string;
}

export function EditorialCard({
  title,
  description,
  meta,
  image,
}: EditorialCardProps) {
  const notify = useUnavailable();
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-promo bg-card">
      <NftArtwork
        src={image}
        alt=""
        loading="lazy"
        className="h-[195px] w-full"
      />
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4">
        <p className="text-caption font-medium text-text-secondary">{meta}</p>
        <h3 className="text-base leading-[21px] font-bold text-text-editorial">
          {title}
        </h3>
        <p className="text-caption font-medium text-text-secondary">
          {description}
        </p>
        <button
          type="button"
          onClick={() => notify(title)}
          className="mt-auto flex min-h-6 items-center gap-1 self-start text-xs font-bold text-text-accent"
        >
          Ler mais<span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
