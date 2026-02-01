              function: productFunction || '',
              barcode: 'LABEL_SCAN',
            },
          });
          onScanComplete?.();
        } else {
          Alert.alert(
            'Analyse échouée',
            "Impossible d'extraire le nom du produit de l'étiquette. Veuillez réessayer avec une image plus nette."
          );
        }
      } else {
        Alert.alert(
          'Erreur',
          response.error || "Erreur lors de l'analyse de l'étiquette"
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      Alert.alert(