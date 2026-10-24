import { CatalogLink } from '@/core/router/navigation-links';
import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
export function Breadcrumbs({
  items,
  onNavigate,
}: {
  items: readonly string[];
  onNavigate: (label: string) => void;
}) {
  const navigation = useProductNavigation();
  return (
    <nav
      aria-label="Caminho da página"
      className="hidden text-[15px] leading-4 font-bold lg:block"
    >
      <ol className="flex flex-wrap gap-2">
        {items.map((label, index) => (
          <li key={label} className="flex gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 &&
            !(navigation && label === 'Mercado') ? (
              <span aria-current="page">{label}</span>
            ) : navigation && label === 'Carrinho' ? (
              <Link to="/cart" className="hover:text-text-accent">
                {label}
              </Link>
            ) : (
              <CatalogLink
                hash={label === 'Mercado' ? 'catalogo' : 'inicio'}
                className="hover:text-text-accent"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(label);
                }}
              >
                {label}
              </CatalogLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
