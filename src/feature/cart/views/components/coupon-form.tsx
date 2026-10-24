import { useId, type FormEventHandler } from 'react';
import { Input } from '@/core/components/ui/input';
import { Button } from '@/core/components/ui/button';

export function CouponForm({
  onSubmit,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const id = useId();
  return (
    <form onSubmit={onSubmit} className="coupon-form">
      <label
        htmlFor={id}
        className="mb-2 hidden text-sm leading-4 font-medium lg:block"
      >
        Código promocional
      </label>
      <div className="flex min-w-0">
        <Input
          id={id}
          name="coupon"
          autoComplete="off"
          aria-label="Código promocional"
          placeholder="Digite o código promocional..."
          className="min-w-0"
        />
        <Button type="submit">Aplicar</Button>
      </div>
    </form>
  );
}
