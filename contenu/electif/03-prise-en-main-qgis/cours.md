# Prise en main de QGIS

## Installer QGIS

Le logiciel se télécharge sur **qgis.org/download**. L'installation est longue : prévois du temps avant le cours.

## Les extensions

Une **extension** (plugin) ajoute des fonctions à QGIS. Menu **Extensions > Installer/Gérer les extensions**, puis on cherche par nom.

Deux extensions ont été demandées en cours :

| Extension | Usage |
|---|---|
| **QuickMapServices** | ajouter un fond de carte (dont OpenStreetMap) en quelques clics |
| **QuickOSM** | télécharger des données OpenStreetMap (restaurants, gares…) directement dans QGIS |

> [!info] À savoir
> Si tu ne trouves pas une extension, vérifie l'orthographe dans la barre de recherche et que l'onglet « Toutes » est sélectionné. Les noms exacts sont dans les supports du cours.

## Un fond de carte

Un **fond de carte** est une image (carte ou photo) placée **sous** tes couches pour te repérer. OpenStreetMap est le plus courant.

> [!warning] Piège
> Si un message **« API key required »** apparaît sur la carte, le fond choisi demande une clé d'accès. Prends un fond libre comme **OpenStreetMap standard**, ou ouvre un autre fond.

## Le système de coordonnées du projet

Le fond de carte web est en **EPSG:3857** (mètres, projection du web), les données de la BD TOPO en **EPSG:2154**. QGIS les superpose en les convertissant « à la volée », mais pour **mesurer** (distances, zones tampons) il faut des couches en **mètres** : travaille en EPSG:2154.

## La table d'attributs

Clic droit sur la couche > **Ouvrir la table d'attributs**. Chaque ligne est un objet. On peut trier, sélectionner, filtrer et calculer des champs.

## Couleurs et symbologie

Clic droit sur la couche > **Propriétés > Symbologie**. On peut colorer tous les objets pareil, ou par catégorie d'un champ.

> [!info] À savoir
> En cours, la question a été posée : existe-t-il des conventions de couleur (comme « toujours rouge pour x, bleu pour y ») ? Pour une carte, les conventions courantes sont : **bleu pour l'eau, vert pour la végétation, gris pour le bâti, rouge ou orange pour les axes routiers principaux**. Pour les couleurs d'une variable qui augmente, on utilise un **dégradé d'une seule teinte**.

## Quand ça ne répond plus

- La **couche vecteur peut cesser de répondre** si elle est énorme (BATIMENT) : ferme les couches inutiles, attends la fin du chargement, ou filtre la couche.
- Si l'affichage est vide, vérifie la **case cochée** de la couche et le **système de coordonnées** du projet.
- Enregistre souvent le projet (`.qgz`) : il garde l'ordre des couches et leur style, mais **pas les données**. Garde donc les fichiers de données au même endroit.
