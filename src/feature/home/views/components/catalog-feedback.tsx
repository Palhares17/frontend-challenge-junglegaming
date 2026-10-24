import { Button } from '@/core/components/ui/button';

export function CatalogFeedback({
  error,
  onRetry,
}: {
  error?: boolean;
  onRetry: () => void;
}) {
  return (
    <div
      role={error ? 'alert' : 'status'}
      className="flex min-h-[356px] flex-col items-center justify-center gap-4 rounded-promo border border-border bg-card px-5 py-12 text-center"
    >
      <h3 className="text-lg font-bold">
        {error ? 'Não foi possível carregar os NFTs' : 'Nenhum NFT encontrado'}
      </h3>
      <p className="max-w-sm text-text-secondary">
        {error
          ? 'Tente novamente para continuar explorando.'
          : 'Experimente outro nome ou ajuste os filtros da sua busca.'}
      </p>
      <Button variant="outline" onClick={onRetry}>
        {error ? 'Tentar novamente' : 'Limpar busca e filtros'}
      </Button>
    </div>
  );
}
