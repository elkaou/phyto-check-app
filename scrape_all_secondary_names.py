#!/usr/bin/env python3
"""
Script pour extraire TOUS les noms commerciaux secondaires depuis le site E-Phy.
Ce script parcourt tous les produits de la base actuelle et extrait leurs noms secondaires.
"""

import json
import gzip
import time
import re
from urllib.request import urlopen, Request
from urllib.parse import quote
import sys

def get_product_page_html(amm):
    """Récupère la page HTML d'un produit E-Phy par son AMM."""
    # URL directe vers la page du produit
    url = f"https://ephy.anses.fr/ppp/{amm}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    req = Request(url, headers=headers)
    
    try:
        with urlopen(req, timeout=15) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"  ⚠️  Erreur HTTP pour AMM {amm}: {e}", file=sys.stderr)
        return None

def extract_secondary_names(html):
    """Extrait les noms secondaires depuis le HTML de la page produit."""
    if not html:
        return []
    
    # Chercher le pattern: "seconds noms commerciaux : NOM1 , NOM2 , NOM3"
    # Variantes possibles: "second nom commercial", "seconds noms commerciaux"
    patterns = [
        r'seconds?\s+noms?\s+commerciaux?\s*:\s*([^<\n]+)',
        r'Seconds?\s+noms?\s+commerciaux?\s*:\s*([^<\n]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            names_str = match.group(1).strip()
            # Séparer par virgule et nettoyer
            names = [n.strip() for n in names_str.split(',') if n.strip()]
            # Filtrer les noms vides ou trop courts
            names = [n for n in names if len(n) > 2]
            return names
    
    return []

def main():
    """Parcourt tous les produits de la base actuelle et extrait les noms secondaires."""
    
    print("="*70)
    print("EXTRACTION DES NOMS COMMERCIAUX SECONDAIRES DEPUIS E-PHY")
    print("="*70)
    
    # Charger la base actuelle
    print("\n📂 Chargement de la base E-Phy actuelle...")
    with gzip.open('assets/data/ephy-products.json.gz', 'rt', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data['products']
    total = len(products)
    print(f"✓ {total} produits chargés (version {data['version']})")
    
    # Dictionnaire pour stocker les noms secondaires
    # Format: { "AMM": { "primary_name": "...", "secondary_names": [...] } }
    secondary_names_map = {}
    
    # Compteurs
    count_processed = 0
    count_with_secondary = 0
    count_errors = 0
    
    # Limiter à 1000 produits pour commencer
    max_products = min(1000, total)
    
    print(f"\n🔍 Début du scraping de {max_products} produits...")
    print(f"⏱️  Estimation: {max_products * 0.5 / 60:.0f} minutes avec pause de 0.5s entre chaque requête")
    print()
    
    start_time = time.time()
    
    for product in products[:max_products]:
        amm = product['amm']
        name = product['name']
        count_processed += 1
        
        # Afficher la progression tous les 100 produits
        if count_processed % 100 == 0:
            elapsed = time.time() - start_time
            rate = count_processed / elapsed
            remaining = (total - count_processed) / rate
            print(f"[{count_processed}/{max_products}] {count_processed/max_products*100:.1f}% | "
                  f"Trouvés: {count_with_secondary} | "
                  f"Erreurs: {count_errors} | "
                  f"Restant: {remaining/60:.0f}min")
        
        # Récupérer la page du produit
        html = get_product_page_html(amm)
        
        if html:
            # Extraire les noms secondaires
            secondary_names = extract_secondary_names(html)
            
            if secondary_names:
                count_with_secondary += 1
                secondary_names_map[amm] = {
                    'primary_name': name,
                    'secondary_names': secondary_names,
                    'status': product.get('status', 'unknown')
                }
                print(f"  ✓ AMM {amm} ({name}): {', '.join(secondary_names)}")
        else:
            count_errors += 1
        
        # Pause pour ne pas surcharger le serveur
        time.sleep(0.5)
        
        # Sauvegarder tous les 500 produits (checkpoint intermédiaire)
        if count_processed % 500 == 0:
            checkpoint_file = f'scripts/secondary_names_checkpoint_{count_processed}.json'
            with open(checkpoint_file, 'w', encoding='utf-8') as f:
                json.dump(secondary_names_map, f, ensure_ascii=False, indent=2)
            print(f"  💾 Checkpoint sauvegardé: {checkpoint_file}")
    
    # Afficher le résumé final
    elapsed = time.time() - start_time
    print()
    print("="*70)
    print("RÉSUMÉ")
    print("="*70)
    print(f"✓ Produits traités: {count_processed}/{total}")
    print(f"✓ Produits avec noms secondaires: {count_with_secondary}")
    print(f"⚠️  Erreurs: {count_errors}")
    print(f"⏱️  Temps total: {elapsed/60:.1f} minutes")
    print()
    
    # Sauvegarder les résultats finaux
    output_file = 'scripts/secondary_names_complete.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(secondary_names_map, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Résultats sauvegardés dans: {output_file}")
    print(f"📊 Taille du fichier: {len(json.dumps(secondary_names_map))/1024:.1f} KB")
    
    # Générer un fichier TypeScript pour l'application
    print("\n📝 Génération du fichier TypeScript...")
    generate_typescript_file(secondary_names_map)
    
    print("\n✅ Extraction terminée!")

def generate_typescript_file(secondary_names_map):
    """Génère un fichier TypeScript avec tous les noms secondaires."""
    
    ts_content = """/**
 * Base de données complète des noms commerciaux secondaires
 * 
 * Générée automatiquement depuis le site E-Phy officiel
 * Date de génération: """ + time.strftime("%Y-%m-%d %H:%M:%S") + """
 * 
 * Structure: { "nom secondaire (minuscules)": "AMM" }
 */

export const SECONDARY_NAMES: Record<string, string> = {
"""
    
    # Créer un dictionnaire plat: nom secondaire -> AMM
    flat_map = {}
    for amm, data in secondary_names_map.items():
        for sec_name in data['secondary_names']:
            # Normaliser en minuscules
            normalized = sec_name.lower().strip()
            if normalized:
                flat_map[normalized] = amm
    
    # Trier par ordre alphabétique
    for sec_name in sorted(flat_map.keys()):
        amm = flat_map[sec_name]
        primary = secondary_names_map[amm]['primary_name']
        # Échapper les guillemets
        sec_name_escaped = sec_name.replace('"', '\\"')
        ts_content += f'  "{sec_name_escaped}": "{amm}", // {primary}\n'
    
    ts_content += """}

/**
 * Recherche un produit par son nom secondaire
 * @param name Nom à rechercher (sera normalisé en minuscules)
 * @returns AMM correspondant ou null si non trouvé
 */
export function getAMMFromSecondaryName(name: string): string | null {
  const normalized = name.toLowerCase().trim();
  return SECONDARY_NAMES[normalized] || null;
}

/**
 * Vérifie si un nom est un nom secondaire connu
 * @param name Nom à vérifier
 * @returns true si c'est un nom secondaire connu
 */
export function isSecondaryName(name: string): boolean {
  const normalized = name.toLowerCase().trim();
  return normalized in SECONDARY_NAMES;
}
"""
    
    output_ts = 'lib/secondary-names-complete.ts'
    with open(output_ts, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"✓ Fichier TypeScript généré: {output_ts}")
    print(f"✓ Nombre de noms secondaires: {len(flat_map)}")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Scraping interrompu par l'utilisateur")
        print("Les checkpoints intermédiaires ont été sauvegardés.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Erreur fatale: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
