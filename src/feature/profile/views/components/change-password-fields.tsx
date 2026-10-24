import { LabeledInput } from '@/core/components/form/labeled-input';

export function ChangePasswordFields() {
  return (
    <fieldset className="change-password-fields mt-8 max-w-[417px] space-y-6">
      <legend className="mb-6 text-base leading-4">Alterar senha</legend>
      <LabeledInput
        label="Senha atual"
        name="currentPassword"
        autoComplete="current-password"
        type="password"
      />
      <LabeledInput
        label="Nova senha"
        name="newPassword"
        autoComplete="new-password"
        type="password"
      />
      <LabeledInput
        label="Confirmar nova senha"
        name="confirmPassword"
        autoComplete="new-password"
        type="password"
      />
    </fieldset>
  );
}
