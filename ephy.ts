import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as readline from 'readline';

const execAsync = promisify(exec);

const EPHY_ZIP_URL = 'https://www.data.gouv.fr/api/1/datasets/r/98f7cac6-6b29-4859-8739-51b825196959';

/**
 * Normalise un nom de produit
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[®™©°]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCSVLine(line: string, delimiter: string = ';'): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

/**
 * Traite le fichier CSV en streaming pour éviter les problèmes de mémoire
 */
async function processCSV(csvPath: string): Promise<{
  products: any[];
  secondaryNames: Record<string, string>;
}> {
  return new Promise((resolve, reject) => {
    const products: any[] = [];
    const secondaryNames: Record<string, string> = {};
    const productsMap = new Map<string, any>();
    
    let headers: string[] = [];
    let ammIndex = -1;
    let nameIndex = -1;
    let secondaryNamesIndex = -1;
    let statusIndex = -1;
    let withdrawalDateIndex = -1;
    let functionIndex = -1;
    let isFirstLine = true;
    
    const fileStream = fs.createReadStream(csvPath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    
    rl.on('line', (line) => {
      if (!line.trim()) return;
      
      // Première ligne = headers
      if (isFirstLine) {
        headers = parseCSVLine(line);
        ammIndex = headers.findIndex(h => h.toLowerCase().includes('numero amm'));
        nameIndex = headers.findIndex(h => h.toLowerCase().includes('nom produit'));
        secondaryNamesIndex = headers.findIndex(h => h.toLowerCase().includes('seconds noms'));
        statusIndex = headers.findIndex(h => h.toLowerCase().includes('etat'));
        withdrawalDateIndex = headers.findIndex(h => h.toLowerCase().includes('date de retrait'));
        functionIndex = headers.findIndex(h => h.toLowerCase().includes('fonction'));
        isFirstLine = false;
        return;
      }
      
      const fields = parseCSVLine(line);
      
      const amm = fields[ammIndex]?.trim();
      const name = fields[nameIndex]?.trim();
      const secondaryNamesStr = fields[secondaryNamesIndex]?.trim();
      const withdrawalDate = fields[withdrawalDateIndex]?.trim();
      const functionName = fields[functionIndex]?.trim();
      
      if (!amm || !name) return;
      
      // Créer le produit (structure simplifiée pour réduire la taille)
      const product = {
        amm,
        name,
        normalizedName: normalizeName(name),
        status: !withdrawalDate || withdrawalDate === '' ? 'AUTORISÉ' : 'RETIRÉ',
        withdrawalDate: withdrawalDate || null,
        function: functionName || 'Non spécifié',
      };
      
      productsMap.set(amm, product);
      
      // Extraire les noms secondaires
      if (secondaryNamesStr) {
        const secNames = secondaryNamesStr.split('|').map(n => n.trim()).filter(n => n);
        for (const secName of secNames) {
          const normalized = normalizeName(secName);
          secondaryNames[normalized] = amm;
        }
      }
    });
    
    rl.on('close', () => {
      products.push(...Array.from(productsMap.values()));
      resolve({ products, secondaryNames });
    });
    
    rl.on('error', (error) => {
      reject(error);
    });
  });
}

export const ephyRouter = router({
  /**
   * Met à jour la base de données E-Phy depuis data.gouv.fr
   */
  updateDatabase: publicProcedure.mutation(async () => {
    let tempDir: string | null = null;
    
    try {
      console.log('[E-Phy Server] Starting update...');
      
      // Créer un répertoire temporaire
      tempDir = path.join(os.tmpdir(), `ephy_${Date.now()}`);
      fs.mkdirSync(tempDir, { recursive: true });
      
      const zipPath = path.join(tempDir, 'ephy.zip');
      const extractDir = path.join(tempDir, 'extracted');
      
      console.log('[E-Phy Server] Downloading ZIP...');
      
      // Télécharger le fichier ZIP
      const response = await axios.get(EPHY_ZIP_URL, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'PhytoCheck/1.0',
        },
        timeout: 60000, // 60 secondes
        maxContentLength: 50 * 1024 * 1024, // 50 MB max
      });
      
      fs.writeFileSync(zipPath, response.data);
      console.log('[E-Phy Server] ZIP downloaded, extracting...');
      
      // Extraire le ZIP avec unzip
      fs.mkdirSync(extractDir, { recursive: true });
      await execAsync(`unzip -q "${zipPath}" -d "${extractDir}"`);
      
      console.log('[E-Phy Server] ZIP extracted, finding CSV...');
      
      // Trouver le fichier CSV
      const files = fs.readdirSync(extractDir);
      const csvFile = files.find(f => f.includes('produits') && f.includes('Windows-1252'));
      
      if (!csvFile) {
        throw new Error('Fichier CSV non trouvé dans l\'archive');
      }
      
      const csvPath = path.join(extractDir, csvFile);
      console.log('[E-Phy Server] Processing CSV:', csvFile);
      
      // Traiter le CSV en streaming
      const { products, secondaryNames } = await processCSV(csvPath);
      
      console.log(`[E-Phy Server] Processed ${products.length} products and ${Object.keys(secondaryNames).length} secondary names`);
      
      // Créer l'index de recherche (structure simplifiée)
      const byName = new Map<string, any[]>();
      const byAMM = new Map<string, any>();
      
      for (const product of products) {
        byAMM.set(product.amm, product);
        
        const normalized = product.normalizedName;
        if (!byName.has(normalized)) {
          byName.set(normalized, []);
        }
        byName.get(normalized)!.push(product);
      }
      
      // Créer la base de données complète
      const database = {
        products,
        index: {
          by_name: Object.fromEntries(byName),
          by_amm: Object.fromEntries(byAMM),
        },
        metadata: {
          total_products: products.length,
          total_names: byName.size,
          generated_at: new Date().toISOString(),
        },
      };
      
      console.log('[E-Phy Server] Database created, cleaning up...');
      
      // Nettoyer les fichiers temporaires
      if (tempDir) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      
      console.log('[E-Phy Server] Update completed successfully');
      
      return {
        success: true,
        message: 'Base de données mise à jour avec succès',
        database,
        secondaryNames,
        totalProducts: products.length,
        totalSecondaryNames: Object.keys(secondaryNames).length,
      };
    } catch (error) {
      console.error('[E-Phy Server] Error during update:', error);
      
      // Nettoyer en cas d'erreur
      if (tempDir) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('[E-Phy Server] Cleanup error:', cleanupError);
        }
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        database: null,
        secondaryNames: {},
        totalProducts: 0,
        totalSecondaryNames: 0,
      };
    }
  }),
});
