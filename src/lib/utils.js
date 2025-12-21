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

export { cn };
