import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from './icon';
import './quantity-control.css';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  large?: boolean;
  muted?: boolean;
  label?: string;
}

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
  large,
  muted,
  label = 'Quantidade',
}: QuantityControlProps) {
  const assets = large ? figmaAssets.nftDesktop : figmaAssets.nftMobile;
  return (
    <div
      role="group"
      aria-label={label}
      className={`quantity-control ${large ? 'quantity-large' : ''} ${muted ? 'quantity-muted' : ''}`}
    >
      <button
        type="button"
        aria-label={`Diminuir ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <span>
          {muted ? (
            <>
              <Icon
                asset={
                  value <= min
                    ? figmaAssets.cartMobile.group65
                    : figmaAssets.cartMobile.group72
                }
                className="lg:hidden"
              />
              <Icon asset={assets.frame} className="hidden lg:block" />
            </>
          ) : (
            <Icon asset={assets.frame} />
          )}
        </span>
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        aria-label={`Aumentar ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <span>
          {muted ? (
            <>
              <span className="text-[21px] leading-4 font-normal text-foreground lg:hidden">
                +
              </span>
              <Icon asset={assets.frame1} className="hidden lg:block" />
            </>
          ) : (
            <Icon asset={assets.frame1} />
          )}
        </span>
      </button>
    </div>
  );
}
