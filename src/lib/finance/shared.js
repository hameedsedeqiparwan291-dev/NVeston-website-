// Shared helpers for NVeston's financial decision-support tools.
// All calculations run locally in the visitor's browser; nothing is transmitted.

export const roundCents = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export function toNumber(value) {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return NaN;
  const cleaned = String(value).replace(/[,\s$%]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;
  return Number(cleaned);
}

// Returns an error message for a numeric input, or null when valid.
export function checkNumber(value, { label, min = -Infinity, max = Infinity, required = true, integer = false }) {
  if (value === '' || value === null || value === undefined || Number.isNaN(value)) {
    return required ? `Enter ${label}.` : null;
  }
  if (!Number.isFinite(value)) return `Enter a valid number for ${label}.`;
  if (integer && !Number.isInteger(value)) return `${capitalize(label)} must be a whole number.`;
  if (value < min) return `${capitalize(label)} must be at least ${formatBound(min)}.`;
  if (value > max) return `${capitalize(label)} must be no more than ${formatBound(max)}.`;
  return null;
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const formatBound = (n) => n.toLocaleString('en-US');

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatCurrency(n, { cents = false } = {}) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  const value = Object.is(roundCents(n), -0) ? 0 : n;
  return (cents ? usd2 : usd0).format(cents ? roundCents(value) : Math.round(value) || 0);
}

export function formatSignedCurrency(n, opts) {
  if (!Number.isFinite(n)) return '—';
  const s = formatCurrency(Math.abs(n), opts);
  if (Math.round(n * (opts?.cents ? 100 : 1)) === 0) return s;
  return n > 0 ? `+${s}` : `−${s}`;
}

export function formatPercent(ratio, digits = 1) {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatNumber(n, digits = 0) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
