import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';

export default function ProductDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { amm, name, status, barcode } = useLocalSearchParams<{
    amm: string;
    name: string;
    status: string;
    barcode: string;
  }>();

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        <View style={{ gap: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground }}>
            {name || 'Produit inconnu'}
          </Text>

          <View style={{ backgroundColor: colors.surface, padding: 16, borderRadius: 8 }}>
            <Text style={{ color: colors.muted }}>Code AMM: {amm}</Text>
            <Text style={{ color: colors.muted, marginTop: 8 }}>Code-barres: {barcode}</Text>
            <Text style={{ color: colors.muted, marginTop: 8 }}>Statut: {status}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              ← Retour
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
