import { redirect } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import type { QueryClient } from '@tanstack/react-query';
import { clearPrivateCache, sessionOptions } from '@/core/session/session';
import { safeRedirect } from './redirect';

export async function requireSession(queryClient: QueryClient, href: string) {
  const session = await queryClient.query(sessionOptions);
  if (!session.user) {
    await clearPrivateCache(queryClient);
    throw redirect({ to: '/login', search: { redirect: safeRedirect(href) } });
  }
  return { user: session.user };
}

export async function privateRequest<T>(
  request: Promise<T>,
  queryClient: QueryClient,
  href: string,
): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      queryClient.setQueryData(sessionOptions.queryKey, { user: null });
      await clearPrivateCache(queryClient);
      throw redirect({
        to: '/login',
        search: { redirect: safeRedirect(href) },
      });
    }
    throw error;
  }
}
