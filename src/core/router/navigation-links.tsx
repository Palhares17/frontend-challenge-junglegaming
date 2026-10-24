import type { ReactNode, MouseEventHandler } from 'react';
import { Link } from '@tanstack/react-router';
import { useProductNavigation } from './navigation';

export function CatalogLink({
  children,
  hash,
  className,
  label,
  current,
  onClick,
}: {
  children: ReactNode;
  hash?: string;
  className?: string;
  label?: string;
  current?: 'page';
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const navigation = useProductNavigation();
  if (navigation)
    return (
      <Link
        to="/"
        search={navigation.catalogSearch}
        hash={hash}
        className={className}
        aria-label={label}
        aria-current={current}
      >
        {children}
      </Link>
    );
  return (
    <a
      href={hash ? `#${hash}` : '/'}
      className={className}
      aria-label={label}
      aria-current={current}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
export function NftDetailsLink({
  children,
  nftId,
  className,
  label,
  onSelect,
}: {
  children: ReactNode;
  nftId: string;
  className?: string;
  label?: string;
  onSelect: () => void;
}) {
  const navigation = useProductNavigation();
  return navigation ? (
    <Link
      to="/nfts/$nftId"
      params={{ nftId }}
      className={className}
      aria-label={label}
    >
      {children}
    </Link>
  ) : (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
