'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface SelectionContextType {
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: (totalItems: number) => void;
  isSelected: (id: string) => boolean;
  isAllSelected: () => boolean;
  isPartiallySelected: () => boolean;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((totalItems: number) => {
    setSelectedRows(prev => {
      if (prev.size === totalItems) {
        return new Set();
      }
      return new Set(Array.from({ length: totalItems }, (_, i) => i.toString()));
    });
  }, []);

  const isSelected = useCallback((id: string) => selectedRows.has(id), [selectedRows]);
  
  const isAllSelected = useCallback(() => selectedRows.size > 0, [selectedRows]);
  
  const isPartiallySelected = useCallback(() => selectedRows.size > 0, [selectedRows]);
  
  const clearSelection = useCallback(() => setSelectedRows(new Set()), []);

  return (
    <SelectionContext.Provider value={{
      selectedRows,
      toggleRow,
      toggleAll,
      isSelected,
      isAllSelected,
      isPartiallySelected,
      clearSelection
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}