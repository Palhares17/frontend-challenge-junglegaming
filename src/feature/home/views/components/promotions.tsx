import { artwork } from '@/core/lib/assets';
import { PromoCard } from './promo-card';

export function Promotions() {
  return (
    <section
      aria-label="Seleções em destaque"
      className="mt-16 grid gap-7 lg:mt-section lg:grid-cols-2"
    >
      <PromoCard
        title={'Lançamentos gênesis\nde edição limitada'}
        description="Colecione edições escassas diretamente dos criadores antes da revelação pública."
        image={artwork.emerald}
        imageAlt="Macaco de jaqueta verde da seleção gênesis"
      />
      <PromoCard
        title={'Arte digital selecionada\ne muito mais'}
        description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura."
        image={artwork.neon}
        imageAlt="Macaco de paletó da seleção de arte digital"
      />
    </section>
  );
}
