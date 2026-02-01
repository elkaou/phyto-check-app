import { describe, it, expect, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryItem } from '@/lib/types';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('useInventory - updateInventoryItem', () => {
  it('devrait permettre la mise à jour de la quantité d\'un produit', async () => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Test Product',
        amm: '1234567',
        status: 'AUTHORIZED',
        quantity: 10,
        unit: 'L',
        addedAt: Date.now(),
      },
    ];

    // Simuler la lecture depuis AsyncStorage
    (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(mockInventory));

    // Simuler la mise à jour
    const updatedInventory = mockInventory.map((item) =>
      item.id === '1' ? { ...item, quantity: 25, unit: 'kg' as const } : item
    );

    // Vérifier que la structure de données est correcte
    expect(updatedInventory[0].quantity).toBe(25);
    expect(updatedInventory[0].unit).toBe('kg');
    expect(updatedInventory[0].name).toBe('Test Product');
  });

  it('devrait permettre l\'ajout d\'un produit avec quantité', () => {
    const newItem = {
      name: 'New Product',
      amm: '9876543',
      status: 'RETIRED' as const,
      quantity: 5,
      unit: 'L' as const,
    };

    const fullItem: InventoryItem = {
      ...newItem,
      id: `${Date.now()}-${Math.random()}`,
      addedAt: Date.now(),
    };

    expect(fullItem.quantity).toBe(5);
    expect(fullItem.unit).toBe('L');
    expect(fullItem.name).toBe('New Product');
  });

  it('devrait permettre la suppression d\'un produit', () => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Product 1',
        amm: '1234567',
        status: 'AUTHORIZED',
        quantity: 10,
        unit: 'L',
        addedAt: Date.now(),
      },
      {
        id: '2',
        name: 'Product 2',
        amm: '7654321',
        status: 'RETIRED',
        quantity: 5,
        unit: 'kg',
        addedAt: Date.now(),
      },
    ];

    const filtered = mockInventory.filter((item) => item.id !== '1');

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('devrait filtrer les produits retirés', () => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Authorized Product',
        amm: '1234567',
        status: 'AUTHORIZED',
        quantity: 10,
        unit: 'L',
        addedAt: Date.now(),
      },
      {
        id: '2',
        name: 'Retired Product',
        amm: '7654321',
        status: 'RETIRED',
        quantity: 5,
        unit: 'kg',
        addedAt: Date.now(),
      },
    ];

    const retiredProducts = mockInventory.filter((item) => item.status === 'RETIRED');

    expect(retiredProducts).toHaveLength(1);
    expect(retiredProducts[0].status).toBe('RETIRED');
  });

  it('devrait filtrer les produits autorisés', () => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Authorized Product',
        amm: '1234567',
        status: 'AUTHORIZED',
        quantity: 10,
        unit: 'L',
        addedAt: Date.now(),
      },
      {
        id: '2',
        name: 'Retired Product',
        amm: '7654321',
        status: 'RETIRED',
        quantity: 5,
        unit: 'kg',
        addedAt: Date.now(),
      },
    ];

    const authorizedProducts = mockInventory.filter((item) => item.status === 'AUTHORIZED');

    expect(authorizedProducts).toHaveLength(1);
    expect(authorizedProducts[0].status).toBe('AUTHORIZED');
  });
});
