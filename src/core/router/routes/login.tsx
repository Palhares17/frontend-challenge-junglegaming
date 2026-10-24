import { createFileRoute } from '@tanstack/react-router';
import { AuthRoutePage } from '@/feature/auth/views/auth-route.page';
import { safeRedirect } from '../redirect';
export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({ redirect: safeRedirect(search.redirect) }),
  component: Page,
});
function Page() {
  return <AuthRoutePage mode="login" redirectTo={Route.useSearch().redirect} />;
}
