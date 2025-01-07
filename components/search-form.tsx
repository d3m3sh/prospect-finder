'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Search } from 'lucide-react';

const searchSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  radius: z.number().min(1).max(50),
  keywords: z.string().min(1, 'Keywords are required'),
});

type SearchFormProps = {
  onSearch: (data: z.infer<typeof searchSchema>) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      address: '',
      radius: 5,
      keywords: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter location..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Radius (km)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., doctors, lawyers..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
    </Form>
  );
}