import { useCurrency } from '../../hooks/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Currency:</span>
      <select
        value={currency.code}
        onChange={(e) => {
          const selectedCurrency = currencies.find(c => c.code === e.target.value);
          if (selectedCurrency) {
            setCurrency(selectedCurrency);
          }
        }}
        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
    </div>
  );
}
