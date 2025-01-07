'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { RowCheckbox } from '@/components/ui/row-checkbox';
import { cn } from '@/lib/utils';

interface TableRowProps {
  id: string;
  children: React.ReactNode;
  status?: string;
}

export function SelectableTableRow({ id, children, status }: TableRowProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 hover:bg-green-100';
      case 'Refused':
        return 'bg-red-50 hover:bg-red-100';
      default:
        return 'hover:bg-gray-50';
    }
  };

  return (
    <TableRow className={cn(getStatusColor(status))}>
      <TableCell >
        <RowCheckbox id={id} />
      </TableCell>
      {children}
    </TableRow>
  );
}