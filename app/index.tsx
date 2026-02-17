import { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
// import { LabelScanner } from '@/components/label-scanner';
// import { StatusBadge } from '@/components/status-badge';
import { useScanHistory } from '@/hooks/use-scan-history';
// import { getProductInfo } from '@/lib/ephy-service';
// import { ScanHistory } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

const packageJson = require('@/package.json');


export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { history, addToHistory } = useScanHistory();
  const [showLabelScanner, setShowLabelScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);



  const handleBarCodeScanned = async (barcode: string) => {
    setIsScanning(true);
    try {
      const product = await getProductInfo(barcode);

      if (product) {
        const scanItem: Omit<ScanHistory, 'id'> = {
          amm: product.amm,
          name: product.name,
          status: product.status,
          scannedAt: Date.now(),
          barcode,
        };
        await addToHistory(scanItem);

        // Naviguer vers l'écran de résultat
        router.push({
          pathname: '/(tabs)/product-detail' as any,
          params: {
            amm: product.amm,
            name: product.name,
            status: product.status,
            barcode,
          },
        });
      } else {
        // Produit non trouvé
        const scanItem: Omit<ScanHistory, 'id'> = {
          amm: barcode,
          name: `Code: ${barcode}`,
          status: 'NOT_FOUND',
          scannedAt: Date.now(),
          barcode,
        };
        await addToHistory(scanItem);

        router.push({
          pathname: '/(tabs)/product-detail' as any,
          params: {
            amm: barcode,
            name: `Code: ${barcode}`,
            status: 'NOT_FOUND',
            barcode,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
    } finally {
      setIsScanning(false);
      setShowLabelScanner(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* En-tête */}
        <View className="bg-primary p-6 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-white">PhytoCheck</Text>
            <Text className="text-xs text-white opacity-70">v{packageJson.version}</Text>
          </View>
          <Text className="text-sm text-white opacity-90">
            Vérifiez l'homologation de vos produits
          </Text>
        </View>

        {/* Contenu principal */}
        <View className="flex-1 p-6 gap-6">
          {showLabelScanner ? (
            <View className="gap-4">
              <TouchableOpacity
                onPress={() => setShowLabelScanner(false)}
                className="self-start"
              >
                <Text className="text-primary font-semibold text-lg">← Retour</Text>
              </TouchableOpacity>
              <LabelScanner onScanComplete={() => setShowLabelScanner(false)} />
            </View>
          ) : (
            <>
              {/* Bouton Scanner Principal */}
              <TouchableOpacity
                onPress={() => setShowLabelScanner(true)}
                disabled={isScanning}
                className="bg-primary rounded-2xl p-6 active:opacity-80"
              >
                <Text className="text-center text-white text-lg font-semibold">
                  {isScanning ? 'Scan en cours...' : '📱 Scanner un produit'}
                </Text>
              </TouchableOpacity>

          {/* Informations base de données */}
        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-xs text-blue-600 font-semibold">BASE DE DONNÉES E-PHY</Text>
          <Text className="text-sm text-blue-700 mt-1">
            Mise à jour le 17/02/2026
          </Text>
          <Text className="text-xs text-blue-600 mt-1 opacity-70">
            15 042 produits référencés
          </Text>
        </View>

          {/* Actions secondaires */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/search' as any)}
              className="bg-surface rounded-lg p-4 active:opacity-70"
            >
              <Text className="text-center font-semibold text-foreground">
                🔍 Recherche manuelle
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/inventory' as any)}
              className="bg-surface rounded-lg p-4 active:opacity-70"
            >
              <Text className="text-center font-semibold text-foreground">
                📦 Gestion du stock
              </Text>
            </TouchableOpacity>
          </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
