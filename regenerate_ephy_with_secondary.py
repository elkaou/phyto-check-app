#!/usr/bin/env python3
"""
Régénérer la base E-Phy avec les noms secondaires inclus dans chaque produit
"""

import csv
import json
import gzip
from collections import defaultdict

def normalize_name(name):
    """Normaliser un nom pour la recherche"""
    return name.lower().replace('®', '').replace('™', '').replace('©', '').strip()

def main():
    print("="*70)
    print("RÉGÉNÉRATION DE LA BASE E-PHY AVEC NOMS SECONDAIRES")
    print("="*70)
    
    products_by_amm = {}
    index_by_name = defaultdict(list)
    
    print("\n📂 Lecture du fichier CSV...")
    
    with open('produits_Windows-1252.csv', 'r', encoding='windows-1252') as f:
        reader = csv.DictReader(f, delimiter=';')
        
        for row in reader:
            amm = row['numero AMM'].strip()
            name = row['nom produit'].strip()
            secondary_names_str = row['seconds noms commerciaux'].strip()
            # Trouver la colonne du statut de manière flexible
            status_raw = ''
            for key in row.keys():
                if 'autorisation' in key.lower() and 'etat' in key.lower():
                    status_raw = row[key].strip()
                    break
            withdrawal_date = row.get('Date de retrait du produit', '').strip()
            substances = row.get('Substances actives', '').strip()
            function = row.get('fonctions', '').strip()
            formulation = row.get('formulations', '').strip()
            holder = row.get('titulaire', '').strip()
            
            # Déterminer le statut
            status_normalized = status_raw.upper().strip()
            if 'AUTORISE' in status_normalized or 'AUTHORIZED' in status_normalized:
                status = 'AUTHORIZED'
            elif 'RETIRE' in status_normalized or 'RETIRED' in status_normalized:
                status = 'RETIRED'
            else:
                status = 'NOT_FOUND'
            
            # Extraire les noms secondaires
            secondary_names = []
            if secondary_names_str:
                secondary_names = [n.strip() for n in secondary_names_str.split('|') if n.strip()]
            
            # Créer le produit
            product = {
                'amm': amm,
                'name': name,
                'secondaryNames': secondary_names if secondary_names else None,
                'status': status,
                'withdrawal_date': withdrawal_date if withdrawal_date else None,
                'substances': substances,
                'function': function,
                'formulation': formulation,
                'holder': holder,
            }
            
            # Stocker par AMM (un seul produit par AMM)
            products_by_amm[amm] = product
            
            # Indexer par nom principal
            name_normalized = normalize_name(name)
            index_by_name[name_normalized].append(product)
            
            # Indexer par noms secondaires
            for sec_name in secondary_names:
                sec_name_normalized = normalize_name(sec_name)
                index_by_name[sec_name_normalized].append(product)
    
    print(f"✓ {len(products_by_amm)} produits uniques traités")
    print(f"✓ {len(index_by_name)} entrées dans l'index de noms")
    
    # Créer la structure finale
    database = {
        'version': '2026-01-27',
        'total': len(products_by_amm),
        'products': list(products_by_amm.values()),
        'index': {
            'by_amm': products_by_amm,
            'by_name': dict(index_by_name),
        }
    }
    
    # Sauvegarder en JSON compressé
    output_file = '../assets/data/ephy-products.json.gz'
    print(f"\n📝 Sauvegarde dans {output_file}...")
    
    with gzip.open(output_file, 'wt', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, separators=(',', ':'))
    
    print(f"✓ Base E-Phy régénérée avec succès!")
    print(f"✓ Taille du fichier: {len(products_by_amm)} produits")
    
    # Vérifier CENTURION R
    centurion = products_by_amm.get('9900115')
    if centurion:
        print(f"\n✓ Vérification CENTURION R (9900115):")
        print(f"  - Nom: {centurion['name']}")
        print(f"  - Noms secondaires: {centurion['secondaryNames']}")
        print(f"  - Statut: {centurion['status']}")
    
    print("\n✅ Régénération terminée!")

if __name__ == '__main__':
    main()
