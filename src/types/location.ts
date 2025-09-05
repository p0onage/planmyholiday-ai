// Location-related types

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface LocationInfo {
  country: string;
  city: string;
  countryCode: string;
  state: string;
}

export interface Timezone {
  name: string;
  offset: number;
}

export interface LocationData {
  ip: string;
  country_name: string;
  country_code2: string;
  country_code3: string;
  state_prov: string;
  city: string;
  latitude: string;
  longitude: string;
  currency: Currency;
  time_zone: Timezone;
  languages: string;
  isp: string;
  organization: string;
}

export interface LocationServiceResponse {
  success: boolean;
  data?: LocationData;
  error?: string;
}

export interface UseLocationOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
}

export interface UseLocationReturn {
  currency: Currency | null;
  location: LocationInfo | null;
  language: string | null;
  timezone: Timezone | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
