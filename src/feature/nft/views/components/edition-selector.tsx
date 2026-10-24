import { RadioGroup as Group } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { figmaAssets } from '@/core/lib/figma-assets';

const options = [
  {
    value: 'single',
    label: '1/1',
    desktop: figmaAssets.nftDesktop.ellipse24,
    mobile: figmaAssets.nftMobile.ellipse25,
  },
  {
    value: 'ten',
    label: '1/10',
    desktop: figmaAssets.nftDesktop.ellipse25,
    mobile: figmaAssets.nftMobile.ellipse25,
  },
  {
    value: 'fifty',
    label: '1/50',
    desktop: figmaAssets.nftDesktop.ellipse26,
    mobile: figmaAssets.nftMobile.ellipse26,
  },
  {
    value: 'open',
    label: 'ABERTA',
    desktop: figmaAssets.nftDesktop.ellipse27,
    mobile: figmaAssets.nftMobile.ellipse27,
  },
] as const;

export function EditionSelector({
  value,
  editions,
  onChange,
}: {
  value: string;
  editions?: import('@/core/entities/marketplace.entity').NftEdition[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[15px] leading-4 font-bold lg:mb-3">
        Edição:
      </legend>
      <Group
        value={value}
        onValueChange={onChange}
        aria-label="Edição do NFT"
        className="flex flex-wrap gap-3 lg:gap-1.5"
      >
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            disabled={editions ? !editions.some(item => item.id === option.value && item.available > 0) : false}
            data-edition={option.value}
            className="edition-choice"
            style={
              {
                '--edition-desktop-width': `${option.desktop.width}px`,
                '--edition-mobile-width': `${option.mobile.width}px`,
              } as React.CSSProperties
            }
          >
            <span className="relative">{option.label}</span>
          </Radio.Root>
        ))}
      </Group>
    </fieldset>
  );
}
