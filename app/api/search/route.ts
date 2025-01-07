import { NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function POST(request: Request) {
  console.log("g", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  try {
    const { address, radius, keywords } = await request.json();
    const geocodeResponse = await client.geocode({
      params: {
        address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    });

    if (!geocodeResponse.data.results[0]) {
      return NextResponse.json({ error: 'Address not found' }, { status: 400 });
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    const placesResponse = await client.placesNearby({
      params: {
        location,
        radius: radius * 1000,
        keyword: keywords,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    });

    const results = await Promise.all(
      placesResponse.data.results.map(async (place) => {
        let details;
        if (place.place_id) {
          const detailsResponse = await client.placeDetails({
            params: {
              place_id: place.place_id,
              fields: ['formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'url'],
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
            },
          });
          details = detailsResponse.data.result;
        }

        return {
          name: place.name,
          address: place.vicinity,
          phoneNumber: details?.formatted_phone_number || 'N/A',
          website: details?.website || '',
          location: place.geometry?.location,
          reviews: details?.user_ratings_total || 0,
          rating: details?.rating || 0,
          placeId: place.place_id,
          mapsUrl: details?.url || '',
          searchKeyword: keywords,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = "force-static";