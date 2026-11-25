# Jointures et rendu final

## Pourquoi une jointure ?

Une **jointure attributaire** rattache à une couche les colonnes d'un **tableau** (souvent un CSV) en s'appuyant sur un **champ commun**.

Exemple : ajouter à la couche `COMMUNE` des statistiques (population, revenus…) contenues dans un CSV de l'INSEE. Le champ commun est le **code INSEE** de la commune.

Le **champ commun** est une colonne présente des deux côtés, qui contient **les mêmes valeurs** pour le même objet. Il peut avoir un nom différent dans chaque table (`INSEE_COM` d'un côté, `code` de l'autre) : ce qui compte, ce sont les valeurs. On choisit un **code** (identifiant unique) plutôt qu'un nom : deux communes peuvent s'appeler pareil, et un nom s'écrit de plusieurs façons (accents, tirets, « Saint » ou « St »).

Une jointure ne touche **pas** aux géométries : elle ne fusionne pas de formes, ne découpe rien et ne change pas la projection. Elle ajoute seulement des **colonnes**.

**Exemple résolu : joindre un nombre d'hôpitaux à des départements.**

La couche `DEPARTEMENT` a un champ `CODE_DEPT`. Le CSV `hopitaux.csv` a les colonnes `dep` et `nb_hopitaux`.

Couche `DEPARTEMENT` :

| `NOM` | `CODE_DEPT` |
|---|---|
| Ain | 01 |
| Aisne | 02 |
| Paris | 75 |

CSV `hopitaux.csv` :

| `dep` | `nb_hopitaux` |
|---|---|
| 75 | 47 |
| 01 | 12 |
| 02 | 15 |

Les lignes du CSV ne sont pas dans le même ordre : ce n'est pas grave, QGIS cherche par code, pas par position.

1. Champ commun : `CODE_DEPT` (couche) et `dep` (CSV). Noms différents, mêmes valeurs : ça convient.
2. QGIS prend chaque département, cherche dans le CSV la ligne qui a le même code, et recopie ses colonnes à côté.
3. Ain (01) trouve la ligne 01 et reçoit 12 ; Aisne (02) reçoit 15 ; Paris (75) reçoit 47.
4. La table de `DEPARTEMENT` a maintenant une colonne de plus : `hopitaux_nb_hopitaux` (le nom du CSV est ajouté devant).

**À retenir :** jointure = pour chaque objet, on cherche la ligne du tableau qui a le même code, et on recopie ses colonnes.

## Étape 10 du TP : créer la jointure

1. **Créer une jointure** entre la couche `COMMUNE` et le CSV ;
2. **Vérifier** que la jointure a fonctionné : ouvrir la table attributaire des communes.

### Marche à suivre

1. Ajoute le CSV : **Couche > Ajouter une couche > Ajouter une couche de texte délimité** (choisis « Aucune géométrie »).
2. Double-clic sur la couche `COMMUNE` > onglet **Jointures** > bouton **+**.
3. Choisis : la **couche à joindre** (le CSV), le **champ de jointure** (dans le CSV) et le **champ cible** (dans COMMUNE).
4. Valide, puis ouvre la **table d'attributs** : les colonnes du CSV doivent apparaître, préfixées par le nom du CSV.

« Aucune géométrie » : le CSV n'a pas de formes, juste des lignes et des colonnes. QGIS l'affiche alors comme un simple tableau, sans rien dessiner.

Les autres onglets des propriétés ne relient pas de tables :

| Onglet | Rôle |
|---|---|
| **Jointures** | relier un tableau à la couche |
| Symbologie | couleurs et symboles des objets |
| Étiquettes | textes affichés sur la carte |
| Diagrammes | petits graphiques posés sur les objets |
| Source | fichier d'origine, système de coordonnées, filtre |
| Variables | réglages réutilisables dans les expressions |

**Exemple résolu : remplir la fenêtre de jointure** pour l'exemple des départements.

| Case de la fenêtre | Ce qu'on choisit | Pourquoi |
|---|---|---|
| Couche à joindre | `hopitaux.csv` | c'est le tableau qui apporte les colonnes |
| Champ de jointure | `dep` | le code, **côté CSV** |
| Champ cible | `CODE_DEPT` | le même code, **côté couche** |

Puis OK, et clic droit sur `DEPARTEMENT` > Ouvrir la table d'attributs : la colonne `hopitaux_nb_hopitaux` doit être là, remplie.

**À retenir :** champ de jointure = côté tableau ; champ cible = côté couche ; on vérifie toujours dans la table d'attributs.

## Réussir la jointure

| Problème | Cause | Solution |
|---|---|---|
| Colonnes vides | les deux champs ne contiennent pas les mêmes valeurs | comparer visuellement les deux colonnes |
| Zéro de début perdu (`01001` devient `1001`) | le CSV a lu le code comme un nombre | importer le champ en **texte** |
| Une seule ligne remplie | les codes ont des espaces ou des majuscules différentes | nettoyer le champ |
| Rien n'apparaît | la jointure n'est pas enregistrée dans le projet | rouvrir les propriétés et vérifier l'onglet Jointures |

Pour QGIS, deux valeurs sont « les mêmes » seulement si elles sont **identiques caractère par caractère** et du **même type** (texte ou nombre). Un nombre ne garde pas de zéro devant : lu comme un nombre, `01` devient `1`. Un code doit donc toujours être lu comme du **texte**.

**Exemple résolu : pourquoi l'Ain et l'Aisne restent vides ?** Après la jointure des départements, Paris a bien 47, mais l'Ain et l'Aisne ont `NULL` (« pas de valeur »).

| Département | `CODE_DEPT` (couche, texte) | `dep` (CSV, lu comme nombre) | Identiques ? |
|---|---|---|---|
| Ain | `01` | `1` | non |
| Aisne | `02` | `2` | non |
| Paris | `75` | `75` | oui |

1. Seuls les codes qui commencent par 0 échouent : c'est le signe du zéro perdu.
2. Cause : à l'import, QGIS a deviné que `dep` était un nombre.
3. Solution : réimporter le CSV en forçant `dep` en texte (dans la fenêtre de texte délimité, décocher « Détecter les types de champs », ou ajouter un fichier `.csvt` qui donne les types), puis refaire la jointure.

Si **toutes** les lignes étaient vides, la cause serait plus générale : mauvais champ choisi, types différents, espaces en trop (`"75 "` n'est pas `"75"`), majuscules (`2A` contre `2a` pour la Corse).

**À retenir :** une jointure qui rate = des valeurs pas strictement identiques ; compare les deux colonnes côte à côte, et lis les codes en texte.

> [!warning] Piège
> Une jointure **n'est pas permanente** : elle vit dans le projet. Pour garder les colonnes dans la couche, **exporte la couche** sous un nouveau fichier.

Concrètement : le projet (`.qgz`) garde la consigne « relier COMMUNE à ce CSV », mais le fichier de la couche (`COMMUNE.shp`) n'a pas changé. Si tu envoies seulement le projet, ou seulement le `.shp`, les colonnes jointes ne suivent pas. Et si tu supprimes le CSV, la jointure n'a plus rien à relier : les colonnes disparaissent.

**Exemple résolu : donner les départements avec leurs hôpitaux à quelqu'un.**

1. Clic droit sur `DEPARTEMENT` > **Exporter > Sauvegarder les objets sous…**
2. Format GeoPackage, nom `departements_hopitaux.gpkg`.
3. Le nouveau fichier contient toutes les colonnes, y compris `hopitaux_nb_hopitaux`, écrites pour de bon.
4. On envoie ce seul fichier : il n'a plus besoin du CSV ni du projet.

**À retenir :** jointure = temporaire, dans le projet ; export = permanent, dans un fichier.

> [!tip] Astuce
> Vérifie le résultat en **triant** la table sur une colonne jointe : s'il y a beaucoup de `NULL`, c'est que beaucoup de communes n'ont pas trouvé leur ligne dans le CSV.

## Mise en page et export d'une carte

Pour produire une image (par exemple `Issy les moulineaux.png`) :

1. **Projet > Nouvelle mise en page** ;
2. ajoute une **carte** ; place le cadre sur la zone voulue ;
3. ajoute **titre**, **légende**, **échelle** et **flèche du nord** ;
4. **Mise en page > Exporter comme image**.

La **mise en page** est une page à part, comme une feuille à imprimer, sur laquelle on pose la carte et ses éléments. Le menu **Projet** l'ouvre ; les autres menus servent à autre chose (**Couche** ajoute des données, **Vecteur** contient les analyses comme le tampon, **Extensions** installe des outils).

> [!tip] Astuce
> Une bonne carte a toujours : un **titre**, une **légende**, une **échelle**, la **source** des données et la **date**.

Chaque élément répond à une question que se pose le lecteur :

| Élément | Question à laquelle il répond |
|---|---|
| Titre | de quoi parle la carte ? |
| Légende | que veulent dire les couleurs et les symboles ? |
| Échelle | combien font 1 cm sur la carte en vrai ? |
| Source | d'où viennent les données (IGN, OSM, INSEE…) ? |
| Date | de quand datent les données ? |
| Flèche du nord | dans quel sens est orientée la carte ? |

**Exemple résolu : relire une carte avant de la rendre.** Tu as une carte des parcs de Lyon avec un titre et une flèche du nord.

| Élément | Présent ? | À faire |
|---|---|---|
| Titre | oui | |
| Légende | non | Ajouter un élément > Légende |
| Échelle | non | Ajouter un élément > Barre d'échelle |
| Source | non | zone de texte « Source : OSM » |
| Date | non | l'ajouter dans la même zone de texte |

Il manque 4 éléments : la carte n'est pas prête. Une fois ajoutés, Mise en page > Exporter comme image.

**À retenir :** une carte doit se comprendre sans toi : titre, légende, échelle, source et date, sans exception.

## Rendre son travail

- Donne le nom de fichier demandé exactement (par exemple `restaurant_italien_montreuil.gpkg`).
- Vérifie que tu as bien exporté **les objets sélectionnés** et non toute la couche.
- Si tu as fait une jointure, rends la couche **exportée** (le fichier qui contient les colonnes), pas seulement le projet.
