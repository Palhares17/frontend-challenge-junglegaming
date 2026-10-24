import { LabeledInput } from './labeled-input';
import { SelectField } from './select-field';
import { EnsInput } from './ens-input';

const networks = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'solana', label: 'Solana' },
];
const walletTypes = [
  { value: 'metamask', label: 'MetaMask' },
  { value: 'walletconnect', label: 'WalletConnect' },
  { value: 'coinbase', label: 'Coinbase Wallet' },
];

export function CollectorFields({ wallet = false }: { wallet?: boolean }) {
  return (
    <div className="form-grid collector-fields">
      <LabeledInput
        label="Nome de exibição"
        name="displayName"
        autoComplete="nickname"
        required
      />
      <LabeledInput
        label={wallet ? 'Apelido da carteira' : 'Nome de usuário'}
        name={wallet ? 'walletAlias' : 'username'}
        autoComplete={wallet ? 'off' : 'username'}
        required
      />
      <SelectField
        label="Rede"
        name="network"
        required
        placeholder="Selecione uma rede"
        items={networks}
      />
      <LabeledInput
        label="Nome do perfil"
        name="profileName"
        autoComplete="off"
        required
      />
      <LabeledInput
        label="Endereço da carteira"
        name="address"
        autoComplete="off"
        placeholder="Endereço 0x da carteira"
        required
      />
      <LabeledInput
        label="Carteira secundária"
        name="secondaryAddress"
        hiddenLabel
        fieldClassName="secondary-address-field"
        placeholder="ENS ou carteira secundária (opcional)"
        autoComplete="off"
      />
      <SelectField
        label="Tipo de carteira"
        name="walletType"
        required
        placeholder="Selecione uma carteira"
        items={walletTypes}
      />
      <LabeledInput
        label="Código de indicação"
        name="referralCode"
        autoComplete="off"
        required
      />
      <LabeledInput
        label="E-mail"
        name="email"
        autoComplete="email"
        type="email"
        required
      />
      <EnsInput />
    </div>
  );
}
