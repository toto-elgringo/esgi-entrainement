# Jointures et rendu final

## Pourquoi une jointure ?

Une **jointure attributaire** rattache à une couche les colonnes d'un **tableau** (souvent un CSV) en s'appuyant sur un **champ commun**.

Exemple : ajouter à la couche `COMMUNE` des statistiques (population, revenus…) contenues dans un CSV de l'INSEE. Le champ commun est le **code INSEE** de la commune.

## Étape 10 du TP : créer la jointure

1. **Créer une jointure** entre la couche `COMMUNE` et le CSV ;
2. **Vérifier** que la jointure a fonctionné : ouvrir la table attributaire des communes.

### Marche à suivre

1. Ajoute le CSV : **Couche > Ajouter une couche > Ajouter une couche de texte délimité** (choisis « Aucune géométrie »).
2. Double-clic sur la couche `COMMUNE` > onglet **Jointures** > bouton **+**.
3. Choisis : la **couche à joindre** (le CSV), le **champ de jointure** (dans le CSV) et le **champ cible** (dans COMMUNE).
4. Valide, puis ouvre la **table d'attributs** : les colonnes du CSV doivent apparaître, préfixées par le nom du CSV.

## Réussir la jointure

| Problème | Cause | Solution |
|---|---|---|
| Colonnes vides | les deux champs ne contiennent pas les mêmes valeurs | comparer visuellement les deux colonnes |
| Zéro de début perdu (`01001` devient `1001`) | le CSV a lu le code comme un nombre | importer le champ en **texte** |
| Une seule ligne remplie | les codes ont des espaces ou des majuscules différentes | nettoyer le champ |
| Rien n'apparaît | la jointure n'est pas enregistrée dans le projet | rouvrir les propriétés et vérifier l'onglet Jointures |

> [!warning] Piège
> Une jointure **n'est pas permanente** : elle vit dans le projet. Pour garder les colonnes dans la couche, **exporte la couche** sous un nouveau fichier.

> [!tip] Astuce
> Vérifie le résultat en **triant** la table sur une colonne jointe : s'il y a beaucoup de `NULL`, c'est que beaucoup de communes n'ont pas trouvé leur ligne dans le CSV.

## Mise en page et export d'une carte

Pour produire une image (par exemple `Issy les moulineaux.png`) :

1. **Projet > Nouvelle mise en page** ;
2. ajoute une **carte** ; place le cadre sur la zone voulue ;
3. ajoute **titre**, **légende**, **échelle** et **flèche du nord** ;
4. **Mise en page > Exporter comme image**.

> [!tip] Astuce
> Une bonne carte a toujours : un **titre**, une **légende**, une **échelle**, la **source** des données et la **date**.

## Rendre son travail

- Donne le nom de fichier demandé exactement (par exemple `restaurant_italien_montreuil.gpkg`).
- Vérifie que tu as bien exporté **les objets sélectionnés** et non toute la couche.
