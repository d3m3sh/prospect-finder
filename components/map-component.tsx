'use client';

import { useEffect, useRef } from 'react';
import { Business } from '@/types/business';
import { Loader } from '@googlemaps/js-api-loader';

type MapComponentProps = {
  results: Business[];
};

export function MapComponent({ results }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      });

      const google = await loader.load();
      
      if (mapRef.current && !googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 42.693842, lng: 2.8942662 }, // Default to Perpignan
          zoom: 12,
        });
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (results.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      results.forEach((result) => {
        if (result.location) {
          const marker = new google.maps.Marker({
            position: result.location,
            map: googleMapRef.current,
            title: result.name,
          });

          bounds.extend(result.location);
          markersRef.current.push(marker);
        }
      });

      googleMapRef.current.fitBounds(bounds);
    }
  }, [results]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}