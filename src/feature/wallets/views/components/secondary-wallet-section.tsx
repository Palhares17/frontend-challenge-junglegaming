import { useId } from 'react';
import { Checkbox } from '@/core/components/ui/checkbox';

export function SecondaryWalletSection({ onAdd }: { onAdd: () => void }) {
  const id = useId();
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="account-heading">Carteira secundária</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="flex items-center gap-2 text-sm">
            <Checkbox id={id} className="rounded-full" />
            Igual à carteira principal
          </label>
          <button
            type="button"
            onClick={onAdd}
            className="text-[15px] text-text-accent"
          >
            Adicionar
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        Você ainda não adicionou uma carteira secundária.
      </p>
    </section>
  );
}
