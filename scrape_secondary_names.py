#!/usr/bin/env python3
"""
Script pour extraire les noms commerciaux secondaires depuis le site E-Phy.
"""

import json
import gzip
import time
import re
from urllib.request import urlopen, Request
from urllib.parse import quote

def get_product_page(amm):
    """Récupère la page HTML d'un produit E-Phy par son AMM."""
    # On ne peut pas deviner l'URL directe, il faut chercher par AMM
    search_url = f"https://ephy.anses.fr/recherche_avancee/ppp?amm={amm}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = Request(search_url, headers=headers)
    
    try:
        with urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Erreur lors de la récupération de l'AMM {amm}: {e}")
        return None

def extract_secondary_names(html):
    """Extrait les noms secondaires depuis le HTML de la page produit."""
    if not html:
        return []
    
    # Chercher le pattern: "seconds noms commerciaux : NOM1 , NOM2 , NOM3"
    pattern = r'seconds?\s+noms?\s+commerciaux\s*:\s*([^<\n]+)'
    match = re.search(pattern, html, re.IGNORECASE)
    
    if match:
        names_str = match.group(1).strip()
        # Séparer par virgule et nettoyer
        names = [n.strip() for n in names_str.split(',') if n.strip()]
        return names
    
    return []

def main():
    """Parcourt tous les produits de la base actuelle et extrait les noms secondaires."""
    
    # Charger la base actuelle
    print("Chargement de la base E-Phy actuelle...")
    with gzip.open('public/ephy-products.json.gz', 'rt', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data['products']
    print(f"Nombre de produits: {len(products)}")
    
    # Dictionnaire pour stocker les noms secondaires
    secondary_names_map = {}
    
    # Limiter à 100 produits pour un test rapide (enlever cette limite pour tout scraper)
    max_products = 100
    count = 0
    
    for amm, product in products.items():
        if count >= max_products:
            break
        
        count += 1
        print(f"[{count}/{max_products}] Traitement AMM {amm}: {product['name']}")
        
        # Récupérer la page du produit
        html = get_product_page(amm)
        
        if html:
            # Extraire les noms secondaires
            secondary_names = extract_secondary_names(html)
            
            if secondary_names:
                print(f"  → Noms secondaires trouvés: {', '.join(secondary_names)}")
                secondary_names_map[amm] = {
                    'primary_name': product['name'],
                    'secondary_names': secondary_names
                }
        
        # Pause pour ne pas surcharger le serveur
        time.sleep(0.5)
    
    # Sauvegarder les résultats
    output_file = 'scripts/secondary_names_scraped.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(secondary_names_map, f, ensure_ascii=False, indent=2)
    
    print(f"\nRésultats sauvegardés dans {output_file}")
    print(f"Nombre de produits avec noms secondaires: {len(secondary_names_map)}")

if __name__ == '__main__':
    main()
