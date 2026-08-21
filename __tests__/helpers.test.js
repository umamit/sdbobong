import { generateCaptchaChallenge } from '../src/lib/captcha';
import { formatTanggal, formatAngka } from '../src/lib/format';
import { isForbiddenName } from '../src/lib/validators';

describe('Helper Functions Unit Tests', () => {
  
  // 1. CAPTCHA Challenge Generator Test
  describe('generateCaptchaChallenge', () => {
    it('should generate two random single-digit numbers and their correct sum', () => {
      const challenge = generateCaptchaChallenge();
      
      expect(challenge).toHaveProperty('numA');
      expect(challenge).toHaveProperty('numB');
      expect(challenge).toHaveProperty('answer');
      
      expect(challenge.numA).toBeGreaterThanOrEqual(1);
      expect(challenge.numA).toBeLessThanOrEqual(9);
      
      expect(challenge.numB).toBeGreaterThanOrEqual(1);
      expect(challenge.numB).toBeLessThanOrEqual(9);
      
      expect(challenge.answer).toBe(challenge.numA + challenge.numB);
    });
  });

  // 2. Date and Number Formatting Tests
  describe('Format Utilities', () => {
    it('should format date to Indonesian long date format in WIT timezone', () => {
      const testDate = '2026-08-20T12:00:00.000Z'; // 20 August 2026 UTC
      // 2026-08-20 12:00:00 UTC is 2026-08-20 21:00:00 WIT (UTC+9)
      const formatted = formatTanggal(testDate);
      expect(formatted).toBe('20 Agustus 2026');
    });

    it('should return default dash character for invalid/missing dates', () => {
      expect(formatTanggal(null)).toBe('-');
      expect(formatTanggal('')).toBe('-');
    });

    it('should format numbers to Indonesian locale string', () => {
      expect(formatAngka(1000)).toBe('1.000');
      expect(formatAngka(1234567)).toBe('1.234.567');
      expect(formatAngka(0)).toBe('0');
      expect(formatAngka(null)).toBe('0');
    });
  });

  // 3. Forbidden Name Validator Test
  describe('isForbiddenName', () => {
    it('should reject names containing suharmin case-insensitively', () => {
      expect(isForbiddenName('Suharmin')).toBe(true);
      expect(isForbiddenName('suharmin')).toBe(true);
      expect(isForbiddenName('Pak Suharmin')).toBe(true);
    });

    it('should accept typical names not containing suharmin', () => {
      expect(isForbiddenName('Budi Santoso')).toBe(false);
      expect(isForbiddenName('Siti Aminah')).toBe(false);
      expect(isForbiddenName('')).toBe(false);
    });
  });

});
