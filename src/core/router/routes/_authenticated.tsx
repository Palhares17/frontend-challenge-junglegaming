import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireSession } from '../require-session';
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) =>
    requireSession(context.queryClient, location.href),
  component: Outlet,
});
