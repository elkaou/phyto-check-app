import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryItem } from '@/lib/types';

const INVENTORY_KEY = 'phytocheck_inventory';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'inventaire au montage
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