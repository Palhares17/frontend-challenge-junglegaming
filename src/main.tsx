import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from '@/core/app';
import './index.css';
import { setApiReadiness } from '@/core/services/api/readiness';

const networkReady =
  import.meta.env.VITE_ENABLE_MOCKS !== 'false'
    ? import('@/core/mocks/browser').then(({ worker }) =>
        worker.start({ quiet: true, onUnhandledFrame: 'bypass' }),
      )
    : Promise.resolve();
setApiReadiness(networkReady);
// Query surfaces bootstrap failures through its normal retry/error UI.
void networkReady.catch(() => {});

const root = document.getElementById('root')!;
const matchingPath =
  root.dataset.prerenderPath === location.pathname.replace(/\/$/, '') ||
  (root.dataset.prerenderPath === '/' && location.pathname === '/');
const prerendered =
  matchingPath &&
  (!location.search || location.search === root.dataset.prerenderSearch);
const app = (
  <StrictMode>
    <App hydrating={prerendered} />
  </StrictMode>
);
if (prerendered) hydrateRoot(root, app);
else createRoot(root).render(app);
