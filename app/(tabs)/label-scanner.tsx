         import React from 'react';
         import { View, Text, Alert } from 'react-native';
         import { scanLabel } from '@/lib/api';

         interface LabelScannerProps {
           onScanComplete?: () => void;
           productFunction?: (productName: string) => void;
         }

         export default function LabelScanner({ onScanComplete, productFunction }: LabelScannerProps) {
           const handleScan = async (imageUri: string) => {
             try {
               const response = await scanLabel(imageUri);

               if (response.success && response.productName) {
                 productFunction?.(response.productName);

                 const scanConfig = {
                   callback: productFunction || (() => {}),
                   barcode: 'LABEL_SCAN',
                 };
                 console.log('Scan configuré :', scanConfig);

                 onScanComplete?.();
               } else {
                 Alert.alert(
                   'Analyse échouée',
                   "Impossible d'extraire le nom du produit de l'étiquette. Veuillez réessayer avec une image plus nette."
                 );
               }
             } catch (error) {
               console.error('Erreur lors de l\'analyse:', error);
               Alert.alert('Erreur', 'Erreur lors de l\'analyse de l\'étiquette');
             }
           };

           return (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Text>Label Scanner</Text>
               {/* Exemple : Bouton pour déclencher un scan (à adapter) */}
               {/* <Button title="Scanner" onPress={() => handleScan('uri_de_l_image')} /> */}
             </View>
           );
         }
