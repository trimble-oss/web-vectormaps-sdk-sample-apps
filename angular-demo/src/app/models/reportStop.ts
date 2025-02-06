export interface ReportStop {
  Address: {
    StreetAddress?: string;
    City?: string;
    State?: string;
    Zip?: string;
    County?: string;
    Country?: string;
    SPLC?: string;
    CountryAbbreviation?: string;
    StateAbbreviation?: string;
  };
  Coords: {
    Lat: string;
    Lon: string;
  };
  Region: number;
  TimeZone: string;
}

export interface StopState {
  // ? Do we need an id?

  // This is the single source of truth for a stop
  lngLat: TrimbleMaps.LngLatLike;

  // Search/Geocode result
  location: StopLocation;

  stopTime?: string;
}

export interface StopLocation {
  name?: string; // can be favorite name
  address?: AddressState;
  coords?: TrimbleMaps.LngLatLike;
  isFavorite?: boolean;
  isSharedFavorite?: boolean; // If a stop is a favorite, it can be a shared or private favorite.
  favoriteId?: number; // After saving a place as a favorite place, the web service returns an id for the favorite place.
}

export interface AddressState {
  streetAddress?: string;
  city?: string;
  stateAbbreviation?: string;
  stateFullName?: string;
  zip?: string;
  county?: string;
  countryAbbreviation?: string;
  countryFullName?: string;
  SPLC?: string;
}
