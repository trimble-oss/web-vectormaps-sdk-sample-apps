// https://developer.trimblemaps.com/restful-apis/location/single-search/single-search-api/
// Response for https://singlesearch.alk.com/{region}/api/{endpoint}?authToken={your-api-key}

import { Address } from "@trimblemaps/trimblemaps-js";

// This is currently a minimal representation of the needed properties and not
// a complete mapping of result fields.
// Add more properties as needed.

export interface SingleSearchLocationAddress {
    StreetAddress?: string;
    City?: string;
    State?: string;
    StateName?: string;
    Zip?: string;
    County?: string;
    Country?: string;
    CountryFullName?: string;
    SPLC?: string;
    StateAbbreviation?: string;
    CountryAbbreviation?: string;
}

export interface SingleSearchLocation {
    Address?: SingleSearchLocationAddress;
    Coords?: Coords;
    Region?: number; // TODO enum
    POITypeID?: number;
    PersistentPOIID?: number;
    ResultType?: number; // TODO enum
    ShortString?: string;
    PlaceId?: string;
    TrimblePlaceId?: string;
    PlaceName?: string;
    SiteName?: string;
}

export interface SingleSearchResponse {
    Err?: number; // TODO enum
    ErrString?: string;
    QueryConfidence?: number;
    Locations?: SingleSearchLocation[];
}

export interface ErrorInformation {
    Code: number;
    Description: string;
    LegacyErrorCode: number;
    Type: number;
}

export interface BatchLocationResponse {
    Address: Address;
    ConfidenceLevel: string;
    Coords: Coords;
    CrossStreet: string;
    DistanceFromRoad: string;
    Errors: ErrorInformation[];
    Label: string;
    PlaceName: string;
    Region: number;
    SpeedLimitInfo: string;
    TimeZone: string;
    TimeZoneOffset: string;
}

export interface Coords {
    Lat: number;
    Lon: number;
}
