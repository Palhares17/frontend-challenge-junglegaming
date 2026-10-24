import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UnavailableProvider } from '@/core/providers/unavailable-provider';
import { DesignPreview } from './design-preview';
import '@/index.css';

if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
  const { worker } = await import('@/core/mocks/browser');
  await worker.start({ quiet: true, onUnhandledFrame: 'bypass' });
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnavailableProvider>
      <DesignPreview />
    </UnavailableProvider>
  </StrictMode>,
);
