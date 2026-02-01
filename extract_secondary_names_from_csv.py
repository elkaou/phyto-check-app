#!/usr/bin/env python3
"""
Script pour extraire les noms commerciaux secondaires depuis le fichier CSV E-Phy.
"""

import csv
import json

def main():
    print("="*70)
    print("EXTRACTION DES NOMS SECONDAIRES DEPUIS LE CSV E-PHY")
    print("="*70)
    
    # Dictionnaire pour stocker les noms secondaires
    # Format: { "nom secondaire (minuscules)": "AMM" }
    secondary_names_map = {}
    
    # Statistiques
    total_products = 0
    products_with_secondary = 0
    total_secondary_names = 0
    
    print("\n📂 Lecture du fichier CSV...")
    
    with open('produits_Windows-1252.csv', 'r', encoding='windows-1252') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            total_products += 1
            
            amm = row['numero AMM'].strip()
            nom_principal = row['nom produit'].strip()
            noms_secondaires_str = row['seconds noms commerciaux'].strip()
            statut = row['Etat d\'autorisation'].strip() if 'Etat d\'autorisation' in row else ''
            
            # Si le produit a des noms secondaires
            if noms_secondaires_str:
                products_with_secondary += 1
                
                # Séparer les noms secondaires (séparateur: |)
                noms_secondaires = [n.strip() for n in noms_secondaires_str.split('|') if n.strip()]
                
                for nom_sec in noms_secondaires:
                    # Normaliser en minuscules
                    nom_sec_normalized = nom_sec.lower().strip()
                    
                    if nom_sec_normalized:
                        # Stocker la correspondance
                        secondary_names_map[nom_sec_normalized] = amm
                        total_secondary_names += 1
    
    print(f"✓ {total_products} produits traités")
    print(f"✓ {products_with_secondary} produits avec noms secondaires")
    print(f"✓ {total_secondary_names} noms secondaires extraits")
    
    # Générer le fichier TypeScript
    print("\n📝 Génération du fichier TypeScript...")
    
    ts_content = """/**
 * Base de données complète des noms commerciaux secondaires
 * 
 * Générée automatiquement depuis le fichier CSV E-Phy officiel
 * Source: data.gouv.fr - Catalogue E-Phy
 * 
 * Structure: { "nom secondaire (minuscules)": "AMM" }
 */

export const SECONDARY_NAMES: Record<string, string> = {
"""
    
    # Trier par ordre alphabétique
    for nom_sec in sorted(secondary_names_map.keys()):
        amm = secondary_names_map[nom_sec]
        # Échapper les guillemets et antislash
        nom_sec_escaped = nom_sec.replace('\\', '\\\\').replace('"', '\\"')
        ts_content += f'  "{nom_sec_escaped}": "{amm}",\n'
    
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
    
    output_ts = '../lib/secondary-names.ts'
    with open(output_ts, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"✓ Fichier TypeScript généré: {output_ts}")
    print(f"✓ Nombre de noms secondaires: {len(secondary_names_map)}")
    
    # Sauvegarder aussi en JSON pour référence
    output_json = 'secondary_names_complete.json'
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(secondary_names_map, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Fichier JSON sauvegardé: {output_json}")
    
    print("\n✅ Extraction terminée!")

if __name__ == '__main__':
    main()
