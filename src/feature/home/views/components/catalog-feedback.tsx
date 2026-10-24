import { Button } from '@/core/components/ui/button';

export function CatalogFeedback({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div
      role="status"
      className="flex min-h-[356px] flex-col items-center justify-center gap-4 rounded-promo border border-border bg-card px-5 py-12 text-center"
    >
      <h3 className="text-lg font-bold">
        Nenhum NFT encontrado
      </h3>
      <p className="max-w-sm text-text-secondary">
        Experimente outro nome ou ajuste os filtros da sua busca.
      </p>
      <Button variant="outline" onClick={onRetry}>
        Limpar busca e filtros
      </Button>
    </div>
  );
}
