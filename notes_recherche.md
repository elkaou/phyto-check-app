# Recherche sur la correspondance Code-barres / AMM

## Constat
- Le code-barres EAN-13 (ex: 5606163998632) est un identifiant commercial du produit
- Le numéro AMM (ex: 2150918) est un identifiant administratif réglementaire
- Ces deux identifiants sont **distincts** et n'ont pas de relation directe

## Recherche effectuée
- Guide d'étiquetage Phyteis : confirme que code-barres EAN et AMM sont deux informations séparées sur l'étiquette
- Données E-Phy : contiennent les AMM mais pas les codes-barres EAN
- Aucune table de correspondance publique trouvée

## Problème
Le scanner lit le code-barres commercial (EAN-13) mais la base E-Phy est indexée par numéro AMM.

## Solutions possibles
1. **Créer une table de correspondance manuelle** : l'utilisateur scanne et associe manuellement le code-barres à l'AMM
2. **Utiliser la recherche manuelle** : après un scan non trouvé, proposer de rechercher par nom
3. **Scanner le 2D Datamatrix** : certains produits ont un Datamatrix qui pourrait contenir l'AMM (à vérifier)
4. **Base de données collaborative** : permettre aux utilisateurs de contribuer aux correspondances

## Recommandation
Implémenter une solution hybride :
- Scanner détecte le code-barres
- Si non trouvé dans la base, proposer une recherche manuelle par nom
- Permettre de sauvegarder la correspondance code-barres → AMM localement
