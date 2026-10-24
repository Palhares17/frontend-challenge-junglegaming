import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { Brand } from './brand';
import { FooterBenefit } from './footer-benefit';
import { FooterLinks } from './footer-links';
import { NewsletterForm } from './newsletter-form';
import { IconButton } from './icon-button';

interface SiteFooterProps {
  onCollection: (collection: string) => void;
  collections?: readonly { value: string; label: string }[];
}

const footerCollections = [
  { value: 'digital-art', label: 'Arte digital' },
  { value: 'photography', label: 'Fotografia' },
  { value: 'music', label: 'Música' },
  { value: '3d-art', label: 'Arte 3D' },
  { value: 'utility', label: 'Utilidade' },
] as const;

export function SiteFooter({
  onCollection,
  collections = footerCollections,
}: SiteFooterProps) {
  const notify = useUnavailable();
  const navigation = useProductNavigation();
  return (
    <footer className="mt-16 mb-36 text-sm lg:mt-section lg:mb-0">
      <div className="grid gap-8 bg-card p-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.3fr] lg:gap-0 lg:p-8 xl:h-[250px]">
        <div className="lg:border-r lg:border-primary/60 lg:px-4">
          <FooterBenefit
            mark="W"
            title="Segurança da carteira"
            description="Proteja sua carteira e colecione arte digital verificada com confiança."
          />
        </div>
        <div className="lg:border-r lg:border-primary/60 lg:px-4">
          <FooterBenefit
            mark="C"
            title="Criadores em destaque"
            description="Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede."
          />
        </div>
        <div className="lg:border-r lg:border-primary/60 lg:px-4">
          <FooterBenefit
            mark="D"
            title="Alertas de lançamentos"
            description="Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado."
          />
        </div>
        <div className="lg:px-4">
          <NewsletterForm />
        </div>
      </div>
      <div className="grid gap-6 bg-surface-dark p-6 md:grid-cols-2 lg:min-h-[88px] lg:grid-cols-4 lg:items-center lg:px-8 lg:py-5">
        <Brand />
        <p>
          Feito para colecionadores,
          <br />
          criadores e cultura
        </p>
        <p>contato@email.com</p>
        <p>+55 11 4002 8922</p>
      </div>
      <div className="grid gap-8 bg-card p-6 md:grid-cols-2 lg:min-h-[236px] lg:grid-cols-4 lg:p-8">
        <FooterLinks
          title="Meu perfil"
          links={[
            'Meu perfil',
            'Minha coleção',
            'Atividade',
            'Estúdio do criador',
            'Lista de interesse',
          ]}
        />
        <FooterLinks
          title="Central de ajuda"
          links={[
            'Central de ajuda',
            'Como comprar NFTs',
            'Carteira e segurança',
            'Política do mercado',
            'Denunciar item',
          ]}
        />
        <section>
          <h2 className="text-lg leading-4 font-bold">Coleções</h2>
          <ul className="mt-2 leading-[30px]">
            {collections.map((option) => (
              <li key={option.value}>
                {navigation ? (
                  <Link
                    to="/"
                    search={{
                      ...navigation.catalogSearch,
                      collections: [option.value],
                      page: 1,
                    }}
                    hash="catalogo"
                    className="hover:text-text-accent"
                  >
                    {option.label}
                  </Link>
                ) : (
                  <a
                    href="#catalogo"
                    onClick={() => onCollection(option.value)}
                    className="hover:text-text-accent"
                  >
                    {option.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg leading-4 font-bold">Redes sociais</h2>
          <div className="mt-2 flex flex-wrap gap-0.5">
            {(
              [
                'facebook',
                'instagram',
                'twitter',
                'linkedin',
                'youtube',
              ] as const
            ).map((name) => (
              <IconButton
                key={name}
                icon={name}
                label={name}
                onClick={() => notify('Redes sociais da Kurio')}
                className="size-9"
              />
            ))}
          </div>
          <h2 className="mt-5 text-lg leading-4 font-bold">
            Carteiras compatíveis
          </h2>
          <p className="mt-3 rounded-button border border-border-soft bg-surface-dark px-2 py-1.5 text-center text-[9px] font-bold tracking-[0.1px] text-text-accent">
            METAMASK · WALLETCONNECT · COINBASE
          </p>
        </section>
      </div>
      <p className="pt-1.5 text-center text-sm leading-[30px]">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
