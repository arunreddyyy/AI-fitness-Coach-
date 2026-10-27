export interface GymLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address: string;
  city?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  amenities: string[];
  isOpenNow?: boolean;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface GymSearchFilter {
  radiusKm: number;
  openOnly: boolean;
  searchQuery: string;
}
