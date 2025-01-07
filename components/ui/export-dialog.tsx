'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ExportDialogProps {
  onExport: (config: { filename: string; selectedOnly: boolean; format: 'csv' | 'json' }) => void;
  hasSelection: boolean;
}

export function ExportDialog({ onExport, hasSelection }: ExportDialogProps) {
  const [filename, setFilename] = useState('export');
  const [selectedOnly, setSelectedOnly] = useState<boolean>(hasSelection);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    setSelectedOnly(hasSelection)
  }, [hasSelection])
 
  const handleExport = (format: 'csv' | 'json') => {
    onExport({ filename, selectedOnly, format });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Export Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Filename</label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename..."
            />
          </div>
          {hasSelection && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectedOnly"
                checked={selectedOnly}
                onCheckedChange={(checked) => {console.log(checked); setSelectedOnly(checked as boolean)}}
              />
              <label htmlFor="selectedOnly">Export selected rows only</label>
            </div>
          )}
          <div className="flex space-x-2">
            <Button onClick={() => handleExport('json')}>Export JSON</Button>
            <Button onClick={() => handleExport('csv')}>Export CSV</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}