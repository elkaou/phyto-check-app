import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import { getApiBaseUrl } from '@/constants/oauth';

const LAST_UPDATE_KEY = 'phytocheck_last_update';
const EPHY_DATABASE_PATH = `${FileSystem.documentDirectory}ephy-database.json`;
const SECONDARY_NAMES_PATH = `${FileSystem.documentDirectory}secondary-names.json`;

export interface UpdateStatus {
  isUpdating: boolean;
  progress: number; // 0-100
  lastUpdate: number | null;
  error: string | null;
}

/**
 * Récupère la date de la dernière mise à jour
 */
export async function getLastUpdateDate(): Promise<Date | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_UPDATE_KEY);
    if (timestamp) {
      return new Date(parseInt(timestamp));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la date de mise à jour:', error);
  }
  return null;
}

/**
 * Formate la date de dernière mise à jour pour l'affichage
 */
export function formatLastUpdate(date: Date | null): string {
  if (!date) {
    return 'Jamais mise à jour';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return 'À l\'instant';
  } else if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR');
  }
}

/**
 * Vérifie si une mise à jour est disponible (données de plus de 7 jours)
 */
export async function isUpdateAvailable(): Promise<boolean> {
  const lastUpdate = await getLastUpdateDate();
  if (!lastUpdate) {
    return true; // Première utilisation
  }

  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 7;
}

/**
 * Télécharge et traite les dernières données E-Phy depuis data.gouv.fr
 * Le traitement du ZIP et du CSV est fait côté serveur
 */
export async function updateEphyData(
  onProgress?: (progress: number, message: string) => void
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.(0, 'Démarrage de la mise à jour...');
    
    // Appeler le serveur pour télécharger et traiter les données
    onProgress?.(10, 'Téléchargement depuis data.gouv.fr...');
    
    // Utiliser axios pour appeler l'API tRPC directement
    const apiUrl = getApiBaseUrl();
    console.log('[E-Phy Update] Calling API:', `${apiUrl}/api/trpc/ephy.updateDatabase`);
    
    const response = await axios.post(`${apiUrl}/api/trpc/ephy.updateDatabase`, {
      json: {},
    }, {
      timeout: 120000, // 2 minutes
    });
    
    console.log('[E-Phy Update] Response status:', response.status);
    console.log('[E-Phy Update] Response data structure:', Object.keys(response.data));
    
    // La structure de réponse tRPC est: response.data[0].result.data
    const result = response.data[0]?.result?.data || response.data.result?.data || response.data;
    
    console.log('[E-Phy Update] Full result object:', JSON.stringify(result, null, 2));
    console.log('[E-Phy Update] Parsed result:', { success: result.success, hasDatabase: !!result.database });
    
    if (!result.success || !result.database) {
      console.error('[E-Phy Update] Error details:', { 
        success: result.success, 
        message: result.message,
        hasDatabase: !!result.database,
        resultKeys: Object.keys(result)
      });
      throw new Error(result.message || 'Erreur lors de la mise à jour');
    }
    
    onProgress?.(50, 'Sauvegarde de la base de données...');
    
    // Sauvegarder la base de données localement
    await FileSystem.writeAsStringAsync(
      EPHY_DATABASE_PATH,
      JSON.stringify(result.database),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    onProgress?.(70, 'Sauvegarde des noms secondaires...');
    
    // Sauvegarder les noms secondaires
    await FileSystem.writeAsStringAsync(
      SECONDARY_NAMES_PATH,
      JSON.stringify(result.secondaryNames),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    
    onProgress?.(90, 'Finalisation...');
    
    // Sauvegarder la date de mise à jour
    await AsyncStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
    
    onProgress?.(100, 'Mise à jour terminée !');
    
    return {
      success: true,
      message: `Base de données mise à jour avec succès ! ${result.totalProducts} produits et ${result.totalSecondaryNames} noms secondaires.`,
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    return {
      success: false,
      message: `Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Vérifiez votre connexion Internet.`,
    };
  }
}

/**
 * Récupère le statut de mise à jour
 */
export async function getUpdateStatus(): Promise<UpdateStatus> {
  const lastUpdate = await getLastUpdateDate();
  return {
    isUpdating: false,
    progress: 0,
    lastUpdate: lastUpdate?.getTime() || null,
    error: null,
  };
}
