import { artwork, decoration } from '@/core/lib/assets';
import { NftArtwork } from '@/core/components/general/nft-artwork';
import { Icon } from '@/core/components/general/icon';
import { buttonVariants } from '@/core/components/ui/button';
import { cn } from '@/core/lib/utils';

export function Hero({
  description = 'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
}: {
  description?: string;
}) {
  return (
    <section aria-labelledby="hero-heading" className="home-hero">
      <div className="home-hero-content">
        <p className="text-xs font-medium leading-4 lg:text-sm lg:tracking-brand">
          Bem-vindo à Kurio
        </p>
        <h1
          id="hero-heading"
          className="mt-1.5 text-display-mobile lg:mt-2 lg:text-display"
        >
          <span className="lg:hidden">
            SEJA DONO DA
            <br />
            CULTURA DIGITAL
          </span>
          <span className="hidden lg:inline">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </span>
        </h1>
        <p className="mt-1.5 text-xs leading-[18px] text-text-secondary lg:hidden">
          Descubra NFTs selecionados de criadores do mundo todo.
        </p>
        <p className="mt-1 hidden max-w-[557px] text-body-relaxed text-text-secondary lg:block">
          {description}
        </p>
        <a
          href="#catalogo"
          className={cn(
            buttonVariants(),
            'mt-0 h-auto gap-2 rounded-button border-0 bg-transparent p-0 text-xs leading-[14px] font-bold text-text-accent hover:bg-transparent lg:mt-8 lg:h-10 lg:w-[140px] lg:bg-primary lg:px-7 lg:text-base lg:text-primary-foreground lg:hover:bg-primary/85',
          )}
        >
          EXPLORAR
          <Icon name="arrowMobile" className="-rotate-90 lg:hidden" />
        </a>
      </div>
      <div className="home-hero-artwork">
        <NftArtwork
          sizes="(min-width:1024px) 360px, 138px"
          src={artwork.emerald}
          alt="NFT de um macaco com óculos e jaqueta verde"
          loading="eager"
          fetchPriority="high"
          className="size-full rounded-3xl lg:rounded-4xl"
        />
        <NftArtwork
          sizes="58px"
          src={artwork.sage}
          alt=""
          className="absolute top-[88px] left-[14px] size-[58px] rounded-3xl lg:hidden"
        />
      </div>
      <div className="home-hero-indicator" aria-hidden="true">
        <img
          src={decoration.heroDotsMobile}
          width={33}
          height={7}
          alt=""
          className="lg:hidden"
        />
        <img
          src={decoration.heroDots}
          width={40}
          height={8}
          alt=""
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}
