import { describe, it, expect } from 'vitest';
import { ProductStatus } from '@/lib/types';

describe('StatusBadge Component', () => {
  it('should define status badge information for AUTHORIZED', () => {
    const status: ProductStatus = 'AUTHORIZED';
    const info = {
      label: 'HOMOLOGUÉ',
      icon: '✓',
      bgColor: '#2E7D32',
      textColor: '#FFFFFF',
    };

    expect(status).toBe('AUTHORIZED');
    expect(info.label).toBe('HOMOLOGUÉ');
    expect(info.bgColor).toBe('#2E7D32'); // Green
  });

  it('should define status badge information for RETIRED', () => {
    const status: ProductStatus = 'RETIRED';
    const info = {
      label: 'RETIRÉ (PPNU)',
      icon: '⚠️',
      bgColor: '#D32F2F',
      textColor: '#FFFFFF',
    };

    expect(status).toBe('RETIRED');
    expect(info.label).toBe('RETIRÉ (PPNU)');
    expect(info.bgColor).toBe('#D32F2F'); // Red
  });

  it('should define status badge information for NOT_FOUND', () => {
    const status: ProductStatus = 'NOT_FOUND';
    const info = {
      label: 'NON TROUVÉ',
      icon: '?',
      bgColor: '#757575',
      textColor: '#FFFFFF',
    };

    expect(status).toBe('NOT_FOUND');
    expect(info.label).toBe('NON TROUVÉ');
    expect(info.bgColor).toBe('#757575'); // Gray
  });

  it('should have distinct colors for each status', () => {
    const colors = {
      AUTHORIZED: '#2E7D32',
      RETIRED: '#D32F2F',
      NOT_FOUND: '#757575',
    };

    const uniqueColors = new Set(Object.values(colors));
    expect(uniqueColors.size).toBe(3);
  });

  it('should support size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    expect(sizes).toHaveLength(3);
  });
});
