/**
 * Utility helpers for consistent date/number formatting across the app.
 * All date functions default to WIT (Asia/Jayapura, UTC+9) and Bahasa Indonesia locale.
 */

const LOCALE = 'id-ID';
const TIMEZONE = 'Asia/Jayapura';

/**
 * Format a date value to long Indonesian format.
 * Example: "8 Juli 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTanggal(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIMEZONE
  });
}

/**
 * Format a date value to short Indonesian format.
 * Example: "8 Jul 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTanggalPendek(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TIMEZONE
  });
}

/**
 * Format a date+time value to full Indonesian datetime string.
 * Example: "Selasa, 8 Juli 2026, 14:30"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTanggalWaktu(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE
  });
}

/**
 * Format a timestamp to locale string (short).
 * Example: "08/07/2026, 14.30.00"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatWaktu(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString(LOCALE, { timeZone: TIMEZONE });
}

/**
 * Format a number with Indonesian locale separators.
 * Example: 1234567 → "1.234.567"
 * @param {number} num
 * @returns {string}
 */
export function formatAngka(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString(LOCALE);
}
