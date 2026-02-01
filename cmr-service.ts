import { CMR_AMM_LIST, CMR_TOTAL } from './cmr-data';

/**
 * Service pour détecter les produits CMR (Cancérogènes, Mutagènes, Reprotoxiques)
 * 
 * Les produits CMR sont identifiés par les phrases de risque suivantes :
 * - H340 : Peut provoquer des anomalies génétiques (Mutagène cat. 1)
 * - H341 : Susceptible de provoquer des anomalies génétiques (Mutagène cat. 2)
 * - H350 : Peut provoquer le cancer (Cancérogène cat. 1)
 * - H351 : Susceptible de provoquer le cancer (Cancérogène cat. 2)
 * - H360 : Peut nuire à la fertilité ou au fœtus (Reprotoxique cat. 1)
 * - H362 : Peut être nocif pour les bébés nourris au lait maternel (Reprotoxique)
 */

// Set des AMM CMR pour une recherche rapide
const cmrAmmSet = new Set(CMR_AMM_LIST);

// Log pour débogage
console.log('[CMR Service] Initialisé avec', CMR_TOTAL, 'produits CMR');
console.log('[CMR Service] Exemple: 2140098 (BIWIX) est CMR?', cmrAmmSet.has('2140098'));

/**
 * Vérifie si un produit est classé CMR
 * @param amm - Numéro AMM du produit
 * @returns true si le produit est CMR, false sinon
 */
export function isProductCMR(amm: string): boolean {
  const isCMR = cmrAmmSet.has(amm);
  console.log(`[CMR Service] Vérification AMM ${amm}: ${isCMR ? 'CMR' : 'non-CMR'}`);
  return isCMR;
}

/**
 * Récupère le nombre total de produits CMR
 * @returns Le nombre de produits CMR dans la base
 */
export function getTotalCMRProducts(): number {
  return CMR_TOTAL;
}

/**
 * Récupère la liste complète des AMM CMR
 * @returns Array des numéros AMM des produits CMR
 */
export function getAllCMRAmm(): string[] {
  return Array.from(cmrAmmSet);
}
