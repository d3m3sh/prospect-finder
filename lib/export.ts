import { Business } from '@/types/business';
import { Prospect } from '@/types/prospect';

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: (Business | Prospect)[], filename: string) {
  const headers = ['name', 'address', 'phoneNumber', 'website', 'reviews', 'rating', 'searchKeyword'];
  if ('status' in data[0]) {
    headers.push('status', 'comments', 'notes', 'lastUpdated');
  }

  const csvContent = [
    headers.join(','),
    ...data.map(item => 
      headers.map(h => `"${(item as any)[h] || ''}""`).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(data: (Business | Prospect)[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}