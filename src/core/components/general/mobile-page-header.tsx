import type { ReactNode } from 'react';
import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from './icon';

interface MobilePageHeaderProps {
  title: string;
  onBack: () => void;
  trailing?: ReactNode;
}

export function MobilePageHeader({
  title,
  onBack,
  trailing,
}: MobilePageHeaderProps) {
  return (
    <header className="mobile-page-header lg:hidden">
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="mobile-back-button"
      >
        <Icon asset={figmaAssets.cartMobile.arrowLeft2} className="rotate-90" />
      </button>
      <h1 className="min-w-0 text-center text-xl leading-7 font-bold">
        {title}
      </h1>
      {trailing ?? <span aria-hidden="true" />}
    </header>
  );
}
