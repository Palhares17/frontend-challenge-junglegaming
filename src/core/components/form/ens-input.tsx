import { useId } from 'react';
import { Input } from '@/core/components/ui/input';
import { FormField } from './form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';

export function EnsInput({ required = true, defaultValue }: { required?: boolean; defaultValue?: string }) {
  const id = useId();
  return (
    <FormField id={id} label="Nome ENS" required={required}>
      <div className="flex min-w-0 gap-2.5">
        <Select defaultValue="eth" items={[{ value: 'eth', label: '.eth' }]}>
          <SelectTrigger
            aria-label="Sufixo ENS"
            className="visual-input w-[78px] shrink-0 data-[size=default]:h-10"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eth">.eth</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id={id}
          name="ens"
          defaultValue={defaultValue}
          required={required}
          className="visual-input"
          autoComplete="off"
        />
      </div>
    </FormField>
  );
}
