import { createFileRoute } from '@tanstack/react-router';
import { WalletsRoutePage } from '@/feature/wallets/views/wallets-route.page';
export const Route = createFileRoute('/_authenticated/account/wallets')({
  component: WalletsRoutePage,
});
