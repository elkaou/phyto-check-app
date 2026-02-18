import { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { useScanHistory } from '@/hooks/use-scan-history';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, removeFromHistory, clearHistory } = useScanHistory();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(() => {
    // L'historique est automatiquement mis à jour par le hook
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Êtes-vous sûr de vouloir effacer tout l\'historique des scans ?',
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Effacer',
          onPress: () => clearHistory(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleRemove = (id: string, name: string) => {
    removeFromHistory(id);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
          />
        }
      >
        {/* En-tête */}
        <View className="bg-primary p-6 gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-lg font-semibold">← Retour</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white mt-2">
            Historique des scans
          </Text>
          <Text className="text-sm text-white opacity-90">
            {history.length} scan{history.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Contenu */}
        <View className="flex-1 p-6 gap-4">
          {/* Actions */}
          {history.length > 0 && (
            <TouchableOpacity
              onPress={handleClearHistory}
              className="bg-red-100 rounded-lg p-3 active:opacity-70"
            >
              <Text className="text-center text-red-600 font-semibold">
                🗑️ Effacer l'historique
              </Text>
            </TouchableOpacity>
          )}

          {/* Liste */}
          {history.length === 0 ? (
            <View className="bg-surface rounded-lg p-4 items-center mt-8">
              <Text className="text-muted text-sm">
                Aucun scan dans l'historique
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/product-detail' as any,
                      params: {
                        amm: item.amm,
                        name: item.name,
                        status: item.status,
                        barcode: item.barcode,
                      },
                    })
                  }
                  className="bg-surface rounded-lg p-4 mb-2 flex-row items-center justify-between gap-2 active:opacity-70"
                >
                  <View className="flex-1 gap-1">
                    <Text className="font-semibold text-foreground">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-muted">
                      AMM: {item.amm}
                    </Text>
                    <Text className="text-xs text-muted">
                      {new Date(item.scannedAt).toLocaleDateString('fr-FR')}{' '}
                      {new Date(item.scannedAt).toLocaleTimeString('fr-FR')}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <StatusBadge status={item.status} size="sm" />
                    <TouchableOpacity
                      onPress={() => handleRemove(item.id, item.name)}
                      className="p-2"
                    >
                      <Text className="text-muted">✕</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
