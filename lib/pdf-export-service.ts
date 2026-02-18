import * as FileSystem from 'expo-file-system/legacy';
import { InventoryItem } from './types';

/**
 * Service d'export du stock
 * Génère un fichier texte structuré compatible avec le partage mobile
 */

export async function generateStockPDF(
  inventory: InventoryItem[],
  retiredProducts: InventoryItem[],
  authorizedProducts: InventoryItem[]
): Promise<string> {
  // Séparer les produits par catégorie
  const cmrProducts = inventory.filter(item => item.isCMR === true);
  const ppnuProducts = retiredProducts;
  const authorizedNonCMR = authorizedProducts.filter(item => !item.isCMR);

  // Calculer les quantités totales
  const totalPPNU_L = ppnuProducts
    .filter(item => item.unit === 'L')
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalPPNU_kg = ppnuProducts
    .filter(item => item.unit === 'kg')
    .reduce((sum, item) => sum + item.quantity, 0);

  const totalAuthorized_L = authorizedProducts
    .filter(item => item.unit === 'L')
    .reduce((sum, item) => sum + item.quantity, 0);
  const totalAuthorized_kg = authorizedProducts
    .filter(item => item.unit === 'kg')
    .reduce((sum, item) => sum + item.quantity, 0);

  // Générer le contenu texte structuré
  const content = `
═══════════════════════════════════════════════════════════
                      📱 PHYTOCHECK
    Vérification de l'homologation des produits phytosanitaires
═══════════════════════════════════════════════════════════

📅 DATE D'EXPORT
${new Date().toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})} à ${new Date().toLocaleTimeString('fr-FR')}

───────────────────────────────────────────────────────────
📊 RÉSUMÉ DU STOCK
───────────────────────────────────────────────────────────

✓ PRODUITS HOMOLOGUÉS : ${authorizedProducts.length}
  Quantité totale : ${totalAuthorized_L.toFixed(1)} L + ${totalAuthorized_kg.toFixed(1)} kg

⚠️  PRODUITS PPNU (À RETIRER) : ${ppnuProducts.length}
  Quantité totale : ${totalPPNU_L.toFixed(1)} L + ${totalPPNU_kg.toFixed(1)} kg

⚠️  PRODUITS CMR : ${cmrProducts.length}
  (Cancérogène/Mutagène/Reprotoxique)

${cmrProducts.length > 0 ? `
🚨 ATTENTION : Votre stock contient ${cmrProducts.length} produit(s) classé(s) 
CMR nécessitant des précautions particulières de manipulation et 
d'élimination.
` : ''}

${ppnuProducts.length > 0 ? `
═══════════════════════════════════════════════════════════
⚠️  PRODUITS À RETIRER (PPNU)
═══════════════════════════════════════════════════════════

Ces produits ont été retirés du marché et ne doivent plus être 
utilisés. Ils doivent être éliminés conformément à la réglementation.

${ppnuProducts.map((item, index) => {
  const displayName = item.commercialName || item.name;
  const officialName = item.commercialName ? `\n   Nom officiel : ${item.name}` : '';
  const cmrBadge = item.isCMR ? ' ⚠️ CMR' : '';
  return `
${index + 1}. ${displayName}${cmrBadge}${officialName}
   N° AMM : ${item.amm}
   Quantité : ${item.quantity} ${item.unit}`;
}).join('\n')}
` : ''}

${authorizedProducts.length > 0 ? `
═══════════════════════════════════════════════════════════
✓ PRODUITS HOMOLOGUÉS
═══════════════════════════════════════════════════════════

Ces produits sont autorisés à la vente et à l'utilisation en France.

${authorizedProducts.map((item, index) => {
  const displayName = item.commercialName || item.name;
  const officialName = item.commercialName ? `\n   Nom officiel : ${item.name}` : '';
  const cmrBadge = item.isCMR ? ' ⚠️ CMR' : '';
  return `
${index + 1}. ${displayName}${cmrBadge}${officialName}
   N° AMM : ${item.amm}
   Quantité : ${item.quantity} ${item.unit}`;
}).join('\n')}
` : ''}

${cmrProducts.length > 0 ? `
═══════════════════════════════════════════════════════════
⚠️  PRODUITS CMR (Cancérogène/Mutagène/Reprotoxique)
═══════════════════════════════════════════════════════════

Ces produits contiennent des substances classées CMR et nécessitent 
des précautions particulières de manipulation, stockage et élimination.

${cmrProducts.map((item, index) => {
  const displayName = item.commercialName || item.name;
  const officialName = item.commercialName ? `\n   Nom officiel : ${item.name}` : '';
  const status = item.status === 'RETIRED' ? 'PPNU (À retirer)' : 'Homologué';
  return `
${index + 1}. ${displayName}${officialName}
   N° AMM : ${item.amm}
   Statut : ${status}
   Quantité : ${item.quantity} ${item.unit}`;
}).join('\n')}
` : ''}

═══════════════════════════════════════════════════════════
ℹ️  INFORMATIONS
═══════════════════════════════════════════════════════════

PhytoCheck - Outil de vérification de l'homologation des produits 
phytopharmaceutiques

Base de données E-Phy mise à jour le 21/01/2026
15 042 produits référencés

Ce document est généré automatiquement et ne constitue pas un 
document officiel. Pour toute question réglementaire, consultez 
le site officiel E-Phy : https://ephy.anses.fr

═══════════════════════════════════════════════════════════
`;

  // Sauvegarder le fichier
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `${FileSystem.documentDirectory}PhytoCheck_Stock_${timestamp}.txt`;
  await FileSystem.writeAsStringAsync(filename, content);

  return filename;
}
