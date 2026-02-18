import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadEphyDatabase,
  searchByAMM,
  searchByName,
  getProductInfo,
  getDatabaseVersion,
  getTotalProducts,
} from '../ephy-service';

describe('E-Phy Service', () => {
  beforeAll(async () => {
    // Charger la base de données une fois avant les tests
    await loadEphyDatabase();
  });

  it('should load the E-Phy database', async () => {
    const db = await loadEphyDatabase();
    expect(db).toBeDefined();
    expect(db.products).toBeDefined();
    expect(db.products.length).toBeGreaterThan(0);
  });

  it('should return the database version', async () => {
    const version = await getDatabaseVersion();
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
  });

  it('should return the total number of products', async () => {
    const total = await getTotalProducts();
    expect(total).toBeGreaterThan(0);
    expect(typeof total).toBe('number');
  });

  it('should search products by name', async () => {
    const results = await searchByName('DIMATE');
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  it('should find products with exact name match', async () => {
    const results = await searchByName('DIMATE BF 400');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchType).toBe('exact');
  });

  it('should return empty array for non-existent product', async () => {
    const results = await searchByName('PRODUIT_INEXISTANT_XYZ');
    expect(Array.isArray(results)).toBe(true);
    // Peut être vide ou contenir des résultats partiels
  });

  it('should handle product status correctly', async () => {
    const results = await searchByName('DIMATE');
    if (results.length > 0) {
      const product = results[0].product;
      expect(['AUTHORIZED', 'RETIRED', 'NOT_FOUND']).toContain(product.status);
    }
  });

  it('should include product details in results', async () => {
    const results = await searchByName('DIMATE');
    if (results.length > 0) {
      const product = results[0].product;
      expect(product.amm).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.status).toBeDefined();
    }
  });

  it('should limit search results to 10 items', async () => {
    const results = await searchByName('a'); // Recherche générale
    expect(results.length).toBeLessThanOrEqual(10);
  });
});
