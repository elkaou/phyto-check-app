import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import pako from 'pako';
import { Product, SearchResult, EphyDatabase } from './types';

let ephyDatabase: EphyDatabase | null = null;
let isLoading = false;

/**
 * Charge la base de données E-Phy depuis le fichier compressé
 */
export async function loadEphyDatabase(): Promise<EphyDatabase> {
  if (ephyDatabase) {
    return ephyDatabase;
  }

  // Éviter les chargements multiples simultanés
  if (isLoading) {
    // Attendre que le chargement en cours se termine
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ephyDatabase) {
      return ephyDatabase;
    }
  }

  isLoading = true;

  try {
    // Charger le fichier depuis les assets avec Asset.fromModule
    const asset = Asset.fromModule(require('../assets/data/ephy-products.json.gz'));
    
    // Télécharger l'asset si nécessaire
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }

    if (!asset.localUri) {
      throw new Error('Impossible de charger le fichier E-Phy');
    }

    // Lire le fichier compressé en base64
    const fileContent = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Décompresser
    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: 'string' });
    const data = JSON.parse(decompressed) as EphyDatabase;

    ephyDatabase = data;
    console.log(`Base E-Phy chargée: ${data.total} produits (version ${data.version})`);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement de la base E-Phy:', error);
    // Retourner une base de données vide en cas d'erreur
    const emptyDb: EphyDatabase = {
      version: '0.0.0',
      total: 0,
      products: [],
      index: {
        by_amm: {},
        by_name: {},
      },
    };
    ephyDatabase = emptyDb;
    return emptyDb;
  } finally {
    isLoading = false;
  }
}

/**
 * Recherche un produit par numéro AMM
 */
export async function searchByAMM(amm: string): Promise<Product | null> {
  const db = await loadEphyDatabase();
  return db.index.by_amm[amm] || null;
}

/**
 * Normalise une chaîne pour la recherche (supprime accents, caractères spéciaux, espaces multiples)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s]/g, ' ') // Remplace les caractères spéciaux par des espaces
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .trim();
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes (similarité)
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Recherche des produits par nom avec recherche floue
 */
export async function searchByName(query: string): Promise<SearchResult[]> {
  const db = await loadEphyDatabase();
  const queryNormalized = normalizeString(query);
  
  if (!queryNormalized) {
    return [];
  }

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // 0. Recherche dans les noms secondaires (prioritaire)
  const { getAMMFromSecondaryName, isSecondaryName } = await import('./secondary-names');
  if (isSecondaryName(query)) {
    const amm = getAMMFromSecondaryName(query);
    if (amm) {
      const product = db.index.by_amm[amm];
      if (product) {
        results.push({ product, matchType: 'exact', matchedName: query });
        seen.add(product.amm);
        // Retourner immédiatement si trouvé dans les noms secondaires
        return results;
      }
    }
  }

  // 1. Recherche exacte (normalisée)
  for (const [name, products] of Object.entries(db.index.by_name)) {
    const nameNormalized = normalizeString(name);
    if (nameNormalized === queryNormalized) {
      products.forEach((product) => {
        if (!seen.has(product.amm)) {
          results.push({ product, matchType: 'exact', matchedName: name });
          seen.add(product.amm);
        }
      });
    }
  }

  // 2. Recherche partielle (contient la requête)
  if (results.length < 10) {
    for (const [name, products] of Object.entries(db.index.by_name)) {
      const nameNormalized = normalizeString(name);
      if (nameNormalized.includes(queryNormalized) && nameNormalized !== queryNormalized) {
        products.forEach((product) => {
          if (!seen.has(product.amm)) {
            results.push({ product, matchType: 'partial', matchedName: name });
            seen.add(product.amm);
          }
        });
      }
      if (results.length >= 10) break;
    }
  }

  // 3. Recherche floue (distance de Levenshtein) - STRICTE
  if (results.length < 5) {
    const fuzzyMatches: Array<{ product: Product; distance: number; matchedName: string }> = [];
    
    for (const [name, products] of Object.entries(db.index.by_name)) {
      const nameNormalized = normalizeString(name);
      const distance = levenshteinDistance(queryNormalized, nameNormalized);
      
      // Recherche floue BEAUCOUP PLUS STRICTE pour éviter les faux positifs
      // Accepter uniquement si distance <= 2 OU distance relative < 15%
      // ET la longueur des chaînes est similaire (±30%)
      const maxDistance = Math.min(2, Math.floor(queryNormalized.length * 0.15));
      const lengthDiff = Math.abs(queryNormalized.length - nameNormalized.length);
      const maxLengthDiff = Math.ceil(queryNormalized.length * 0.3);
      
      if (distance <= maxDistance && lengthDiff <= maxLengthDiff) {
        products.forEach((product) => {
          if (!seen.has(product.amm)) {
            fuzzyMatches.push({ product, distance, matchedName: name });
          }
        });
      }
    }

    // Trier par distance et ajouter les meilleurs résultats
    fuzzyMatches
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .forEach(({ product, matchedName }) => {
        results.push({ product, matchType: 'fuzzy', matchedName });
        seen.add(product.amm);
      });
  }

  return results.slice(0, 10);
}

/**
 * Récupère les informations d'un produit par son code-barres (AMM)
 */
export async function getProductInfo(barcode: string): Promise<Product | null> {
  // Essayer de matcher directement avec AMM
  const product = await searchByAMM(barcode);
  if (product) {
    return product;
  }

  // Si pas de match direct, essayer comme recherche textuelle
  const results = await searchByName(barcode);
  return results.length > 0 ? results[0].product : null;
}

/**
 * Récupère la version de la base de données
 */
export async function getDatabaseVersion(): Promise<string> {
  const db = await loadEphyDatabase();
  return db.version;
}

/**
 * Récupère le nombre total de produits
 */
export async function getTotalProducts(): Promise<number> {
  const db = await loadEphyDatabase();
  return db.total;
}
