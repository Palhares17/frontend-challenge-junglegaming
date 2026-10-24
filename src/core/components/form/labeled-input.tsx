import { useId, type ComponentProps } from 'react';
import { Input } from '@/core/components/ui/input';
import { FormField } from './form-field';
import { PasswordInput } from './password-input';
import type { VisualAsset } from '@/core/lib/figma-assets';

interface LabeledInputProps extends ComponentProps<typeof Input> {
  label: string;
  error?: string;
  hiddenLabel?: boolean;
  fieldClassName?: string;
  passwordIcon?: VisualAsset;
}

export function LabeledInput({
  label,
  error,
  hiddenLabel,
  fieldClassName,
  passwordIcon,
  id: suppliedId,
  type,
  required,
  ...props
}: LabeledInputProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const control = {
    ...props,
    id,
    required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
  };
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      hiddenLabel={hiddenLabel}
      className={fieldClassName}
    >
      {type === 'password' ? (
        <PasswordInput {...control} icon={passwordIcon} />
      ) : (
        <Input {...control} type={type} />
      )}
    </FormField>
  );
}
