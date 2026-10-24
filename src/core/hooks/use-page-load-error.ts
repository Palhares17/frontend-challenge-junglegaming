import { useEffect } from 'react';
import toast from 'react-hot-toast';

/** Keep route/query failures in the existing accessible toaster, never in render. */
export function usePageLoadError(error: unknown, id: string) {
  useEffect(() => {
    if (!error) return;
    toast.error('Não foi possível carregar a página. Tente novamente.', {
      id,
      ariaProps: { role: 'alert', 'aria-live': 'assertive' },
    });
    return () => toast.remove(id);
  }, [error, id]);
}
