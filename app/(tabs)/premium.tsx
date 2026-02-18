import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useSubscription } from '@/hooks/use-subscription';
import { iapService, SUBSCRIPTION_SKUS } from '@/lib/iap-service';

export default function PremiumScreen() {
  const router = useRouter();
  const { subscription, upgradeToPremium, downgradeToFree } = useSubscription();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const availableProducts = await iapService.getProducts();
      console.log('[Premium] Products loaded:', availableProducts);
      setProducts(availableProducts);
    } catch (error) {
      console.error('[Premium] Error loading products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handlePurchase = async (sku: string) => {
    setIsPurchasing(true);
    try {
      const success = await iapService.purchaseSubscription(sku);
      if (success) {
        Alert.alert(
          '🎉 Bienvenue dans Premium !',
          'Vous avez maintenant accès à toutes les fonctionnalités avancées de PhytoCheck.',
          [{ text: 'Commencer', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erreur', 'L\'achat a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('[Premium] Purchase error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'achat.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const hasSubscription = await iapService.restorePurchases();
      if (hasSubscription) {
        Alert.alert(
          '✅ Achat restauré',
          'Votre abonnement Premium a été restauré avec succès.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Aucun achat', 'Aucun abonnement trouvé à restaurer.');
      }
    } catch (error) {
      console.error('[Premium] Restore error:', error);
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleUpgradeTest = async () => {
    const success = await upgradeToPremium();
    if (success) {
      Alert.alert(
        '🎉 Bienvenue dans Premium !',
        'Vous avez maintenant accès à toutes les fonctionnalités avancées de PhytoCheck.',
        [{ text: 'Commencer', onPress: () => router.back() }]
      );
    }
  };

  const handleDowngrade = async () => {
    Alert.alert(
      'Retour à la version gratuite',
      'Êtes-vous sûr de vouloir revenir à la version gratuite ? Vous perdrez l\'accès aux fonctionnalités premium.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            const success = await downgradeToFree();
            if (success) {
              Alert.alert('Abonnement annulé', 'Vous êtes revenu à la version gratuite.');
            }
          },
        },
      ]
    );
  };

  const features = [
    {
      icon: '📦',
      title: 'Stock illimité',
      description: 'Ajoutez autant de produits que vous le souhaitez',
      free: '10 produits max',
      premium: 'Illimité',
    },
    {
      icon: '📄',
      title: 'Export PDF professionnel',
      description: 'Générez des rapports PDF élégants de votre stock',
      free: '❌',
      premium: '✅',
    },
    {
      icon: '📊',
      title: 'Statistiques avancées',
      description: 'Graphiques et analyses détaillées de votre stock',
      free: '❌',
      premium: '✅ Bientôt',
    },
    {
      icon: '⏰',
      title: 'Alertes de péremption',
      description: 'Recevez des notifications pour les produits à retirer',
      free: '❌',
      premium: '✅ Bientôt',
    },
    {
      icon: '🏢',
      title: 'Gestion multi-sites',
      description: 'Gérez plusieurs exploitations depuis une seule app',
      free: '❌',
      premium: '✅ Bientôt',
    },
    {
      icon: '📝',
      title: 'Notes personnalisées',
      description: 'Ajoutez des notes et commentaires sur chaque produit',
      free: '❌',
      premium: '✅ Bientôt',
    },
    {
      icon: '🔄',
      title: 'Partage de stock',
      description: 'Partagez votre inventaire avec vos collaborateurs',
      free: '❌',
      premium: '✅ Bientôt',
    },
    {
      icon: '📜',
      title: 'Historique illimité',
      description: 'Conservez tous vos scans sans limite de temps',
      free: '❌',
      premium: '✅ Bientôt',
    },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* En-tête */}
        <View className="bg-gradient-to-br from-primary to-blue-600 p-6 gap-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-lg">← Retour</Text>
            </TouchableOpacity>
            {subscription.isPremium && (
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-bold">✨ PREMIUM</Text>
              </View>
            )}
          </View>
          <Text className="text-3xl font-bold text-white">PhytoCheck Premium</Text>
          <Text className="text-base text-white opacity-90">
            Débloquez toutes les fonctionnalités avancées
          </Text>
        </View>

        {/* Liste des fonctionnalités */}
        <View className="p-6 gap-4">
          {features.map((feature, index) => (
            <View
              key={index}
              className="bg-surface rounded-xl p-4 border border-border"
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-3xl">{feature.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-muted mb-2">
                    {feature.description}
                  </Text>
                  <View className="flex-row gap-4">
                    <View>
                      <Text className="text-xs text-muted">Gratuit</Text>
                      <Text className="text-sm font-medium text-foreground">
                        {feature.free}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted">Premium</Text>
                      <Text className="text-sm font-medium text-primary">
                        {feature.premium}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bouton d'action */}
        <View className="p-6 pt-0">
          {!subscription.isPremium ? (
            <>
              {isLoadingProducts ? (
                <View className="items-center p-8">
                  <ActivityIndicator size="large" color="#0a7ea4" />
                  <Text className="text-muted text-sm mt-2">Chargement des offres...</Text>
                </View>
              ) : products.length > 0 ? (
                <>
                  {/* Afficher les produits disponibles */}
                  {products.map((product, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePurchase(product.productId)}
                      disabled={isPurchasing}
                      className="bg-primary rounded-xl p-4 mb-3 active:opacity-80"
                    >
                      <Text className="text-center text-white text-lg font-bold">
                        {product.title || 'PhytoCheck Premium'}
                      </Text>
                      <Text className="text-center text-white text-sm mt-1">
                        {product.localizedPrice || product.price} / {product.productId.includes('yearly') ? 'an' : 'mois'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Bouton Restaurer */}
                  <TouchableOpacity
                    onPress={handleRestore}
                    disabled={isPurchasing}
                    className="bg-surface rounded-xl p-3 border border-border active:opacity-70 mt-2"
                  >
                    <Text className="text-center text-muted text-sm font-medium">
                      Déjà abonné ? Restaurer mes achats
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Mode test : activation gratuite */}
                  <View className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                    <Text className="text-sm text-blue-700 text-center font-medium">
                      🎉 Mode test : Activation gratuite disponible
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleUpgradeTest}
                    className="bg-primary rounded-xl p-4 active:opacity-80"
                  >
                    <Text className="text-center text-white text-lg font-bold">
                      ✨ Activer Premium (Test)
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <View className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                <Text className="text-sm text-green-700 text-center font-medium">
                  ✅ Vous avez accès à toutes les fonctionnalités Premium
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleDowngrade}
                className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
              >
                <Text className="text-center text-muted text-base font-medium">
                  Revenir à la version gratuite
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Mentions */}
        <View className="p-6 pt-0">
          <Text className="text-xs text-muted text-center">
            Les fonctionnalités marquées "Bientôt" seront disponibles dans les prochaines mises à jour.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
