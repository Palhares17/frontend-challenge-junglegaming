import { artwork } from '@/core/lib/assets';
import { EditorialCard, type EditorialCardProps } from './editorial-card';

const articles: EditorialCardProps[] = [
  {
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    meta: '12 de setembro | Leitura de 6 min',
    image: artwork.neon,
  },
  {
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
    meta: '13 de setembro | Leitura de 2 min',
    image: artwork.emerald,
  },
  {
    title: 'Raridade, atributos e procedência',
    description:
      'Entenda raridade, procedência, direitos autorais e utilidade.',
    meta: '15 de setembro | Leitura de 3 min',
    image: artwork.sage,
  },
  {
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    meta: '15 de setembro | Leitura de 2 min',
    image: artwork.golden,
  },
];

export function EditorialSection() {
  return (
    <section
      id="diario"
      aria-labelledby="editorial-title"
      className="mt-16 scroll-mt-6 lg:mt-section"
    >
      <div className="text-center">
        <h2 id="editorial-title" className="text-editorial text-text-editorial">
          Diário da Cunhagem
        </h2>
        <p className="mt-3 text-sm text-text-secondary">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[repeat(4,268px)]">
        {articles.map((article) => (
          <EditorialCard key={article.title} {...article} />
        ))}
      </div>
    </section>
  );
}
