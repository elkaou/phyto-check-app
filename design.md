# PhytoCheck - Design Mobile

## Vue d'ensemble
PhytoCheck est une application mobile permettant aux agriculteurs et gestionnaires de stocks phytosanitaires de vérifier rapidement l'homologation des produits en les scannant avec leur téléphone.

## Orientation et Ergonomie
- **Orientation**: Portrait (9:16)
- **Utilisation**: Une main
- **Principe**: Scan rapide → Résultat immédiat

## Écrans de l'Application

### 1. Écran d'Accueil (Home)
**Contenu principal:**
- Logo/titre de l'app en haut
- Grand bouton "Scanner un produit" (CTA primaire)
- Historique des 5 derniers produits scannés (liste)
- Bouton "Gestion du stock" (navigation secondaire)

**Fonctionnalité:**
- Tap sur "Scanner" → Ouvre la caméra
- Tap sur produit historique → Affiche les détails
- Swipe vers le bas pour rafraîchir l'historique

### 2. Écran Scanner (Camera)
**Contenu principal:**
- Cadre de capture au centre (zone de scan)
- Bouton "Annuler" en haut à gauche
- Bouton "Lampe torche" en haut à droite
- Indicateur "Positionnez le code-barres dans le cadre"

**Fonctionnalité:**
- Détecte automatiquement les codes-barres (EAN-13, QR codes)
- Affiche un retour haptique lors de la détection
- Redirige vers l'écran Résultat après scan réussi

### 3. Écran Résultat (Product Details)
**Contenu principal:**
- Nom du produit (grand titre)
- Numéro AMM (si trouvé)
- **Statut d'homologation** (badge coloré):
  - 🟢 HOMOLOGUÉ (vert) - Produit autorisé
  - 🔴 RETIRÉ (rouge) - PPNU, ne pas utiliser
  - ⚠️ NON TROUVÉ (gris) - Produit non identifié
- Date de retrait (si applicable)
- Substances actives (liste)
- Fonction du produit (ex: Insecticide, Fongicide)
- Bouton "Retour" / "Scanner un autre produit"

**Variantes:**
- Si homologué: affiche les usages autorisés
- Si retiré: affiche la date de retrait et un avertissement en rouge
- Si non trouvé: propose une recherche manuelle

### 4. Écran Recherche Manuelle (Search)
**Contenu principal:**
- Champ de texte "Rechercher par nom ou AMM"
- Bouton "Rechercher"
- Résultats en liste (nom produit, statut, AMM)
- Tap sur résultat → Affiche détails (écran Résultat)

**Fonctionnalité:**
- Recherche en temps réel dans les données E-Phy
- Affiche les 10 premiers résultats

### 5. Écran Gestion du Stock (Inventory)
**Contenu principal:**
- Liste des produits du stock local
- Pour chaque produit: nom, AMM, statut (badge), action (supprimer)
- Bouton "Ajouter un produit" (scan ou recherche)
- Bouton "Exporter rapport" (PDF)

**Fonctionnalité:**
- Swipe pour supprimer un produit
- Tap pour voir détails
- Exporte un rapport des PPNU (produits à retirer)

### 6. Écran Paramètres (Settings)
**Contenu principal:**
- Basculer mode sombre/clair
- À propos de l'app
- Version de la base de données E-Phy
- Bouton "Mettre à jour les données" (si applicable)

## Flux Utilisateur Principal

```
Accueil
  ↓
[Tap "Scanner"]
  ↓
Écran Camera (scan automatique)
  ↓
Résultat (homologué/retiré/non trouvé)
  ↓
[Tap "Scanner un autre" ou "Retour"]
  ↓
Accueil (historique mis à jour)
```

## Flux Secondaire: Gestion du Stock

```
Accueil
  ↓
[Tap "Gestion du stock"]
  ↓
Inventaire (liste des produits)
  ↓
[Tap "Ajouter"] → Scanner ou Recherche
  ↓
Inventaire (produit ajouté)
  ↓
[Tap "Exporter"] → PDF rapport PPNU
```

## Palette de Couleurs

| Élément | Couleur | Utilisation |
|---------|---------|-------------|
| Primaire | #2E7D32 (vert) | Boutons, accents, produits homologués |
| Danger | #D32F2F (rouge) | Produits retirés (PPNU), avertissements |
| Neutre | #757575 (gris) | Texte secondaire, produits non trouvés |
| Fond | #FFFFFF (blanc) / #121212 (noir) | Fond écran (mode clair/sombre) |
| Surface | #F5F5F5 (gris clair) / #1E1E1E (gris foncé) | Cartes, zones de contenu |
| Texte | #212121 (noir) / #FFFFFF (blanc) | Texte principal |

## Badges de Statut

- **HOMOLOGUÉ**: Fond vert, texte blanc, icône ✓
- **RETIRÉ**: Fond rouge, texte blanc, icône ⚠️
- **NON TROUVÉ**: Fond gris, texte gris foncé, icône ?

## Interactions et Feedback

- **Tap sur bouton**: Feedback haptique léger + changement d'opacité
- **Scan réussi**: Vibration courte + son (configurable)
- **Scan échoué**: Vibration double + message d'erreur
- **Chargement**: Spinner centré avec texte "Recherche en cours..."

## Données Affichées par Écran

### Résultat (Product Details)
- Nom commercial
- Numéro AMM
- Statut (homologué/retiré/non trouvé)
- Date de retrait (si retiré)
- Substances actives (liste)
- Fonction (ex: Insecticide)
- Usages autorisés (si homologué)
- Titulaire du produit

### Inventaire
- Nom produit
- AMM
- Statut (badge)
- Date d'ajout au stock
- Action: supprimer

## Considérations Techniques

- **Données**: Fichiers E-Phy (CSV) intégrés localement ou synchronisés depuis le serveur
- **Scanner**: Utilise `expo-camera` + `expo-barcode-scanner` (ou alternative)
- **Stockage local**: AsyncStorage pour historique + inventaire
- **Mise à jour données**: Téléchargement périodique des fichiers E-Phy (hebdomadaire)
