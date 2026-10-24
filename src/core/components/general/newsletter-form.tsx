import { useUnavailable } from '@/core/hooks/use-unavailable';
import { Input } from '@/core/components/ui/input';
import { Button } from '@/core/components/ui/button';

export function NewsletterForm() {
  const notify = useUnavailable();
  return (
    <section aria-labelledby="newsletter-heading" className="min-w-0">
      <h2 id="newsletter-heading" className="text-lg leading-5 font-bold">
        Antecipe-se ao próximo lançamento
      </h2>
      <form
        className="mt-4 flex rounded-button bg-surface-dark shadow-newsletter"
        onSubmit={(event) => {
          event.preventDefault();
          notify('Alertas de lançamentos');
        }}
      >
        <Input
          aria-label="Seu e-mail para novidades"
          type="email"
          required
          placeholder="digite seu e-mail..."
          className="h-10 min-w-0 border-0 bg-transparent pl-3 text-sm placeholder:text-text-subtle dark:bg-transparent"
        />
        <Button
          type="submit"
          className="h-auto self-stretch rounded-l-none px-3 text-base"
        >
          Enviar
        </Button>
      </form>
      <p className="mt-3 text-[13px] leading-[22px] text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do
        mercado.
      </p>
    </section>
  );
}
