import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from './icon';

export type AccountSection = 'profile' | 'wallets';

export function AccountSidebar({
  active,
  onAction,
}: {
  active: AccountSection;
  onAction: (label: string) => void;
}) {
  const navigation = useProductNavigation();
  const assets =
    active === 'profile'
      ? figmaAssets.profileDesktop
      : figmaAssets.walletsDesktop;
  const items = [
    { key: 'profile', label: 'Dados do perfil', asset: assets.user },
    { key: 'wallets', label: 'Carteiras', asset: assets.location },
    { key: 'activity', label: 'Atividade', asset: assets.shopping1 },
    { key: 'favorites', label: 'Lista de interesse', asset: assets.heart1 },
    { key: 'offers', label: 'Ofertas', asset: assets.activity },
    { key: 'downloads', label: 'Arquivos baixados', asset: assets.download },
    { key: 'support', label: 'Suporte', asset: assets.dangerTriangle },
  ];
  return (
    <nav aria-label="Minha conta" className="account-sidebar">
      <h2 className="px-2.5 py-2.5 text-lg leading-4 font-bold">Meu perfil</h2>
      {items.map((item) =>
        navigation && (item.key === 'profile' || item.key === 'wallets') ? (
          <Link
            key={item.key}
            preload={false}
            to={
              item.key === 'profile' ? '/account/profile' : '/account/wallets'
            }
            aria-current={active === item.key ? 'page' : undefined}
          >
            <span className="flex w-[18px] shrink-0 items-center justify-center">
              <Icon asset={item.asset} />
            </span>
            {item.label}
          </Link>
        ) : (
          <button
            key={item.key}
            type="button"
            aria-current={active === item.key ? 'page' : undefined}
            onClick={() => onAction(item.label)}
          >
            <span className="flex w-[18px] shrink-0 items-center justify-center">
              <Icon asset={item.asset} />
            </span>
            {item.label}
          </button>
        ),
      )}
      <button
        type="button"
        className="border-t border-border-soft font-bold"
        onClick={() => onAction('Sair')}
      >
        <Icon asset={assets.logout1} />
        Sair
      </button>
    </nav>
  );
}
