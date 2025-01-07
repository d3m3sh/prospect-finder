import { Prospect, ProspectStore } from '@/types/prospect';
import { Business } from '@/types/business';

const STORAGE_KEY = 'prospect-store';

export function getStoredProspects(): ProspectStore {
  if (typeof window === 'undefined') return { prospects: [], lastUpdated: '' };
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { prospects: [], lastUpdated: '' };
}

export function saveProspects(prospects: Prospect[]): void {
  const store: ProspectStore = {
    prospects,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function deleteProspect(prospect: Prospect): void {
  const { prospects } = getStoredProspects();
  const updatedProspects = prospects.filter(
    p => !(p.name === prospect.name && p.address === prospect.address)
  );
  saveProspects(updatedProspects);
}

export function mergeProspects(existing: Prospect[], newData: (Business | Prospect)[]): Prospect[] {
  const merged = [...existing];
  
  newData.forEach((item) => {
    const existingIndex = merged.findIndex(
      (e) => e.name === item.name && e.address === item.address
    );
    
    if (existingIndex === -1) {
      merged.push({
        ...item,
        status: 'No Call' as const,
        comments: '',
        notes: '',
        lastUpdated: new Date().toISOString(),
        ...(('status' in item) ? item : {}),
      });
    }
  });
  
  return merged;
}