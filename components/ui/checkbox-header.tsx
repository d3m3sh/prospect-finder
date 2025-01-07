'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "./row-selection";

interface CheckboxHeaderProps {
  totalItems: number;
}

export function CheckboxHeader({ totalItems }: CheckboxHeaderProps) {
  const { selectedRows, toggleAll } = useSelection();
  
  const isAllSelected = selectedRows.size === totalItems && totalItems > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < totalItems;
  
  return (
    <Checkbox
      checked={isAllSelected}
      onCheckedChange={() => toggleAll(totalItems)}
      aria-label="Select all"
      {...(isIndeterminate ? { "data-state": "indeterminate" } : {})}
    />
  );
}