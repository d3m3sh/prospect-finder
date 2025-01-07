'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SelectableTableRow } from '@/components/table-row';
import { SelectionProvider, useSelection } from '@/components/ui/row-selection';
import { ExportDialog } from '@/components/ui/export-dialog';
import { CheckboxHeader } from '@/components/ui/checkbox-header';
import { DeleteButton } from '@/components/ui/delete-button';
import { MapsLink } from '@/components/ui/maps-link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Prospect, ContactStatus } from '@/types/prospect';
import { exportToCSV, exportToJSON } from '@/lib/export';
import { deleteProspect } from '@/lib/storage';

interface ProspectTableContentProps {
  prospects: Prospect[];
  onProspectUpdate: (prospect: Prospect) => void;
  onProspectDelete: (prospect: Prospect) => void;
}

function ProspectTableContent({ prospects, onProspectUpdate, onProspectDelete }: ProspectTableContentProps) {
  const { selectedRows, clearSelection } = useSelection();

  const handleExport = ({ filename, selectedOnly, format }: { 
    filename: string; 
    selectedOnly: boolean; 
    format: 'csv' | 'json' 
  }) => {
    const dataToExport = selectedOnly 
      ? prospects.filter((_, index) => selectedRows.has(index.toString()))
      : prospects;
    if (format === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      exportToJSON(dataToExport, filename);
    }
  };

  const handleStatusChange = (value: ContactStatus, prospect: Prospect) => {
    onProspectUpdate({
      ...prospect,
      status: value,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleNotesChange = (
    field: 'comments' | 'notes',
    value: string,
    prospect: Prospect
  ) => {
    onProspectUpdate({
      ...prospect,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDelete = (prospect: Prospect, index: number) => {
    clearSelection()
    deleteProspect(prospect);
    onProspectDelete(prospect);
    
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Prospects</h2>
        <ExportDialog onExport={handleExport} hasSelection={selectedRows.size > 0} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <CheckboxHeader totalItems={prospects.length} />
              </TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Call Comments</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.map((prospect, index) => (
              <SelectableTableRow
                key={`${prospect.name}-${prospect.address}-${index}`}
                id={index.toString()}
                status={prospect.status}
              >
                <TableCell className="font-medium">{prospect.name}</TableCell>
                <TableCell>
                  <MapsLink
                    name={prospect.name}
                    address={prospect.address}
                    mapsUrl={prospect.mapsUrl}
                  />
                </TableCell>
                <TableCell>{prospect.address}</TableCell>
                <TableCell>{prospect.phoneNumber}</TableCell>
                <TableCell>
                  {prospect.website && (
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      website
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={prospect.status}
                    onValueChange={(value: ContactStatus) =>
                      handleStatusChange(value, prospect)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No Call">No Call</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Refused">Refused</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <Textarea
                    value={prospect.comments}
                    onChange={(e) =>
                      handleNotesChange('comments', e.target.value, prospect)
                    }
                    placeholder="Add call comments..."
                    className="min-h-[100px] resize-y"
                  />
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <Textarea
                    value={prospect.notes}
                    onChange={(e) =>
                      handleNotesChange('notes', e.target.value, prospect)
                    }
                    placeholder="Add notes..."
                    className="min-h-[100px] resize-y"
                  />
                </TableCell>
                <TableCell>
                  <DeleteButton
                    onDelete={() => handleDelete(prospect, index)}
                    itemName={prospect.name}
                  />
                </TableCell>
              </SelectableTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ProspectTable(props: ProspectTableContentProps) {
  return (
    <SelectionProvider>
      <ProspectTableContent {...props} />
    </SelectionProvider>
  );
}