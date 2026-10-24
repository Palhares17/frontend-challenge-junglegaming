import { useEffect, useState } from 'react';
import { Slider } from '@/core/components/ui/slider';
import { Button } from '@/core/components/ui/button';
import { centsToEth } from '@/core/lib/eth';

interface PriceFilterProps {
  min: number;
  max: number;
  onApply: (min: number, max: number) => void;
}

export function PriceFilter({ min, max, onApply }: PriceFilterProps) {
  const [range, setRange] = useState([min, max]);
  useEffect(() => setRange([min, max]), [min, max]);
  return (
    <fieldset>
      <legend className="mb-3 text-lg leading-4 font-bold">
        Faixa de preço
      </legend>
      <div className="space-y-3 pl-3">
        <Slider
          aria-label="Faixa de preço em ETH"
          getThumbLabel={(index) =>
            index === 0 ? 'Preço mínimo' : 'Preço máximo'
          }
          formatValue={(value) => `${centsToEth(value)} ETH`}
          min={2}
          max={1230}
          step={1}
          value={range}
          onValueChange={(value) =>
            setRange(Array.isArray(value) ? value : [value, range[1]])
          }
        />
        <p className="text-[15px] leading-5" aria-live="polite">
          Preço: {centsToEth(range[0]).replace('.', ',')} -{' '}
          {centsToEth(range[1]).replace('.', ',')} ETH
        </p>
        <Button
          size="sm"
          className="h-9 px-3 text-base"
          onClick={() => onApply(range[0], range[1])}
        >
          Aplicar
        </Button>
      </div>
    </fieldset>
  );
}
