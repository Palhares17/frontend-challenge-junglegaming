import type { ReactNode } from 'react';
import { Button } from '@/core/components/ui/button';

/** Persistent actions remain available after the transient error toast expires. */
export function LoadRecovery({
  onRetry,
  pending = false,
  children,
}: {
  onRetry: () => void;
  pending?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      aria-label="Recuperar carregamento"
      aria-busy={pending}
      className="flex min-h-[356px] flex-col items-center justify-center gap-4 px-5 py-12 text-center"
    >
      <p role="status" className="text-sm text-text-secondary">
        {pending ? 'Carregando…' : 'Carregamento interrompido.'}
      </p>
      <Button variant="outline" onClick={onRetry} disabled={pending}>
        Tentar novamente
      </Button>
      {children}
    </section>
  );
}
