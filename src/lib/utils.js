const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatCurrencyINR = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
  } catch {
    return `₹${Number(value).toFixed(0)}`;
  }
};

export { cn };
