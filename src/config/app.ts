// Application configuration

export const appConfig = {
  name: 'PlanMyHoliday.AI',
  version: '1.0.0',
  description: 'AI-powered holiday planning platform',
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.planmyholiday.ai',
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },

  // External API Services
  externalApis: {
    ipgeolocation: {
      apiKey: '028689979e854db0b0b5f81c27490f8b',
      baseUrl: 'https://api.ipgeolocation.io/ipgeo',
    },
  },

  // Feature flags
  features: {
    enableCurrencySelector: true,
    enableTripSaving: true,
    enableAdvancedFilters: true,
    enableAIPlanning: false, // Coming soon
  },

  // UI Configuration
  ui: {
    defaultCurrency: 'GBP',
    maxTripResults: 20,
    itemsPerPage: 12,
    animationDuration: 300,
  },

  // Form Configuration
  form: {
    defaultDuration: 7,
    defaultDurationUnit: 'days',
    minBudget: 0,
    maxBudget: 100000,
    maxAdults: 20,
    maxKids: 10,
  },

  // Date Configuration
  date: {
    minAdvanceBooking: 1, // days
    maxAdvanceBooking: 365, // days
    defaultFlexibleMonths: 3,
  },
} as const;

export type AppConfig = typeof appConfig;
