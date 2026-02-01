# Guide Build Android - PhytoCheck

Guide rapide pour créer un fichier AAB et le publier sur Google Play Console.

## Étape 1 : Installer EAS CLI

```bash
npm install -g eas-cli
```

## Étape 2 : Se connecter à Expo

```bash
cd phyto-check-app
eas login
```

Créez un compte sur [expo.dev](https://expo.dev) si nécessaire.

## Étape 3 : Configurer le projet

```bash
eas build:configure
```

## Étape 4 : Lancer le build Android

```bash
eas build --platform android --profile production
```

Le build prend 10-20 minutes. Vous recevrez un lien pour télécharger le fichier `.aab`.

## Étape 5 : Publier sur Google Play Console

1. Allez sur [Google Play Console](https://play.google.com/console)
2. Créez une nouvelle application
3. Allez dans **"Tests internes"** → **"Créer une version"**
4. Importez le fichier `.aab` téléchargé
5. Ajoutez des testeurs (adresses Gmail)
6. Publiez la version de test

## Étape 6 : Configurer les abonnements Premium

Dans Google Play Console :

1. **Monétisation** → **Abonnements** → **Créer un abonnement**
2. Créez deux produits :
   - ID: `phytocheck_premium_monthly` - Prix: 4,99€/mois
   - ID: `phytocheck_premium_yearly` - Prix: 49,90€/an
3. Activez les produits

## Commandes utiles

```bash
# Voir les builds
eas build:list

# Télécharger un build
eas build:download --platform android

# Soumettre automatiquement à Google Play
eas submit --platform android
```

## Support

- Documentation EAS Build: https://docs.expo.dev/build/introduction/
- Google Play Console: https://play.google.com/console
