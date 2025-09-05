// API configuration

export const apiConfig = {
  ipgeolocation: {
    apiKey: '028689979e854db0b0b5f81c27490f8b',
    baseUrl: 'https://api.ipgeolocation.io/ipgeo',
  },
} as const;

export type ApiConfig = typeof apiConfig;
