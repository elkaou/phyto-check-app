import { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { searchByName } from '@/lib/ephy-service';
import { SearchResult } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const searchResults = await searchByName(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
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
            Recherche manuelle
          </Text>
        </View>

        {/* Contenu */}
        <View className="flex-1 p-6 gap-4">
          {/* Barre de recherche */}
          <View className="gap-2">
            <TextInput
              placeholder="Rechercher par nom ou AMM..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              className="bg-surface border border-border rounded-lg p-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
            <TouchableOpacity
              onPress={handleSearch}
              disabled={isSearching}
              className="bg-primary rounded-lg p-3 active:opacity-80"
            >
              <Text className="text-center text-white font-semibold">
                {isSearching ? 'Recherche...' : '🔍 Rechercher'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Résultats */}
          {isSearching && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <View className="bg-surface rounded-lg p-4 items-center">
              <Text className="text-muted text-sm">
                Aucun produit trouvé pour "{query}"
              </Text>
            </View>
          )}

          {!isSearching && results.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm text-muted font-semibold">
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </Text>
              <FlatList
                data={results}
                keyExtractor={(item) => item.product.amm}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                    router.push({
                      pathname: '/(tabs)/product-detail' as any,
                        params: {
                          amm: item.product.amm,
                          name: item.product.name,
                          status: item.product.status,
                          barcode: item.product.amm,
                        },
                      })
                    }
                    className="bg-surface rounded-lg p-4 mb-2 gap-2 active:opacity-70"
                  >
                    <View className="flex-row items-center justify-between gap-2">
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                          {item.product.name}
                        </Text>
                        <Text className="text-xs text-muted">
                          AMM: {item.product.amm}
                        </Text>
                      </View>
                      <StatusBadge status={item.product.status} size="sm" />
                    </View>
                    {item.product.function && (
                      <Text className="text-xs text-muted">
                        {item.product.function}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {!hasSearched && (
            <View className="bg-surface rounded-lg p-4 items-center mt-8">
              <Text className="text-muted text-sm">
                Entrez un nom de produit ou un numéro AMM pour commencer
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
