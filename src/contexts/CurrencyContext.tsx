import  { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

// Currency types
export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

// Available currencies
const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

// Context type
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
}

// Create context
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider props
interface CurrencyProviderProps {
  children: ReactNode;
}

// Provider component
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[2]); // Default to GBP

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    currencies: CURRENCIES,
  }), [currency]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook to use currency context
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
