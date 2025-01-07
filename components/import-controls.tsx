'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download } from 'lucide-react';
import { Prospect } from '@/types/prospect';

interface ImportControlsProps {
  prospects: Prospect[];
  onImport: (data: any[]) => void;
}

export function ImportControls({ prospects, onImport }: ImportControlsProps) {
  const [importing, setImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      let data: any[];

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          return headers.reduce((obj, header, i) => {
            obj[header.toLowerCase()] = values[i];
            return obj;
          }, {} as any);
        });
      } else {
        throw new Error('Unsupported file format');
      }

      onImport(data);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing file. Please check the format.');
    } finally {
      setImporting(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    let content: string;
    let type: string;
    let extension: string;

    if (format === 'json') {
      content = JSON.stringify(prospects, null, 2);
      type = 'application/json';
      extension = 'json';
    } else {
      const headers = ['name', 'address', 'phoneNumber', 'website', 'status', 'comments', 'notes', 'lastUpdated'];
      const csvContent = [
        headers.join(','),
        ...prospects.map(p => headers.map(h => `"${(p as any)[h] || ''}"`).join(','))
      ].join('\n');
      
      content = csvContent;
      type = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prospects.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          disabled={importing}
          className="max-w-xs"
        />
        <Button onClick={() => exportData('json')} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
        <Button onClick={() => exportData('csv')} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}