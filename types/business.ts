export interface Business {
  name: string;
  address: string;
  phoneNumber: string;
  website?: string;
  location?: google.maps.LatLngLiteral;
  reviews?: number;
  rating?: number;
  placeId?: string;
  searchKeyword?: string;
}