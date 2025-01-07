'use client';

import { useState } from 'react';
import { Button } from './button';
import { Trash2 } from 'lucide-react';
import { DeleteDialog } from './delete-dialog';

interface DeleteButtonProps {
  onDelete: () => void;
  itemName: string;
}

export function DeleteButton({ onDelete, itemName }: DeleteButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setShowDialog(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          onDelete();
          setShowDialog(false);
        }}
        itemName={itemName}
      />
    </>
  );
}