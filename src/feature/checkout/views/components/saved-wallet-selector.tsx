import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@/core/components/ui/radio-group';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';
import type { SavedWalletPresentation } from '../../entities/wallet-presentation.entity';

export function SavedWalletSelector({
  wallets,
  value,
  onChange,
  onAction,
}: {
  wallets: readonly SavedWalletPresentation[];
  value: string;
  onChange: (value: string) => void;
  onAction: (label: string) => void;
}) {
  return (
    <section className="saved-wallet-selector lg:hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base leading-6 font-bold">Carteiras salvas</h2>
        <button
          type="button"
          onClick={() =>
            onAction(wallets.length ? 'Trocar carteira' : 'Adicionar carteira')
          }
          className="text-sm font-bold text-text-accent"
        >
          {wallets.length ? 'Trocar carteira' : 'Adicionar carteira'}
        </button>
      </div>
      {!wallets.length && (
        <p className="text-sm leading-6 text-text-secondary">
          Você ainda não adicionou uma carteira. Nenhuma carteira está conectada.
        </p>
      )}
      {!!wallets.length && (
        <RadioGroup
          value={value}
          onValueChange={onChange}
          aria-label="Carteiras salvas"
          className="gap-5"
        >
          {wallets.map((wallet) => (
            <div key={wallet.id} className="saved-wallet-card">
              <Radio.Root
                value={wallet.id}
                aria-label={wallet.label}
                className="saved-wallet-choice"
              >
                <Icon
                  asset={
                    value === wallet.id
                      ? figmaAssets.checkoutMobile.group90
                      : figmaAssets.checkoutMobile.ellipse46
                  }
                />
                <span>
                  <strong>{wallet.label}</strong>
                  <span className="mt-1 block leading-[22px] text-text-secondary">
                    {wallet.address}
                    <br />
                    {wallet.network}
                  </span>
                </span>
              </Radio.Root>
              <button
                type="button"
                onClick={() => onAction(`Opções da carteira ${wallet.label}`)}
                aria-label={`Opções da carteira ${wallet.label}`}
                className="saved-wallet-more"
              >
                <Icon asset={figmaAssets.checkoutMobile.group87} />
              </button>
            </div>
          ))}
        </RadioGroup>
      )}
    </section>
  );
}
