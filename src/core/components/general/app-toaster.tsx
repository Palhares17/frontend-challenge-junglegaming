import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { CircleAlert } from 'lucide-react';

export function AppToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    // Keep a live region mounted before a modal opens so its alerts stay accessible.
    <div aria-live="polite" aria-atomic="false">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--kurio-border-soft)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            maxWidth: 'min(420px, calc(100vw - 32px))',
          },
          error: {
            icon: (
              <CircleAlert
                size={20}
                className="shrink-0 text-destructive"
                aria-hidden="true"
              />
            ),
          },
        }}
      />
    </div>,
    document.body,
  );
}
