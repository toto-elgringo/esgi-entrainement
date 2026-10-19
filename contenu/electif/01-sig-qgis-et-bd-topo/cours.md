# SIG, QGIS et BD TOPO

> [!info] À savoir
> Pour l'instant, l'électif n'a fourni que des fichiers (données de Paris, installateur de QGIS). Ce chapitre résume les notions nécessaires pour s'en servir. Il sera complété avec les vrais supports du cours.

## Un SIG, c'est quoi ?

Un **SIG** (Système d'Information Géographique) est un logiciel qui **stocke, affiche et analyse des données liées à un lieu** sur la Terre : routes, bâtiments, rivières, limites de communes…

Chaque objet a deux parties :

- une **géométrie** : sa forme et sa position (un point, une ligne ou une surface) ;
- des **attributs** : les informations qui le décrivent (nom, hauteur, nombre d'étages…), rangées dans un tableau.

## QGIS et les couches

**QGIS** est un SIG **gratuit et libre**. On y empile des **couches** : une couche contient un seul type d'objet (les bâtiments, les routes, les communes…).

| Type de géométrie | Exemples |
|---|---|
| Point | adresse, pylône, arrêt de bus |
| Ligne | tronçon de route, cours d'eau, voie ferrée |
| Surface (polygone) | bâtiment, commune, parc |

> [!tip] Astuce
> Range les couches de la plus « fine » à la plus « large » : **points en haut, puis lignes, puis surfaces**. Sinon une grande surface cache tout ce qui est en dessous.

Pour ouvrir une couche : menu **Couche > Ajouter une couche > Ajouter une couche vecteur** (ou glisser-déposer le fichier). Pour voir les informations de chaque objet : clic droit sur la couche, **Ouvrir la table d'attributs**.

## Le format Shapefile

Le **Shapefile** (SHP) est un format très répandu. Une couche n'est pas un seul fichier mais **plusieurs fichiers de même nom** qui vont ensemble :

| Extension | Contenu |
|---|---|
| `.shp` | les formes (géométries) |
| `.shx` | l'index des formes |
| `.dbf` | la table des attributs |
| `.prj` | le système de coordonnées |
| `.cpg` | l'encodage des caractères |

> [!warning] Piège
> Ne sépare jamais les fichiers d'une même couche : un `.shp` seul est inutilisable sans son `.shx` et son `.dbf`.

## La BD TOPO de l'IGN

L'**IGN** (Institut national de l'information géographique et forestière) produit les données de référence en France. Sa **BD TOPO** décrit tout le territoire : bâti, routes, eau, végétation, limites administratives…

Les données reçues : BD TOPO **version 3.5**, département **75 (Paris)**, au format **Shapefile**, en **Lambert 93**, édition du 15 juin 2026. Elles sont rangées en 9 thèmes :

| Thème | Exemples de couches |
|---|---|
| ADMINISTRATIF | COMMUNE, ARRONDISSEMENT, DEPARTEMENT, REGION |
| ADRESSES | ADRESSE_BAN, VOIE_NOMMEE |
| BATI | BATIMENT, CIMETIERE, TERRAIN_DE_SPORT |
| HYDROGRAPHIE | COURS_D_EAU, TRONCON_HYDROGRAPHIQUE, PLAN_D_EAU |
| LIEUX_NOMMES | TOPONYMIE, ZONE_D_HABITATION |
| OCCUPATION_DU_SOL | ZONE_DE_VEGETATION, HAIE |
| SERVICES_ET_ACTIVITES | LIGNE_ELECTRIQUE, CANALISATION |
| TRANSPORT | TRONCON_DE_ROUTE, TRONCON_DE_VOIE_FERREE, AERODROME |
| ZONES_REGLEMENTEES | FORET_PUBLIQUE, PARC_OU_RESERVE |

> [!tip] Astuce
> Le thème BATI contient de gros fichiers : ne charge que les couches utiles.

## Les systèmes de coordonnées

Pour placer un objet, il faut un **système de coordonnées**. Deux familles :

- **coordonnées géographiques** : latitude et longitude, en **degrés** (ex. WGS 84, celui du GPS, code EPSG:4326) ;
- **coordonnées projetées** : la Terre est « aplatie » sur un plan, les coordonnées sont en **mètres**.

Le **Lambert 93** (RGF93 / Lambert-93, code **EPSG:2154**) est la projection officielle de la France métropolitaine. Comme ses coordonnées sont en mètres, on mesure directement des distances et des surfaces.

> [!warning] Piège
> Vérifie le système du projet (en bas à droite dans QGIS) : il doit être **EPSG:2154** pour les données de la BD TOPO. Mélanger deux systèmes sans conversion décale les couches.
