'use client';

import { MapPin } from 'lucide-react';
import { Button } from './button';

interface MapsLinkProps {
  name: string;
  address: string;
  mapsUrl?: string;
}

export function MapsLink({ name, address, mapsUrl }: MapsLinkProps) {
  const getGoogleMapsUrl = () => {
    if (mapsUrl) return mapsUrl;
    const query = encodeURIComponent(`${name} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
      asChild
    >
      <a
        href={getGoogleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        title={`View ${name} on Google Maps`}
      >
        <MapPin className="h-4 w-4" />
      </a>
    </Button>
  );
}