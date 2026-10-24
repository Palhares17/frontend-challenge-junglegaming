import { useId } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { FormField } from './form-field';

interface SelectFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  items: readonly { value: string; label: string }[];
  defaultValue?: string;
}

export function SelectField({
  label,
  name,
  placeholder,
  required,
  items,
  defaultValue,
}: SelectFieldProps) {
  const id = useId();
  return (
    <FormField id={id} label={label} required={required}>
      <Select
        name={name}
        items={[...items]}
        defaultValue={defaultValue}
        required={required}
      >
        <SelectTrigger
          id={id}
          className="visual-input w-full text-sm data-[size=default]:h-10"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
