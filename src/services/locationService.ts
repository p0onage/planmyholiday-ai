// Location service for fetching user's location data based on IP using ipgeolocation.io

import type {  LocationServiceResponse } from '../types/location';

class LocationService {
  private readonly API_URL = 'https://api.ipgeolocation.io/ipgeo';

  /**
   * Fetch user's location data based on their IP address
   * This includes currency, country, language, and other location info
   */
  async getUserLocation(): Promise<LocationServiceResponse> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.country_code2) {
        throw new Error('Location data not found in response');
      }

      return {
        success: true,
        data: {
          ip: data.ip || '',
          country_name: data.country_name || '',
          country_code2: data.country_code2 || '',
          country_code3: data.country_code3 || '',
          state_prov: data.state_prov || '',
          city: data.city || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          currency: {
            code: data.currency?.code || '',
            name: data.currency?.name || '',
            symbol: data.currency?.symbol || '',
          },
          time_zone: {
            name: data.time_zone?.name || '',
            offset: data.time_zone?.offset || 0,
          },
          languages: data.languages || '',
          isp: data.isp || '',
          organization: data.organization || '',
        },
      };
    } catch (error) {
      console.error('Location service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch location data',
      };
    }
  }

}

export const locationService = new LocationService();
export default locationService;
