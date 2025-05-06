import { useState } from "react";
import { Button } from "./button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./alert-dialog";

interface ConfirmProps {
  onClose: () => void;
  onConfirm: (() => void) | undefined;
}

export default function Confirm({ onClose, onConfirm }: ConfirmProps) {
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onConfirm != null) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AlertDialog open={!!onConfirm} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <p>Are you sure?</p>
        <Button onClick={handleConfirm}>Yes</Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
