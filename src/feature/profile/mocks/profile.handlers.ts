import { http, HttpResponse } from 'msw';
import { changePassword, requireUser, updateAvatar, updateProfile } from '@/core/mocks/accounts';
import { readDatabase, transaction } from '@/core/mocks/database';
import { mockResolver } from '@/core/mocks/http';

export const profileHandlers = [
  http.get('*/api/profile', mockResolver(() => HttpResponse.json(readDatabase().accounts[requireUser()].profile))),
  http.patch('*/api/profile', mockResolver(async ({ request }) => {
    const owner = requireUser();
    const input = await request.json();
    return HttpResponse.json(transaction((db) => updateProfile(db, owner, input)));
  }, 'mutation')),
  http.put('*/api/profile/avatar', mockResolver(async ({ request }) => {
    const owner = requireUser();
    const input = await request.json();
    return HttpResponse.json(transaction((db) => updateAvatar(db, owner, input)));
  }, 'mutation')),
  http.put('*/api/profile/password', mockResolver(async ({ request }) => {
    const owner = requireUser();
    await changePassword(owner, await request.json());
    return new HttpResponse(null, { status: 204 });
  }, 'mutation')),
];
