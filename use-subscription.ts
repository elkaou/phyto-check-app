import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iapService } from '@/lib/iap-service';

const SUBSCRIPTION_KEY = 'phytocheck_subscription';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isPremium: boolean;
  features: {
    unlimitedStock: boolean;
    pdfExport: boolean;
    advancedStats: boolean;
    expirationAlerts: boolean;
    multiSite: boolean;
    unlimitedHistory: boolean;
    customNotes: boolean;
    shareStock: boolean;
  };
}

const FREE_FEATURES = {
  unlimitedStock: false,
  pdfExport: false,
  advancedStats: false,
  expirationAlerts: false,
  multiSite: false,
  unlimitedHistory: false,
  customNotes: false,
  shareStock: false,
};

const PREMIUM_FEATURES = {
  unlimitedStock: true,
  pdfExport: true,
  advancedStats: true,
  expirationAlerts: true,
  multiSite: true,
  unlimitedHistory: true,
  customNotes: true,
  shareStock: true,
};

export const FREE_STOCK_LIMIT = 10;

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    tier: 'free',
    isPremium: false,
    features: FREE_FEATURES,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      // Initialiser IAP
      await iapService.initialize();
      
      // Vérifier le statut d'abonnement via IAP
      const hasActiveSubscription = await iapService.checkSubscriptionStatus();
      
      if (hasActiveSubscription) {
        // Sauvegarder dans AsyncStorage pour cache
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, 'premium');
        setSubscription({
          tier: 'premium',
          isPremium: true,
          features: PREMIUM_FEATURES,
        });
      } else {
        // Vérifier le cache local (pour mode test)
        const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
        if (stored === 'premium') {
          setSubscription({
            tier: 'premium',
            isPremium: true,
            features: PREMIUM_FEATURES,
          });
        } else {
          setSubscription({
            tier: 'free',
            isPremium: false,
            features: FREE_FEATURES,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'abonnement:', error);
      // En cas d'erreur, vérifier le cache local
      try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
        if (stored === 'premium') {
          setSubscription({
            tier: 'premium',
            isPremium: true,
            features: PREMIUM_FEATURES,
          });
        }
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToPremium = async () => {
    try {
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, 'premium');
      setSubscription({
        tier: 'premium',
        isPremium: true,
        features: PREMIUM_FEATURES,
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'upgrade:', error);
      return false;
    }
  };

  const downgradeToFree = async () => {
    try {
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, 'free');
      setSubscription({
        tier: 'free',
        isPremium: false,
        features: FREE_FEATURES,
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du downgrade:', error);
      return false;
    }
  };

  return {
    subscription,
    isLoading,
    upgradeToPremium,
    downgradeToFree,
  };
}
