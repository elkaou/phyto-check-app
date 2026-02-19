import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import * as FileSystem from 'expo-file-system/legacy';

export default function ScannerScreen() {
  const router = useRouter();
  const colors = useColors();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const analyzeLabelMutation = trpc.analyzeLabel.useMutation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        'Nous avons besoin de votre permission pour accéder à la galerie.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        'Nous avons besoin de votre permission pour accéder à la caméra.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    setSelectedImage(imageUri);

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageUrl = `data:image/jpeg;base64,${base64}`;

      const response = await analyzeLabelMutation.mutateAsync({
        imageUrl: imageUrl,
      });

      if (response.success && response.data) {
        const { productName, amm, function: productFunction } = response.data;

        if (productName) {
          router.push({
            pathname: '/(tabs)/product-detail' as any,
            params: {
              name: productName,
              amm: amm || '',
              function: productFunction || '',
              barcode: 'LABEL_SCAN',
            },
          });
        } else {
          Alert.alert(
            'Analyse échouée',
            "Impossible d'extraire le nom du produit de l'étiquette. Veuillez réessayer avec une image plus nette."
          );
        }
      } else {
        Alert.alert(
          'Erreur',
          response.error || "Erreur lors de l'analyse de l'étiquette"
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      Alert.alert(
        'Erreur',
        "Une erreur s'est produite lors de l'analyse de l'étiquette"
      );
    } finally {
      setIsAnalyzing(false);
      setSelectedImage(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, padding: 24, gap: 8 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: 'white', marginBottom: 8 }}>
            ← Retour
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
          Scanner
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
          Scannez une étiquette de produit
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <View style={{ gap: 12 }}>
          {selectedImage && isAnalyzing && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: '100%',
                  height: 192,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                Analyse de l'étiquette en cours...
              </Text>
            </View>
          )}

          {!isAnalyzing && (
            <>
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  📷 Prendre une photo de l'étiquette
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.primary,
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  🖼️ Choisir depuis la galerie
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
