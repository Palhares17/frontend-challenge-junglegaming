import { createFileRoute } from '@tanstack/react-router';
import { AuthRoutePage } from '@/feature/auth/views/auth-route.page';
import { safeRedirect } from '../redirect';
export const Route = createFileRoute('/register')({
  validateSearch: (search) => ({ redirect: safeRedirect(search.redirect) }),
  component: Page,
});
function Page() {
  return (
    <AuthRoutePage mode="register" redirectTo={Route.useSearch().redirect} />
  );
}
