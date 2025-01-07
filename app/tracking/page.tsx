'use client';

import { useState, useEffect } from 'react';
import { Prospect } from '@/types/prospect';
import { getStoredProspects, saveProspects, mergeProspects } from '@/lib/storage';
import { ProspectTable } from '@/components/prospect-table';
import { ImportControls } from '@/components/import-controls';
import { Card } from '@/components/ui/card';

export default function TrackingPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    const stored = getStoredProspects();
    setProspects(stored.prospects);
  }, []);

  const handleImport = (data: any[]) => {
    const updated = mergeProspects(prospects, data);
    setProspects(updated);
    saveProspects(updated);
  };

  const handleProspectUpdate = (updated: Prospect) => {
    const newProspects = prospects.map((p) =>
      p.name === updated.name && p.address === updated.address ? updated : p
    );
    setProspects(newProspects);
    saveProspects(newProspects);
  };

  const handleProspectDelete = (deleted: Prospect) => {
    const newProspects = prospects.filter(
      (p) => !(p.name === deleted.name && p.address === deleted.address)
    );
    setProspects(newProspects);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8">Prospect Tracking</h1>
      
      <Card className="p-6">
        <ImportControls onImport={handleImport} prospects={prospects} />
      </Card>
      
      <Card className="p-6">
        <ProspectTable
          prospects={prospects}
          onProspectUpdate={handleProspectUpdate}
          onProspectDelete={handleProspectDelete}
        />
      </Card>
    </div>
  );
}