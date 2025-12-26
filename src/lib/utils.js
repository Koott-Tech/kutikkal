// Utility function to merge class names (similar to clsx)
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
};

export const formatCurrencyINR = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
  } catch {
    return `₹${Number(value).toFixed(0)}`;
  }
};

// Format currency based on currency code (e.g., INR 200, $200)
export const formatCurrency = (amount, currencyCode = 'INR') => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '';
  
  const amountNum = Number(amount);
  
  // Format based on currency code
  switch (currencyCode.toUpperCase()) {
    case 'INR':
      return `INR ${amountNum.toFixed(0)}`;
    case 'USD':
      return `$${amountNum.toFixed(0)}`;
    case 'EUR':
      return `€${amountNum.toFixed(0)}`;
    case 'GBP':
      return `£${amountNum.toFixed(0)}`;
    default:
      // For other currencies, show currency code followed by amount
      return `${currencyCode.toUpperCase()} ${amountNum.toFixed(0)}`;
  }
};

export { cn };
