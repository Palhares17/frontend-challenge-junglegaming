import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import type { Network, Wallet } from '@/core/entities/marketplace.entity';
import { useProductNavigation } from '@/core/router/navigation';
import { sessionOptions } from '@/core/session/session';
import { formValues } from '@/core/services/api/feedback';
import { ApiFeedback } from '@/core/components/form/api-feedback';
import { LabeledInput } from '@/core/components/form/labeled-input';
import { Button } from '@/core/components/ui/button';
import { walletsOptions, saveWallet } from '../services/wallets.service';
import { WalletsPage } from './wallets.page';
const route = getRouteApi('/_authenticated/account/wallets');
export function WalletsRoutePage() {
  const { user } = route.useRouteContext();
  const client = useQueryClient();
  const navigation = useProductNavigation()!;
  const { data } = useSuspenseQuery(walletsOptions(user.id));
  const [editing, setEditing] = useState<Wallet | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const sessionId = client.getQueryData(sessionOptions.queryKey)?.sessionId;
  const mutation = useMutation({
    mutationFn: saveWallet,
    onSuccess: async () => {
      if (client.getQueryData(sessionOptions.queryKey)?.sessionId !== sessionId)
        return;
      await client.invalidateQueries({
        queryKey: walletsOptions(user.id).queryKey,
      });
      await client.invalidateQueries({
        queryKey: ['private', user.id, 'checkout'],
      });
      setEditing(null);
      setFormVersion((value) => value + 1);
      toast.success('Carteira salva.');
    },
  });
  function edit(wallet: Wallet | null) {
    setEditing(wallet);
    setFormVersion((value) => value + 1);
    mutation.reset();
  }
  return (
    <WalletsPage
      onAction={navigation.onAction}
      onSubmit={(event) => event.preventDefault()}
    >
      <h1 className="account-heading mb-6">Carteiras</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Cadastre até duas carteiras para receber seus NFTs. A conexão é simulada
        no pagamento.
      </p>
      <ul className="mb-8 space-y-4">
        {data.items.map((wallet) => (
          <li
            key={wallet.id}
            className="rounded-input border border-border p-4 text-sm break-all"
          >
            <h2 className="font-bold">
              {wallet.primary ? 'Carteira principal' : 'Carteira secundária'} ·{' '}
              {wallet.label}
            </h2>
            <p>{wallet.address}</p>
            <p>{wallet.network}</p>
            <button
              type="button"
              className="mt-3 text-text-accent underline"
              onClick={() => edit(wallet)}
            >
              Editar {wallet.label}
            </button>
          </li>
        ))}
      </ul>
      {!editing && data.items.length >= 2 ? (
        <p role="status">
          Duas carteiras cadastradas. Selecione Editar para alterar.
        </p>
      ) : (
        <form
          key={formVersion}
          onSubmit={(event) => {
            event.preventDefault();
            if (mutation.isPending) return;
            const input = formValues(event.currentTarget);
            mutation.mutate({
              id: editing?.id,
              label: input.label,
              address: input.address,
              network: input.network as Network,
              primary: input.primary === 'on',
            });
          }}
        >
          <fieldset disabled={mutation.isPending} className="min-w-0">
            <h2 className="account-heading mb-6">
              {editing
                ? 'Editar carteira'
                : data.items.length
                  ? 'Carteira secundária'
                  : 'Carteira principal'}
            </h2>
            <div className="form-grid">
              <LabeledInput
                label="Apelido da carteira"
                name="label"
                defaultValue={editing?.label}
                maxLength={80}
                required
              />
              <LabeledInput
                label="Endereço da carteira"
                name="address"
                defaultValue={editing?.address}
                required
              />
              <label className="form-field">
                <span className="form-label">Rede</span>
                <select
                  name="network"
                  aria-label="Rede"
                  className="visual-input w-full"
                  defaultValue={editing?.network ?? 'ethereum'}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="solana">Solana</option>
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="primary"
                  defaultChecked={editing?.primary ?? !data.items.length}
                />
                Usar como principal
              </label>
            </div>
            <ApiFeedback error={mutation.error} />
            <Button className="mt-8 px-6" type="submit">
              Salvar carteira
            </Button>
            {editing && (
              <button
                type="button"
                className="ml-6 text-text-accent underline"
                onClick={() => edit(null)}
              >
                Cancelar edição
              </button>
            )}
          </fieldset>
        </form>
      )}
    </WalletsPage>
  );
}
