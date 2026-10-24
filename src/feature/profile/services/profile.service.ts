import { queryOptions } from '@tanstack/react-query';
import type { CollectorProfile } from '@/core/entities/marketplace.entity';
import { api } from '@/core/services/api/api';
export const profileOptions = (userId: string) =>
  queryOptions({
    queryKey: ['private', userId, 'profile'],
    queryFn: async ({ signal }) =>
      (await api.get<CollectorProfile>('/profile', { signal })).data,
  });
export const saveProfile = async (input: Record<string, string>) =>
  (await api.patch<CollectorProfile>('/profile', input)).data;
export const saveAvatar = async (avatar: string | null) =>
  (await api.put<CollectorProfile>('/profile/avatar', { avatar })).data;
export const savePassword = async (input: Record<string, string>) => {
  await api.put('/profile/password', input);
};
