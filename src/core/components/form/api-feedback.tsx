import { useEffect, useId, useRef } from 'react';
import { apiError } from '@/core/services/api/feedback';
/** Associate server validation with existing named controls, including native selects. */
export function ApiFeedback({ error }: { error: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const failure = error ? apiError(error) : null;
  const fields = failure?.fields;
  useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form || !fields) return;
    const controls: HTMLElement[] = [];
    for (const name of Object.keys(fields)) {
      const control = form.elements.namedItem(name);
      if (control instanceof HTMLElement) {
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-describedby', id);
        controls.push(control);
      }
    }
    controls[0]?.focus();
    return () =>
      controls.forEach((control) => {
        control.removeAttribute('aria-invalid');
        control.removeAttribute('aria-describedby');
      });
  }, [fields, id]);
  return (
    <div ref={ref} id={id}>
      {failure && (
        <div role="alert" className="my-4 space-y-2 text-sm text-destructive">
          <p>{failure.message}</p>
          {fields &&
            Object.entries(fields).map(([name, message]) => (
              <p key={name}>{message}</p>
            ))}
        </div>
      )}
    </div>
  );
}
