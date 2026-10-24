import { createContext, useContext } from 'react';

export const UnavailableContext = createContext<
  ((feature: string) => void) | null
>(null);

export function useUnavailable() {
  const notify = useContext(UnavailableContext);
  if (!notify) throw new Error('UnavailableProvider is required');
  return notify;
}
