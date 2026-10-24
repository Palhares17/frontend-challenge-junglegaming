import { useId } from 'react';
import { CollectorFields } from '@/core/components/form/collector-fields';
import { FormField } from '@/core/components/form/form-field';
import { Checkbox } from '@/core/components/ui/checkbox';
import { Textarea } from '@/core/components/ui/textarea';

export function CollectorCheckoutForm() {
  const checkbox = useId();
  const notes = useId();
  return (
    <section className="visual-form collector-checkout-form">
      <h1 className="mb-3 text-[17px] leading-4 font-bold">
        Perfil do colecionador
      </h1>
      <CollectorFields />
      <label
        htmlFor={checkbox}
        className="mt-6 flex items-center gap-2 text-sm"
      >
        <Checkbox id={checkbox} name="otherWallet" className="rounded-full" />
        Usar outra carteira?
      </label>
      <div className="mt-5 max-w-[350px]">
        <FormField id={notes} label="Observação do colecionador (opcional)">
          <Textarea
            id={notes}
            name="notes"
            className="min-h-[150px] resize-y rounded-input border-input bg-transparent"
          />
        </FormField>
      </div>
    </section>
  );
}
