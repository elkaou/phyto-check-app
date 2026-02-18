import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [showScanner, setShowScanner] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={{ backgroundColor: colors.primary, padding: 24, gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
            PhytoCheck
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
            Vérifiez l'homologation de vos produits
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, padding: 24, gap: 24 }}>
          {/* Scanner Button */}
          <TouchableOpacity
            onPress={() => setShowScanner(!showScanner)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: '600' }}>
              📱 Scanner un produit
            </Text>
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text style={{ textAlign: 'center', color: colors.foreground, fontWeight: '600' }}>
              🔍 Recherche manuelle
            </Text>
          </TouchableOpacity>

          {/* Inventory Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text style={{ textAlign: 'center', color: colors.foreground, fontWeight: '600' }}>
              📦 Gestion du stock
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
