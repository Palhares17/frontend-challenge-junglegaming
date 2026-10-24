import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@/core/components/ui/radio-group';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';
import type { WalletProvider } from '../../entities/wallet-presentation.entity';

const providers = [
  { value: 'walletconnect', label: 'WalletConnect', mark: 'W' },
  { value: 'metamask', label: 'MetaMask', mark: 'M' },
  { value: 'coinbase', label: 'Coinbase Wallet', mark: null },
] as const;

export function WalletProviderSelector({
  value,
  onChange,
}: {
  value: WalletProvider;
  onChange: (value: WalletProvider) => void;
}) {
  return (
    <section className="wallet-provider-selector">
      <h2 className="mb-3 text-base leading-4 font-bold lg:mb-5 lg:text-center lg:text-[17px]">
        Carteira e rede
      </h2>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as WalletProvider)}
        aria-label="Provedor de carteira"
        className="gap-4"
      >
        {providers.map((provider) => (
          <Radio.Root
            key={provider.value}
            value={provider.value}
            aria-label={provider.label}
            className="wallet-provider-option"
          >
            <span className="wallet-provider-mark">
              <Icon asset={figmaAssets.checkoutMobile.ellipse44} />
              {provider.mark ? (
                <span>{provider.mark}</span>
              ) : (
                <span>
                  <Icon asset={figmaAssets.checkoutMobile.wallet} />
                </span>
              )}
            </span>
            <span className="wallet-provider-name">{provider.label}</span>
            <span className="wallet-provider-mobile-radio">
              <Icon
                asset={
                  value === provider.value
                    ? figmaAssets.checkoutMobile.group90
                    : figmaAssets.checkoutMobile.ellipse46
                }
              />
            </span>
            <span className="wallet-provider-desktop-radio">
              <Icon
                asset={
                  value === provider.value
                    ? figmaAssets.checkoutDesktop.frame323
                    : figmaAssets.checkoutDesktop.ellipse32
                }
              />
            </span>
            {provider.value === 'walletconnect' && (
              <span className="wallet-provider-chip">
                METAMASK · WALLETCONNECT · COINBASE
              </span>
            )}
          </Radio.Root>
        ))}
      </RadioGroup>
    </section>
  );
}
