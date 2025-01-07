'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SearchForm } from '@/components/search-form';
import { ResultsTable } from '@/components/results-table';
import { MapComponent } from '@/components/map-component';
import { Business } from '@/types/business';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Business[]>([]);

  const handleSearch = async (searchParams: {
    address: string;
    radius: number;
    keywords: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8">Business Prospect Finder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SearchForm onSearch={handleSearch} />
        </Card>
        
        <Card className="p-6 h-[400px]">
          <MapComponent results={results} />
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        results.length > 0 && <ResultsTable results={results} />
      )}
    </div>
  );
}