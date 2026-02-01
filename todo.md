# PhytoCheck - TODO

## Phase 1: Fondations et Intégration Données

- [x] Intégrer les données E-Phy (fichier produits.csv) dans l'app
- [x] Créer la structure de données pour les produits (types TypeScript)
- [x] Implémenter la recherche locale dans les données E-Phy
- [x] Configurer AsyncStorage pour l'historique et l'inventaire

## Phase 2: Interface de Base

- [x] Créer l'écran d'accueil (Home) avec bouton scanner
- [x] Implémenter l'historique des produits scannés
- [x] Créer la barre de navigation (tabs)
- [x] Ajouter les écrans Recherche et Paramètres

## Phase 3: Fonctionnalité Scanner

- [x] Installer et configurer expo-camera
- [x] Implémenter l'écran Camera avec détection de codes-barres
- [x] Ajouter le bouton lampe torche
- [x] Intégrer le feedback haptique (vibration) lors du scan
- [x] Gérer les permissions caméra (iOS et Android)

## Phase 4: Écran Résultat

- [x] Créer l'écran Product Details
- [x] Afficher le statut d'homologation (badge coloré)
- [x] Afficher les détails du produit (AMM, substances, fonction)
- [x] Implémenter la logique PPNU (produits retirés)
- [x] Ajouter le bouton "Scanner un autre produit"

## Phase 5: Gestion du Stock

- [x] Créer l'écran Inventaire
- [x] Implémenter l'ajout de produits au stock
- [x] Implémenter la suppression de produits (swipe)
- [x] Créer la fonctionnalité d'export PDF (rapport PPNU)
- [x] Afficher les statistiques du stock

## Phase 6: Recherche Manuelle

- [x] Créer l'écran Recherche
- [x] Implémenter la recherche par nom ou AMM
- [x] Afficher les résultats en temps réel
- [x] Lier les résultats à l'écran Product Details

## Phase 7: Branding et Logo

- [x] Générer un logo personnalisé pour l'app
- [x] Mettre à jour app.config.ts avec le logo et le nom
- [x] Configurer les icônes pour iOS et Android
- [x] Configurer la splash screen

## Phase 8: Optimisation et Polissage

- [ ] Implémenter le mode sombre/clair
- [ ] Optimiser les performances (recherche, scan)
- [ ] Ajouter des animations subtiles
- [ ] Tester end-to-end sur iOS et Android
- [ ] Vérifier les permissions et les erreurs

## Phase 9: Mise à Jour des Données

- [ ] Implémenter la synchronisation des données E-Phy
- [ ] Ajouter un indicateur de version des données
- [ ] Créer un écran de mise à jour des données
- [ ] Gérer les erreurs de téléchargement

## Phase 10: Tests et Déploiement

- [ ] Écrire des tests unitaires pour la recherche
- [ ] Tester les flux utilisateur principaux
- [ ] Valider sur des appareils réels
- [ ] Préparer le déploiement (Expo EAS)

## Phase 11: Mise à Jour des Données E-Phy

- [x] Créer un service de téléchargement des données E-Phy
- [x] Ajouter un bouton "Mettre à jour les données" dans l'écran d'accueil
- [x] Afficher la date de la dernière mise à jour
- [x] Implémenter un indicateur de progression lors du téléchargement
- [x] Gérer les erreurs de téléchargement
- [x] Sauvegarder la date de mise à jour dans AsyncStorage

## Bugs à Corriger

- [x] Corriger l'erreur "Cannot find native module 'ExpoBarCodeScanner'"
- [x] Remplacer expo-barcode-scanner par une solution compatible Expo Go
- [x] Corriger l'erreur "Cannot find module '../assets/data/ephy-products.json.gz'"
- [x] Ajouter l'import FileSystem manquant dans ephy-service.ts
- [x] Utiliser require.resolve() pour charger le fichier de données
- [x] Gérer les erreurs de chargement avec fallback
- [x] Corriger l'erreur "Unmatched Route" après le scan
- [x] Vérifier la configuration des routes de navigation
- [x] Déplacer product-detail.tsx vers app/(tabs)/
- [x] Corriger l'erreur "require.resolve is not a function"
- [x] Utiliser Asset.fromModule() correctement pour charger les données
- [x] Implémenter la recherche manuelle par nom commercial
- [x] Implémenter la recherche manuelle par numéro AMM
- [x] Créer l'interface de recherche avec champ de saisie
- [x] Déplacer search.tsx, history.tsx, inventory.tsx vers app/(tabs)/

## Phase 12: Reconnaissance d'Étiquettes par OCR/IA

- [x] Remplacer le scanner de code-barres par une capture photo d'étiquette
- [x] Intégrer expo-image-picker pour la capture d'images
- [x] Créer un service d'analyse d'image avec IA (backend)
- [x] Extraire le nom commercial du produit depuis l'image
- [x] Extraire le numéro AMM si visible
- [x] Rechercher automatiquement dans la base E-Phy
- [x] Afficher les dates de retrait pour les produits PPNU
- [x] Gérer les erreurs d'extraction (image floue, étiquette illisible)

## Bugs Récents

- [x] Corriger définitivement l'erreur "Cannot find module '../assets/data/ephy-products.json.gz'"
- [x] Configurer Metro pour reconnaître les fichiers .gz

## Bug Critique

- [x] Le nom du produit est extrait mais non trouvé dans E-Phy
- [x] Améliorer la recherche avec recherche floue (tolérance aux fautes)
- [x] Normaliser les noms (majuscules, accents, espaces)
- [x] Afficher clairement le statut d'homologation après la recherche
- [x] Gérer le cas où l'AMM est trouvée mais pas le nom commercial

## Phase 13: Gestion des Quantités dans l'Inventaire

- [x] Ajouter un champ "quantité" et "unité" au type InventoryItem
- [x] Créer un modal/dialog pour saisir la quantité lors de l'ajout au stock
- [x] Permettre le choix de l'unité (litres ou kg)
- [x] Afficher la quantité dans la liste de l'inventaire
- [ ] Permettre la modification de la quantité depuis l'inventaire
- [x] Calculer et afficher la quantité totale de produits PPNU

## Bugs Critiques à Corriger

- [x] L'IA doit extraire le nom commercial réel (et second nom si présent)
- [x] Le stock ne se met pas à jour automatiquement après ajout
- [x] Les résultats de recherche manuelle sont inexacts
- [x] Améliorer le prompt IA pour extraction précise des noms commerciaux
- [x] Forcer le rafraîchissement du hook d'inventaire après ajout
- [x] Régénérer la base E-Phy avec indexation des noms alternatifs

## Amélioration Affichage des Résultats

- [x] Afficher le nom commercial recherché (ex: GRIMS) au lieu du nom principal (CLODINATOP)
- [x] Ajouter le champ matchedName dans les résultats de recherche
- [x] Modifier l'écran de résultats pour afficher le nom correspondant
- [x] Afficher le nom principal entre parenthèses si différent du nom recherché

## Bugs Critiques Urgents

- [x] Le scan de "FOLY'R" affiche "Centurion R" au lieu du produit réel
- [x] Conserver le nom extrait par l'IA même si la recherche trouve un autre produit
- [x] Les produits supprimés de l'inventaire réapparaissent après ajout d'un nouveau produit
- [x] La fonction addToInventory recharge maintenant depuis AsyncStorage avant ajout

## Bug Urgent

- [x] Le scan de "FOLY'R" affiche toujours "CENTURION R" au lieu de "FOLY'R"
- [x] Utiliser le paramètre `name` directement au lieu de `matchedName` qui peut différer

## Phase 14: Correction Manuelle du Nom

- [x] Ajouter un bouton "Corriger le nom" dans l'écran product-detail
- [x] Créer un modal avec champ de saisie pour modifier le nom
- [x] Mettre à jour le nom dans l'état local après correction
- [x] Relancer la recherche E-Phy avec le nouveau nom
- [x] Afficher une alerte de succès après correction

## Bug Critique - Correspondance AMM/Statut

- [x] Le scan de "DETONE" affiche le bon nom mais l'AMM et le statut du "CERONE"
- [x] Vérifier la structure de la base E-Phy pour DETONE et CERONE
- [x] Corriger la logique de recherche pour retourner les bonnes données du produit trouvé
- [x] S'assurer que le nom, l'AMM et le statut correspondent au même produit
- [x] Régénérer la base E-Phy avec la bonne logique de statut (date de retrait vide = AUTORISÉ)
- [x] Inclure tous les types de produits (PPP, ADJUVANT, MFSC)

## Bug - Recherche HELIOCUIVRE

- [x] HELIOCUIVRE n'est pas trouvé dans la base E-Phy
- [x] Vérifier si HELIOCUIVRE existe dans le CSV source
- [x] Améliorer la normalisation des noms (accents, tirets, espaces)
- [x] Vérifier l'indexation des noms avec caractères spéciaux
- [x] Régénérer la base avec normalisation cohérente (Python = JavaScript)

## Bug Critique - HELIOCUIVRE INCONNU

- [x] HELIOCUIVRE est marqué comme INCONNU alors que le nom est correctement extrait
- [x] Vérifier que le fichier ephy-products.json.gz contient bien HELIOCUIVRE
- [x] Vérifier que l'application charge bien la nouvelle version du fichier
- [x] Déboguer la fonction searchByName pour HELIOCUIVRE
- [x] Corriger la structure de l'index (Product[] au lieu de string[])
- [x] Régénérer la base avec les objets Product complets dans l'index

## Phase 15: Modification des Quantités et Traduction

- [x] Permettre la modification des quantités en cliquant sur un produit dans l'inventaire
- [x] Créer un modal de modification avec quantité et unité pré-remplies
- [x] Traduire tous les textes de l'interface en français (tabs, boutons, messages)

## Phase 16: Traduction complète en français

- [x] Traduire tous les termes anglais restants (search, history, inventory, product)
- [x] Vérifier tous les fichiers pour s'assurer qu'il n'y a plus de termes anglais visibles
- [x] Ajouter les onglets dans la barre de navigation avec titres en français

## Bug Critique - Confusion IA Ninja Pro / Cinch Pro

- [x] L'IA confond "CINCH PRO" avec "NINJA PRO" lors de la lecture d'étiquette
- [x] Améliorer le prompt IA pour une lecture plus précise des noms de produits
- [x] Ajouter une vérification de cohérence entre le nom extrait et les résultats trouvés
- [x] Afficher un avertissement si le nom extrait ne correspond pas exactement au produit trouvé

## Problème - Noms commerciaux secondaires non indexés

- [x] "Ninja Pro" est un second nom de "KARATE AVEC TECHNOLOGIE ZEON" (AMM 9800336)
- [x] La base E-Phy officielle ne contient pas les noms commerciaux secondaires
- [x] Améliorer la logique pour prioriser la recherche par AMM quand disponible
- [x] Si l'AMM est trouvé, afficher le nom principal de la base + le nom extrait comme alias
- [x] Afficher un message informatif (bleu) pour les noms secondaires vs avertissement (jaune) pour les erreurs

## Bugs Critiques - Recherche AMM 9800336

- [x] La recherche manuelle par AMM 9800336 affiche "Aucun produit trouvé" → CORRIGÉ : ajout détection AMM dans search.tsx
- [x] Le scan d'étiquette Ninja Pro trouve CINCH PRO au lieu de KARATE AVEC TECHNOLOGIE ZEON
- [x] L'IA lit AMM 2010283 (CINCH PRO) au lieu de 9800336 (KARATE ZEON)
- [x] Améliorer le prompt IA pour une lecture plus précise des numéros AMM (vérification chiffre par chiffre)
- [x] Ajouter une validation croisée : si nom et AMM ne correspondent pas au même produit, alerter l'utilisateur avec message d'incohérence critique

## Fonctionnalité - Base de données des noms secondaires

- [x] Créer un fichier secondary-names.ts avec la correspondance nom secondaire → AMM
- [x] Ajouter "Ninja Pro" → 9800336 (KARATE AVEC TECHNOLOGIE ZEON)
- [x] Modifier la logique de recherche pour consulter cette base en priorité
- [x] Afficher un message vert avec ✅ quand un nom secondaire est reconnu automatiquement
- [ ] Permettre l'ajout de nouveaux noms secondaires au fur et à mesure des découvertes (fonctionnalité future)

## Amélioration - Base E-Phy avec noms secondaires

- [x] Rechercher la source officielle E-Phy avec noms commerciaux secondaires → Trouvé sur ephy.anses.fr
- [x] Parcourir le site E-Phy pour extraire les produits avec noms secondaires → Trouvé DATAMAR, DAIKO, SPOW MAJOR
- [x] Ajouter DATAMAR et autres noms secondaires dans secondary-names.ts
- [x] Intégrer les noms secondaires dans l'index de recherche (déjà fait dans product-detail.tsx)
- [x] Améliorer l'algorithme de recherche pour être plus strict (distance <= 2, longueur similaire ±30%)
- [x] Tester avec DATAMAR (doit trouver DEFI MAJOR AMM 2110151) → Test réussi : DATAMAR match, DARAMUN rejeté

## Fonctionnalité - Base complète des noms secondaires

- [x] Créer un script robuste pour scraper tous les noms secondaires depuis E-Phy → Abandonné, fichier CSV fourni
- [x] Analyser le fichier CSV E-Phy fourni par l'utilisateur → Structure identifiée
- [x] Extraire tous les noms principaux et secondaires avec leur statut (autorisé/retiré) → 3374 noms extraits
- [x] Intégrer les données dans secondary-names.ts → Fichier généré automatiquement
- [x] Tester avec DATAMAR, NINJA PRO et autres produits → Tous les tests passés avec succès

## Bug - NINJA PRO non trouvé au scan

- [x] Vérifier la ligne 5352 du CSV (colonne D) pour NINJA PRO → NINJA PRO est ligne 2064, pas 5352
- [x] Identifier pourquoi NINJA PRO n'est pas dans la base générée → Il est bien dans la base
- [x] Problème: L'IA lit AMM 4205624 au lieu de 9800336, et ce produit n'existe pas
- [x] Modifier la logique pour prioriser les noms secondaires sur l'AMM extrait par l'IA
- [x] Si un nom secondaire est détecté, ignorer complètement l'AMM extrait par l'IA
- [x] Tester avec NINJA PRO → Tests passés, logique corrigée

## Bugs à corriger

- [x] NIDAS 250 non trouvé : "produit non trouvé dans la base de données"
- [x] Vérifier si NIDAS 250 est dans la base E-Phy et les noms secondaires → Il est bien dans la base
- [x] Problème identifié : L'IA extrait "NIDAS® 250" mais la base contient "NIDAS 250" (sans ®)
- [x] Améliorer la normalisation pour supprimer les symboles ®, ™, ©, etc. → Fonction normalizeName ajoutée
- [x] Message d'avertissement du scan précédent qui persiste au scan suivant → Corrigé
- [x] Réinitialiser les messages d'avertissement à chaque nouveau scan → Ajouté dans loadProduct

## Bug Critique - Données du scan précédent persistent

- [x] Le nom extrait est correct mais les informations affichées sont celles du scan précédent
- [x] Le nom officiel, l'AMM et l'avertissement ne sont pas mis à jour
- [x] Problème identifié : useEffect ne se déclenche que si amm change, pas si name change
- [x] Réinitialiser complètement le state du produit avant de charger le nouveau
- [x] Ajouter name dans les dépendances du useEffect

## Fonctionnalité - Enregistrer le nom commercial scanné dans le stock

- [x] Modifier la structure InventoryItem pour inclure le nom commercial scanné (champ commercialName)
- [x] Adapter product-detail.tsx pour enregistrer le nom scanné au lieu du nom principal
- [x] Modifier l'affichage de l'inventaire pour montrer le nom commercial en priorité
- [x] Afficher le nom officiel en sous-titre si différent du nom commercial
- [x] Mettre à jour l'export du rapport pour inclure les noms commerciaux

## Problème UX - Contraste insuffisant en mode clair

- [x] Le nom du produit est difficile à lire sur l'écran de détail en mode clair
- [x] Améliorer le contraste du texte sur fond clair → Utilisation de text-gray-900 au lieu de text-foreground
- [x] Vérifier tous les éléments de texte pour une bonne lisibilité → Nom officiel en text-gray-600

## Modifications UX demandées

- [x] Retirer l'onglet "Historique" de la barre de navigation → href: null ajouté
- [x] Ajouter la recherche par photo d'étiquette dans la page Recherche → Section 2 ajoutée avec bouton Scanner
- [x] Afficher le numéro de version à droite du nom de l'application sur l'accueil → v3.9.0 affiché
- [x] Améliorer le contraste des noms de produits PPNU dans le stock → text-gray-900 pour les noms

## Phase 20: Mise à jour automatique depuis data.gouv.fr

- [x] Trouver l'URL exacte du fichier ZIP sur data.gouv.fr
- [x] Implémenter le téléchargement du fichier ZIP côté serveur
- [x] Extraire le fichier produits_Windows-1252.csv du ZIP
- [x] Traiter le CSV et régénérer la base E-Phy locale
- [x] Extraire les noms secondaires et mettre à jour secondary-names.ts
- [ ] Afficher la progression du téléchargement et du traitement (à tester)
- [ ] Gérer les erreurs de téléchargement et de traitement (à tester)
- [ ] Tester la mise à jour complète end-to-end

## Correction - Numéro de version affiché

- [x] Mettre à jour package.json version de 3.9.0 à 3.11.0

## Bug - Erreur lors de la mise à jour E-Phy

- [x] Analyser l'erreur à la ligne 130 de ephy-update-service.ts
- [x] Vérifier la structure de la réponse de l'API tRPC
- [x] Corriger le problème de mémoire (Out of memory for regexp results)
- [x] Optimiser le traitement du CSV en streaming
- [x] Décision : Retirer la mise à jour automatique (fichier trop volumineux)

## Modification UX - Retrait du bouton de mise à jour

- [x] Retirer le bouton "Mettre à jour" de l'écran d'accueil
- [x] Afficher la date de la base de données E-Phy (21/01/2026)
- [x] Simplifier l'affichage de la section "DONNÉES E-PHY"
- [x] Retirer les imports et états inutiles liés à la mise à jour

## Amélioration UX - Tri alphabétique du stock

- [x] Trier les produits du stock par ordre alphabétique dans l'écran de gestion

## Amélioration UX - Scanner direct dans l'onglet Recherche

- [x] Modifier le bouton "Scanner une étiquette" pour ouvrir directement l'appareil photo
- [x] Intégrer le composant LabelScanner dans l'écran de recherche

## Fonctionnalité - Détection des produits CMR

- [x] Analyser le fichier CSV des phrases de risque
- [x] Créer un service pour détecter si un produit est CMR
- [x] Intégrer la base de données des phrases de risque dans l'application (432 produits CMR)
- [x] Modifier l'affichage du stock pour afficher les produits CMR en orange
- [x] Ajouter un logo d'avertissement (⚠️) pour les produits CMR
- [x] Détecter automatiquement les CMR lors de l'ajout au stock

## Bug - Recherche manuelle ne trouve pas certains produits

- [x] Vérifier la présence de BIWIX et VEDETTE dans la base de données
- [x] Analyser la fonction searchByName dans ephy-service.ts
- [x] Identifier pourquoi certains produits ne sont pas trouvés (noms secondaires non recherchés)
- [x] Corriger le problème de recherche (ajout de la recherche dans les noms secondaires)
- [x] Tester avec BIWIX, VEDETTE et BETANAL

## Bug - Détection CMR ne fonctionne pas pour BIWIX

- [x] Identifier pourquoi le service CMR n'est pas chargé (import JSON ne fonctionnait pas)
- [x] Vérifier l'import du fichier JSON dans React Native
- [x] Corriger le chargement en créant un fichier TypeScript cmr-data.ts
- [x] Réécrire isProductCMR en mode synchrone avec import direct
- [x] Corriger l'appel dans product-detail.tsx
- [x] Appliquer l'affichage CMR aux produits homologués (pas seulement PPNU)
- [x] Tester avec BIWIX (AMM 2140098) - Fonctionne !

## Fonctionnalité - Sélection du nom commercial à ajouter au stock

- [x] Analyser le cas de l'AMM 9900115 (Centurion R et noms secondaires)
- [x] Vérifier la présence dans le CSV complet (CENTURION R + 5 noms secondaires)
- [x] Régénérer la base E-Phy complète avec le nouveau fichier CSV
- [x] Ajouter le champ secondaryNames dans le type Product
- [x] Régénérer les noms secondaires (3374 noms)
- [x] Corriger le script pour détecter le statut correctement
- [ ] Modifier l'écran product-detail pour afficher tous les noms commerciaux disponibles
- [ ] Ajouter un sélecteur de nom commercial avant l'ajout au stock
- [ ] Permettre à l'utilisateur de choisir entre le nom principal et les noms secondaires
- [ ] Enregistrer le nom choisi dans le stock

## Phase 21: Implémentation du sélecteur de noms commerciaux

- [x] Modifier product-detail.tsx pour afficher tous les noms disponibles (principal + secondaires)
- [x] Ajouter un sélecteur radio pour choisir le nom commercial
- [x] Enregistrer le nom commercial choisi dans le champ commercialName du stock
- [ ] Tester avec CENTURION R (5 noms secondaires)

## Phase 22: Améliorations de l'écran de stock

- [x] Retirer le bouton "Ajouter un produit" de l'écran de stock
- [x] Ajouter un compteur de produits CMR dans les statistiques en haut
- [x] Remplacer le bouton "Exporter PPNU" par "Exporter liste complète"
- [x] Ajouter un filtre cliquable pour afficher uniquement les produits CMR

## Phase 23: Export PDF professionnel et filtre PPNU

- [x] Ajouter un filtre PPNU cliquable dans les statistiques (comme le filtre CMR)
- [x] Créer une fonction d'export PDF professionnel avec logo et mise en page
- [x] Structurer le PDF avec séparation claire : Homologués, PPNU, CMR
- [x] Ajouter un tableau structuré avec colonnes : Nom, AMM, Statut, Quantité, CMR
- [x] Inclure la date et l'heure d'export dans le PDF

## Bug - Export du stock ne fonctionne pas dans Expo Go

- [x] Corriger la fonction d'export pour générer un fichier texte structuré
- [x] Remplacer l'HTML par un format texte compatible avec le partage mobile
- [ ] Tester l'export dans Expo Go sur Android

## Amélioration UX - Bouton Partager dans le stock

- [x] Remplacer le bouton "Exporter liste complète" par "Partager"
- [x] Simplifier l'interface de l'écran de stock

## Bug - Partage du stock ne joint pas le fichier et ignore les filtres

- [ ] Utiliser Sharing.shareAsync au lieu de Share.share pour joindre le fichier
- [ ] Respecter les filtres actifs (CMR, PPNU) lors du partage
- [ ] Tester le partage avec filtres dans Expo Go

## Bug Critique - Export du stock ne fonctionne pas

- [x] Corriger le partage pour utiliser Sharing.shareAsync au lieu de Share.share
- [x] Respecter les filtres actifs lors de l'export (CMR, PPNU)
- [x] Installer expo-sharing pour un meilleur support du partage de fichiers
- [x] Vérifier que le fichier est correctement attaché lors du partage

## Amélioration - Export PDF professionnel

- [x] Créer un service d'export PDF avec mise en page soignée
- [x] Ajouter un en-tête avec logo et titre PhytoCheck
- [x] Organiser les produits en tableaux par catégorie (Autorisés, PPNU, CMR)
- [x] Inclure les statistiques et la date d'export
- [x] Remplacer l'export TXT par l'export PDF dans l'écran de stock

## Bug - Numéro de version incorrect

- [x] Mettre à jour package.json version de 3.11.0 à 3.18.0

## Bug Critique - Version codée en dur

- [x] Corriger la ligne 82 de app/(tabs)/index.tsx pour utiliser la version du package.json au lieu de "v3.11.0" codé en dur

## Modification UX - Retirer l'historique de l'accueil

- [x] Retirer la section "Historique récent" de la page d'accueil
- [x] Simplifier l'interface pour ne garder que le scanner et les actions principales

## Phase 20: Système Freemium/Premium

### Version Gratuite
- [x] Limiter le stock à 10 produits maximum
- [x] Afficher un message quand la limite est atteinte
- [x] Proposer l'upgrade vers Premium

### Version Premium
- [x] Créer un hook use-subscription pour gérer l'état d'abonnement
- [x] Stocker l'état premium dans AsyncStorage
- [x] Débloquer le stock illimité
- [x] Débloquer l'export PDF
- [x] Créer un écran "Passer à Premium" avec liste des avantages
- [x] Ajouter un badge "Premium" dans l'interface
- [x] Ajouter un bouton "Upgrade" dans l'écran de stock

### Fonctionnalités Premium à implémenter plus tard
- [ ] Statistiques avancées avec graphiques
- [ ] Alertes de péremption
- [ ] Gestion multi-sites
- [ ] Historique illimité
- [ ] Notes personnalisées par produit
- [ ] Partage de stock avec collaborateurs

## Phase 21: Intégration Google Play Billing (IAP)

### Installation et Configuration
- [x] Installer react-native-iap
- [x] Configurer les permissions Android pour le billing
- [x] Ajouter les IDs de produits d'abonnement

### Service IAP
- [x] Créer un service iap-service.ts pour gérer les achats
- [x] Implémenter l'initialisation de la connexion IAP
- [x] Implémenter la récupération des produits disponibles
- [x] Implémenter l'achat d'abonnement
- [x] Implémenter la vérification du statut d'abonnement
- [x] Implémenter la restauration des achats

### Intégration dans l'app
- [x] Mettre à jour use-subscription pour utiliser IAP au lieu d'AsyncStorage
- [x] Modifier l'écran Premium pour afficher les vrais prix
- [x] Remplacer le bouton gratuit par un bouton de paiement
- [x] Ajouter un bouton "Restaurer les achats"
- [x] Gérer les erreurs de paiement
- [ ] Tester le flux complet

## Bug - Erreur de build web avec react-native-iap

- [x] Ajouter une vérification Platform.OS !== 'web' dans iap-service.ts pour éviter l'import de modules natifs sur web
- [x] Redémarrer le serveur pour corriger l'erreur

## Bug - Erreur NitroModules dans Expo Go

- [x] Détecter Expo Go avec Constants.executionEnvironment
- [x] Désactiver IAP automatiquement dans Expo Go
- [x] Forcer le mode test gratuit dans Expo Go

## Phase 22: Build Android pour Google Play Console

- [ ] Configurer EAS Build
- [ ] Créer le fichier eas.json avec profil de production
- [ ] Créer un guide de build pour l'utilisateur
- [ ] Documenter le processus de publication sur Google Play Console
