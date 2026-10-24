import { createFileRoute } from '@tanstack/react-router';
import { ProfileRoutePage } from '@/feature/profile/views/profile-route.page';
export const Route = createFileRoute('/_authenticated/account/profile')({
  component: ProfileRoutePage,
});
