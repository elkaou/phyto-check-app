import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { useInventory } from '@/hooks/use-inventory';
import { getProductInfo } from '@/lib/ephy-service';
import { Product, ProductStatus } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

export default function ProductDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { amm, name, status: statusParam, barcode } = useLocalSearchParams<{
    amm: string;
    name: string;
    status: ProductStatus;
    barcode: string;
  }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const { addToInventory } = useInventory();

  useEffect(() => {
    loadProduct();
  }, [amm]);

  const loadProduct = async () => {
    try {
      if (amm) {
        const data = await getProductInfo(amm);
        setProduct(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = async () => {
    if (!product) return;

    setIsAddingToInventory(true);
    try {
      await addToInventory({
        amm: product.amm,
        name: product.name,