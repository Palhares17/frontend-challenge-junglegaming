import { useState, type ReactNode } from 'react';
import { UnavailableContext } from '@/core/hooks/use-unavailable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';

export function UnavailableProvider({ children }: { children: ReactNode }) {
  const [feature, setFeature] = useState<string | null>(null);
  return (
    <UnavailableContext.Provider value={setFeature}>
      {children}
      <Dialog
        open={feature !== null}
        onOpenChange={(open) => {
          if (!open) setFeature(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feature}</DialogTitle>
            <DialogDescription>
              Este recurso ainda não está disponível nesta versão.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="mt-2 justify-self-start"
            onClick={() => setFeature(null)}
          >
            Entendi
          </Button>
        </DialogContent>
      </Dialog>
    </UnavailableContext.Provider>
  );
}
