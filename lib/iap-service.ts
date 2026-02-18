import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Détecter si on est dans Expo Go
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Imports conditionnels pour éviter les erreurs sur web et Expo Go
let initConnection: any;
let endConnection: any;
let fetchProducts: any;
let requestPurchase: any;
let purchaseUpdatedListener: any;
let purchaseErrorListener: any;
let finishTransaction: any;
let getAvailablePurchases: any;

// Charger react-native-iap uniquement si on n'est pas sur web ni dans Expo Go
if (Platform.OS !== 'web' && !isExpoGo) {
  try {
    const iap = require('react-native-iap');
    initConnection = iap.initConnection;
    endConnection = iap.endConnection;
    fetchProducts = iap.fetchProducts;
    requestPurchase = iap.requestPurchase;
    purchaseUpdatedListener = iap.purchaseUpdatedListener;
    purchaseErrorListener = iap.purchaseErrorListener;
    finishTransaction = iap.finishTransaction;
    getAvailablePurchases = iap.getAvailablePurchases;
  } catch (error) {
    console.log('[IAP] react-native-iap not available:', error);
  }
}

// IDs des produits d'abonnement (à configurer dans Google Play Console et App Store Connect)
export const SUBSCRIPTION_SKUS = {
  MONTHLY: Platform.select({
    ios: 'phytocheck_premium_monthly',
    android: 'phytocheck_premium_monthly',
  }) as string,
  YEARLY: Platform.select({
    ios: 'phytocheck_premium_yearly',
    android: 'phytocheck_premium_yearly',
  }) as string,
};

class IAPService {
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;
  private isInitialized = false;

  /**
   * Initialise la connexion au store (Google Play ou App Store)
   */
  async initialize(): Promise<boolean> {
    // Désactiver IAP sur web et dans Expo Go
    if (Platform.OS === 'web') {
      console.log('[IAP] Skipping initialization on web');
      return false;
    }
    
    if (isExpoGo) {
      console.log('[IAP] Skipping initialization in Expo Go (use dev build for IAP testing)');
      return false;
    }

    try {
      if (this.isInitialized) {
        console.log('[IAP] Already initialized');
        return true;
      }

      console.log('[IAP] Initializing connection...');
      await initConnection();
      this.isInitialized = true;
      console.log('[IAP] Connection initialized successfully');

      // Écouter les mises à jour d'achat
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: any) => {
          console.log('[IAP] Purchase updated:', purchase);
          const receipt = purchase.transactionId;
          if (receipt) {
            try {
              // Finaliser la transaction
              await finishTransaction({ purchase, isConsumable: false });
              console.log('[IAP] Transaction finished successfully');
            } catch (error) {
              console.error('[IAP] Error finishing transaction:', error);
            }
          }
        }
      );

      // Écouter les erreurs d'achat
      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: any) => {
          console.error('[IAP] Purchase error:', error);
        }
      );

      return true;
    } catch (error) {
      console.error('[IAP] Error initializing:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Récupère les produits d'abonnement disponibles
   */
  async getProducts(): Promise<any[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('[IAP] Fetching subscriptions...');
      const subscriptions = await fetchProducts({
        skus: [SUBSCRIPTION_SKUS.MONTHLY, SUBSCRIPTION_SKUS.YEARLY],
        type: 'subs',
      });
      console.log('[IAP] Subscriptions fetched:', subscriptions);
      return subscriptions || [];
    } catch (error) {
      console.error('[IAP] Error fetching products:', error);
      return [];
    }
  }

  /**
   * Achète un abonnement
   */
  async purchaseSubscription(sku: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('[IAP] Requesting subscription:', sku);
      await requestPurchase({
        request: Platform.select({
          ios: { productId: sku },
          android: { skus: [sku] },
        }) as any,
        type: 'subs',
      });
      return true;
    } catch (error) {
      console.error('[IAP] Error purchasing subscription:', error);
      return false;
    }
  }

  /**
   * Vérifie si l'utilisateur a un abonnement actif
   */
  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('[IAP] Checking subscription status...');
      const purchases = await getAvailablePurchases();
      console.log('[IAP] Available purchases:', purchases);

      // Vérifier si l'utilisateur a un abonnement actif
      const hasActiveSubscription = purchases.some((purchase: any) => {
        const isSubscription =
          purchase.productId === SUBSCRIPTION_SKUS.MONTHLY ||
          purchase.productId === SUBSCRIPTION_SKUS.YEARLY;
        
        // Sur Android, vérifier si l'abonnement n'est pas expiré
        if (Platform.OS === 'android' && 'autoRenewingAndroid' in purchase) {
          return isSubscription && (purchase as any).autoRenewingAndroid;
        }
        
        // Sur iOS, vérifier la date d'expiration
        if (Platform.OS === 'ios' && purchase.transactionDate) {
          const purchaseDate = new Date(typeof purchase.transactionDate === 'number' ? purchase.transactionDate : parseInt(purchase.transactionDate));
          const now = new Date();
          // Considérer l'abonnement actif s'il a été acheté dans les 31 derniers jours (mensuel)
          // ou 366 derniers jours (annuel)
          const daysSincePurchase = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
          const maxDays = purchase.productId === SUBSCRIPTION_SKUS.YEARLY ? 366 : 31;
          return isSubscription && daysSincePurchase < maxDays;
        }
        
        return isSubscription;
      });

      console.log('[IAP] Has active subscription:', hasActiveSubscription);
      return hasActiveSubscription;
    } catch (error) {
      console.error('[IAP] Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Restaure les achats précédents
   */
  async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('[IAP] Restoring purchases...');
      const purchases = await getAvailablePurchases();
      console.log('[IAP] Restored purchases:', purchases);
      
      const hasSubscription = purchases.some(
        (purchase: any) =>
          purchase.productId === SUBSCRIPTION_SKUS.MONTHLY ||
          purchase.productId === SUBSCRIPTION_SKUS.YEARLY
      );
      
      return hasSubscription;
    } catch (error) {
      console.error('[IAP] Error restoring purchases:', error);
      return false;
    }
  }

  /**
   * Ferme la connexion au store
   */
  async disconnect(): Promise<void> {
    try {
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }
      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }
      await endConnection();
      this.isInitialized = false;
      console.log('[IAP] Connection closed');
    } catch (error) {
      console.error('[IAP] Error disconnecting:', error);
    }
  }
}

// Export singleton
export const iapService = new IAPService();
