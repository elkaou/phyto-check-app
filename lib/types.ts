/**
 * Types pour l'application PhytoCheck
 */

export type ProductStatus = 'AUTHORIZED' | 'RETIRED' | 'NOT_FOUND';

export interface Product {
  amm: string;
  name: string;
  secondaryNames?: string[]; // Noms commerciaux secondaires
  status: ProductStatus;
  withdrawal_date?: string | null;
  substances: string;
  function: string;
  formulation: string;
  holder: string;
}

export interface ScanHistory {
  id: string;
  amm: string;
  name: string;
  status: ProductStatus;
  scannedAt: number; // timestamp
  barcode: string;
}

export interface InventoryItem {
  id: string;
  amm: string;
  name: string; // Nom officiel du produit
  commercialName?: string; // Nom commercial scanné (si différent du nom officiel)
  status: ProductStatus;
  addedAt: number; // timestamp
  quantity: number;
  unit: 'L' | 'kg';
  location?: string;
  isCMR?: boolean; // Produit classé CMR (Cancérogène, Mutagène, Reprotoxique)
}

export interface EphyDatabase {
  version: string;
  total: number;
  products: Product[];
  index: {
    by_amm: Record<string, Product>;
    by_name: Record<string, Product[]>;
  };
}

export interface SearchResult {
  product: Product;
  matchType: 'exact' | 'partial' | 'fuzzy';
  matchedName?: string; // Nom qui a matché la recherche (peut différer du nom principal)
}
