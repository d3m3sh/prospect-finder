'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SelectableTableRow } from '@/components/table-row';
import { SelectionProvider, useSelection } from '@/components/ui/row-selection';
import { ExportDialog } from '@/components/ui/export-dialog';
import { MapsLink } from '@/components/ui/maps-link';
import { Business } from '@/types/business';
import { exportToCSV, exportToJSON } from '@/lib/export';

function ResultsTableContent({ results }: { results: Business[] }) {
  const { selectedRows } = useSelection();
  
  const handleExport = ({ filename, selectedOnly, format }: { 
    filename: string; 
    selectedOnly: boolean; 
    format: 'csv' | 'json' 
  }) => {
    const dataToExport = selectedOnly 
      ? results.filter((_, index) => selectedRows.has(index.toString()))
      : results;
    if (format === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      exportToJSON(dataToExport, filename);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Search Results</h2>
        <ExportDialog onExport={handleExport} hasSelection={selectedRows.size > 0} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Selection</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <SelectableTableRow 
                key={`${result.name}-${index}`}
                id={index.toString()}
              >
                <TableCell className="font-medium">{result.name}</TableCell>
                <TableCell>
                  <MapsLink
                    name={result.name}
                    address={result.address}
                    mapsUrl={result.mapsUrl}
                  />
                </TableCell>
                <TableCell>{result.address}</TableCell>
                <TableCell>{result.phoneNumber}</TableCell>
                <TableCell>
                  {result.website && (
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      website
                    </a>
                  )}
                </TableCell>
                <TableCell>{result.reviews || 'N/A'}</TableCell>
                <TableCell>{result.rating ? `${result.rating}/5` : 'N/A'}</TableCell>
              </SelectableTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ResultsTable({ results }: { results: Business[] }) {
  return (
    <SelectionProvider>
      <ResultsTableContent results={results} />
    </SelectionProvider>
  );
}