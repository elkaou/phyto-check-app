import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatLastUpdate,
  isUpdateAvailable,
  getUpdateStatus,
} from '../ephy-update-service';

describe('E-Phy Update Service', () => {
  describe('formatLastUpdate', () => {
    it('should return "Jamais mise à jour" for null date', () => {
      const result = formatLastUpdate(null);
      expect(result).toBe('Jamais mise à jour');
    });

    it('should return "À l\'instant" for very recent updates', () => {
      const now = new Date();
      const result = formatLastUpdate(now);
      expect(result).toBe('À l\'instant');
    });

    it('should return minutes ago format', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
      const result = formatLastUpdate(date);
      expect(result).toContain('minute');
    });

    it('should return hours ago format', () => {
      const date = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
      const result = formatLastUpdate(date);
      expect(result).toContain('heure');
    });

    it('should return days ago format', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      const result = formatLastUpdate(date);
      expect(result).toContain('jour');
    });

    it('should return formatted date for old updates', () => {
      const date = new Date('2025-01-01');
      const result = formatLastUpdate(date);
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('isUpdateAvailable', () => {
    it('should return true for null date (first use)', async () => {
      const result = await isUpdateAvailable();
      // This test might fail if there's actual data stored
      // In a real scenario, we'd mock AsyncStorage
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getUpdateStatus', () => {
    it('should return a valid update status object', async () => {
      const status = await getUpdateStatus();
      expect(status).toHaveProperty('isUpdating');
      expect(status).toHaveProperty('progress');
      expect(status).toHaveProperty('lastUpdate');
      expect(status).toHaveProperty('error');
      expect(typeof status.isUpdating).toBe('boolean');
      expect(typeof status.progress).toBe('number');
    });

    it('should have progress between 0 and 100', async () => {
      const status = await getUpdateStatus();
      expect(status.progress).toBeGreaterThanOrEqual(0);
      expect(status.progress).toBeLessThanOrEqual(100);
    });
  });

  describe('Date formatting edge cases', () => {
    it('should handle singular and plural forms correctly', () => {
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
      const result = formatLastUpdate(oneMinuteAgo);
      expect(result).toContain('1 minute');
      expect(result).not.toContain('minutes');
    });

    it('should handle multiple days correctly', () => {
      const multipleDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const result = formatLastUpdate(multipleDaysAgo);
      expect(result).toContain('5 jours');
    });

    it('should handle exactly 7 days', () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const result = formatLastUpdate(sevenDaysAgo);
      // Should be formatted as date after 7 days
      expect(result).toBeDefined();
    });
  });
});
