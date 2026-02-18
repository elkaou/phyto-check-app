import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryItem } from '@/lib/types';

const INVENTORY_KEY = 'phytocheck_inventory';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const stored = await AsyncStorage.getItem(INVENTORY_KEY);
      if (stored) {
        setInventory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'inventaire:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToInventory = async (item: Omit<InventoryItem, 'id' | 'addedAt'>) => {
    try {
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        addedAt: Date.now(),
      };
      const updated = [...inventory, newItem];
      setInventory(updated);
      await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'inventaire:', error);
    }
  };

  const removeFromInventory = async (id: string) => {
    try {
      const updated = inventory.filter(item => item.id !== id);
      setInventory(updated);
      await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'inventaire:', error);
    }
  };

  return {
    inventory,
    isLoading,
    loadInventory,
    addToInventory,
    removeFromInventory,
  };
}
