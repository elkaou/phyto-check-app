import { describe, it, expect } from 'vitest';
import { Product, ProductStatus, ScanHistory, InventoryItem } from '../types';

describe('Types', () => {
  it('should define valid product statuses', () => {
    const statuses: ProductStatus[] = ['AUTHORIZED', 'RETIRED', 'NOT_FOUND'];
    expect(statuses).toHaveLength(3);
  });

  it('should create a valid product object', () => {
    const product: Product = {
      amm: '8800006',
      name: 'DIMATE BF 400',
      status: 'AUTHORIZED',
      withdrawal_date: null,
      substances: 'diméthoate 400.0 g/L',
      function: 'Insecticide',
      formulation: 'Concentré émulsionnable',
      holder: 'CHEMINOVA AGRO FRANCE SAS',
    };

    expect(product.amm).toBe('8800006');
    expect(product.status).toBe('AUTHORIZED');
  });

  it('should create a retired product with withdrawal date', () => {
    const product: Product = {
      amm: '8800006',
      name: 'DIMATE BF 400',
      status: 'RETIRED',
      withdrawal_date: '01/02/2016',
      substances: 'diméthoate 400.0 g/L',
      function: 'Insecticide',
      formulation: 'Concentré émulsionnable',
      holder: 'CHEMINOVA AGRO FRANCE SAS',
    };

    expect(product.status).toBe('RETIRED');
    expect(product.withdrawal_date).toBe('01/02/2016');
  });

  it('should create a scan history entry', () => {
    const scanHistory: ScanHistory = {
      id: '123-456',
      amm: '8800006',
      name: 'DIMATE BF 400',
      status: 'AUTHORIZED',
      scannedAt: Date.now(),
      barcode: '3660001234567',
    };

    expect(scanHistory.id).toBe('123-456');
    expect(scanHistory.barcode).toBe('3660001234567');
  });

  it('should create an inventory item', () => {
    const item: InventoryItem = {
      id: 'inv-123',
      amm: '8800006',
      name: 'DIMATE BF 400',
      status: 'AUTHORIZED',
      addedAt: Date.now(),
      quantity: 5,
      unit: 'L',
      location: 'Hangar A',
    };

    expect(item.quantity).toBe(5);
    expect(item.unit).toBe('L');
    expect(item.location).toBe('Hangar A');
  });

  it('should handle NOT_FOUND status', () => {
    const product: Product = {
      amm: 'UNKNOWN',
      name: 'Produit inconnu',
      status: 'NOT_FOUND',
      withdrawal_date: null,
      substances: '',
      function: '',
      formulation: '',
      holder: '',
    };

    expect(product.status).toBe('NOT_FOUND');
  });
});
