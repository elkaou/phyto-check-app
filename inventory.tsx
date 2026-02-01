import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { useInventory } from '@/hooks/use-inventory';
import * as FileSystem from 'expo-file-system/legacy';

export default function InventoryScreen() {
  const router = useRouter();
  const { inventory, removeFromInventory, getRetiredProducts, getAuthorizedProducts } = useInventory();
  const [isExporting, setIsExporting] = useState(false);

  // Rafraîchir l'inventaire quand l'écran est visible
  useFocusEffect(() => {
    // L'inventaire est automatiquement mis à jour par le hook
  });

  const retiredProducts = getRetiredProducts();
  const authorizedProducts = getAuthorizedProducts();

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Supprimer du stock',
      `Êtes-vous sûr de vouloir supprimer "${name}" du stock ?`,
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => removeFromInventory(id),
          style: 'destructive',
        },
      ]
    );
  };

  const generatePPNUReport = async () => {
    setIsExporting(true);
    try {
      const report = `RAPPORT PPNU (Produits Phytopharmaceutiques Non Utilisables)
Date: ${new Date().toLocaleDateString('fr-FR')}
Heure: ${new Date().toLocaleTimeString('fr-FR')}

RÉSUMÉ
------
Total de produits en stock: ${inventory.length}
Produits homologués: ${authorizedProducts.length}
Produits PPNU (retirés): ${retiredProducts.length}

PRODUITS À RETIRER (PPNU)
--------------------------
${retiredProducts.map((item) => `- ${item.name} (AMM: ${item.amm})`).join('\n')}

PRODUITS HOMOLOGUÉS
-------------------
${authorizedProducts.map((item) => `- ${item.name} (AMM: ${item.amm})`).join('\n')}

Généré par PhytoCheck`;

      // Créer un fichier temporaire
      const filename = `${FileSystem.documentDirectory}PPNU_Report_${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(filename, report);

      // Partager le fichier
      await Share.share({
        url: filename,
        title: 'Rapport PPNU',
        message: 'Rapport des produits phytosanitaires non utilisables',
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      Alert.alert('Erreur', 'Impossible de générer le rapport');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* En-tête */}
        <View className="bg-primary p-6 gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-lg font-semibold">← Retour</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white mt-2">
            Gestion du stock
          </Text>
        </View>

        {/* Contenu */}
        <View className="flex-1 p-6 gap-4">
          {/* Statistiques */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-green-50 rounded-lg p-4 border border-green-200">
              <Text className="text-2xl font-bold text-green-700">
                {authorizedProducts.length}
              </Text>
              <Text className="text-xs text-green-600">Homologués</Text>
            </View>
            <View className="flex-1 bg-red-50 rounded-lg p-4 border border-red-200">
              <Text className="text-2xl font-bold text-red-700">
                {retiredProducts.length}
              </Text>
              <Text className="text-xs text-red-600">PPNU</Text>
            </View>
            <View className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Text className="text-2xl font-bold text-blue-700">
                {inventory.length}
              </Text>
              <Text className="text-xs text-blue-600">Total</Text>
            </View>
          </View>

          {/* Boutons d'action */}
          <View className="gap-2">
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="bg-primary rounded-lg p-3 active:opacity-80"
            >
              <Text className="text-center text-white font-semibold">
                ➕ Ajouter un produit
              </Text>
            </TouchableOpacity>

            {retiredProducts.length > 0 && (
              <TouchableOpacity
                onPress={generatePPNUReport}
                disabled={isExporting}
                className="bg-red-600 rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-center text-white font-semibold">
                  {isExporting ? 'Export en cours...' : '📄 Exporter rapport PPNU'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Liste des produits */}
          {inventory.length === 0 ? (
            <View className="bg-surface rounded-lg p-4 items-center mt-8">
              <Text className="text-muted text-sm">
                Aucun produit dans le stock
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {/* Produits PPNU */}
              {retiredProducts.length > 0 && (
                <View className="gap-2">
                  <Text className="text-lg font-semibold text-foreground">
                    ⚠️ À retirer (PPNU)
                  </Text>
                  <FlatList
                    data={retiredProducts}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View className="bg-red-50 rounded-lg p-4 border border-red-200 flex-row items-center justify-between gap-2 mb-2">
                        <View className="flex-1">
                          <Text className="font-semibold text-foreground">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-muted">
                            AMM: {item.amm}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemove(item.id, item.name)}
                          className="p-2"
                        >
                          <Text className="text-red-600 font-bold">✕</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Produits homologués */}
              {authorizedProducts.length > 0 && (
                <View className="gap-2">
                  <Text className="text-lg font-semibold text-foreground">
                    ✓ Homologués
                  </Text>
                  <FlatList
                    data={authorizedProducts}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View className="bg-surface rounded-lg p-4 flex-row items-center justify-between gap-2 mb-2">
                        <View className="flex-1">
                          <Text className="font-semibold text-foreground">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-muted">
                            AMM: {item.amm}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemove(item.id, item.name)}
                          className="p-2"
                        >
                          <Text className="text-muted">✕</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
