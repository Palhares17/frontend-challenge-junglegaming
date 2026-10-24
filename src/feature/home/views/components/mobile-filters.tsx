import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/ui/dialog';
import { IconButton } from '@/core/components/general/icon-button';
import { CatalogFilters, type CatalogFiltersProps } from './catalog-filters';
import { CatalogSort } from './catalog-sort';

export function MobileFilters(props: CatalogFiltersProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <IconButton
            icon="filter"
            label="Abrir filtros"
            className="filter-trigger size-[45px] rounded-[14px]"
          />
        }
      />
      <DialogContent className="top-0 right-0 left-auto h-dvh max-h-dvh w-full max-w-[390px] translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none p-0 sm:max-w-[390px]">
        <DialogHeader className="px-5 pt-7 pb-5">
          <DialogTitle>Filtrar NFTs</DialogTitle>
          <DialogDescription>
            Combine coleções, rede e faixa de preço.
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 pb-5">
          <CatalogSort search={props.search} onChange={props.onChange} />
        </div>
        <CatalogFilters {...props} onApply={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
