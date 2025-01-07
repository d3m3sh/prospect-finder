'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "./row-selection";

interface RowCheckboxProps {
  id: string;
}

export function RowCheckbox({ id }: RowCheckboxProps) {
  const { selectedRows, toggleRow } = useSelection();
  
  return (
    <Checkbox
      checked={selectedRows.has(id)}
      onCheckedChange={() => toggleRow(id)}
      aria-label="Select row"
    />
  );
}