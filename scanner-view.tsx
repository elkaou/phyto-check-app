import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from './screen-container';
import { useColors } from '@/hooks/use-colors';

interface ScannerViewProps {
  onBarCodeScanned: (data: string) => void;
  onCancel: () => void;
}

export function ScannerView({ onBarCodeScanned, onCancel }: ScannerViewProps) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not available');
    }
    onBarCodeScanned(data);
  };

  if (!permission) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="items-center justify-center gap-4">
        <Text className="text-lg font-semibold text-foreground">
          Accès à la caméra requis
        </Text>
        <Text className="text-sm text-muted text-center">
          Nous avons besoin de votre permission pour scanner les codes-barres.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-6 py-3 rounded-full"
        >
          <Text className="text-background font-semibold">Autoriser</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'code128',
            'qr',
          ],
        }}
        enableTorch={torchOn}
        style={{ flex: 1 }}
      >
        {/* Overlay avec cadre de scan */}
        <View className="flex-1 items-center justify-center">
          <View
            className="w-64 h-64 border-4"
            style={{ borderColor: colors.primary }}
          />
        </View>

        {/* Barre d'outils */}
        <View
          className="absolute top-0 left-0 right-0 flex-row items-center justify-between p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Pressable onPress={onCancel} className="p-2">
            <Text className="text-white text-lg font-semibold">Annuler</Text>
          </Pressable>
          <Pressable
            onPress={() => setTorchOn(!torchOn)}
            className="p-2"
          >
            <Text className="text-white text-lg font-semibold">
              {torchOn ? '💡' : '🔦'}
            </Text>
          </Pressable>
        </View>

        {/* Message d'instruction */}
        <View
          className="absolute bottom-0 left-0 right-0 items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Text className="text-white text-center">
            Positionnez le code-barres dans le cadre
          </Text>
        </View>
      </CameraView>
    </View>
  );
}
