import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isPending = false,
  onOpenChange,
  onConfirm,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="dialog-content">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <Dialog.Title className="text-lg font-bold tracking-tight">{title}</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button type="button" className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted" aria-label="Close dialog">
              <X size={18} />
            </button>
          </Dialog.Close>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button type="button" variant="cancel" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Please wait...' : confirmLabel}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
