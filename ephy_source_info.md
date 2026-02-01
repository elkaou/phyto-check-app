# Source E-Phy - Données ouvertes

## URL
https://www.data.gouv.fr/datasets/donnees-ouvertes-du-catalogue-e-phy-des-produits-phytopharmaceutiques-matieres-fertilisantes-et-supports-de-culture-adjuvants-produits-mixtes-et-melanges

## Fichiers disponibles
1. **decisionamm-intrant-format-csv-20260121-utf8.zip** (37 Mo) - Format CSV UTF-8
2. **decisionamm-intrant-format-csv-20260121-windows-1252.zip** (38 Mo) - Format CSV Windows-1252
3. **decisionamm-intrant-format-xml-20260121.zip** (8 Mo) - Format XML

## Contenu des fichiers CSV
- `produits.CSV` : Liste des produits avec AMM, gamme d'usages et fonction
- `produits_usages.CSV` : Liste des usages des produits (une ligne par usage)
- `usages_des_produits_autorises` : Usages des produits autorisés uniquement
- `produits_phrases_de_risque` : Phrases de risque
- `substance_active` : Liste des substances actives
- `produits_condition_emploi` : Conditions d'emploi
- `classe_et_mention_danger` : Classes et mentions de danger
- `mfsc_et_mixte_usage` : Cultures des MFSC et produits mixtes
- `mfsc_et_mixte_composition` : Compositions des MFSC et produits mixtes
- `permis_de_commerce_parallele` : Permis de commerce parallèle (PCP)

## Mise à jour
- Fréquence : Hebdomadaire (nuit de mardi à mercredi)
- Dernière mise à jour : 21 janvier 2026
- Source : https://ephy.anses.fr

## Note importante
La base contient environ 15 000 produits autorisés et retirés avec leurs noms commerciaux, mais **il faut vérifier si les noms secondaires sont inclus dans le fichier `produits.CSV`**.
