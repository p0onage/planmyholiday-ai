// Application constants
export const APP_NAME = 'PlanMyHoliday.AI';

// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.planmyholiday.ai';

// Default form values
export const DEFAULT_FORM_VALUES = {
  query: "",
  when: "flexible" as const,
  flexibleText: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  exactDates: { start: "", end: "" },
  durationValue: 7,
  durationUnit: "days" as const,
  budget: 0,
  adults: 1,
  kids: 0,
};

// Trip categories
export const TRIP_CATEGORIES = {
  Journey: 'Journey',
  Family: 'Family',
  Weekender: 'Weekender',
  City: 'City',
} as const;

// Currency symbols
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
} as const;
