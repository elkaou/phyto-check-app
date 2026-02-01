import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanHistory } from '@/lib/types';

const HISTORY_KEY = 'phytocheck_scan_history';
const MAX_HISTORY = 50;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'historique au montage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (item: Omit<ScanHistory, 'id'>) => {
    try {
      const newItem: ScanHistory = {
        ...item,
        id: `${Date.now()}-${Math.random()}`,
      };

      const updated = [newItem, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return newItem;
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'historique:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
      throw error;
    }
  };

  const removeFromHistory = async (id: string) => {
    try {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un élément:', error);
      throw error;
    }
  };

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
