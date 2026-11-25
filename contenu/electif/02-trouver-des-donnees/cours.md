# Trouver et télécharger des données

Un SIG n'est utile que si on a des **données**. Ce chapitre fait le tour des sources vues en cours, puis donne une méthode pour choisir la bonne.

## Les portails de l'IGN

| Site | À quoi il sert |
|---|---|
| **Géoportail** (geoportail.gouv.fr) | **consulter** en ligne cartes, photographies aériennes et données géographiques de référence |
| **cartes.gouv.fr** | le **catalogue** : on cherche un jeu de données et on le **télécharge** |

Pour la BD TOPO, il faut aller dans le catalogue de cartes.gouv.fr, jeu de données `IGNF_BD-TOPO`. Les fichiers eux-mêmes sont hébergés sur `data.geopf.fr`.

**Exemple résolu : tu veux les fichiers de la BD TOPO de Paris pour les ouvrir dans QGIS. Où vas-tu ?**

1. Tu veux **télécharger** des fichiers, pas seulement regarder une carte.
2. Géoportail sert à consulter : ce n'est pas le bon endroit.
3. cartes.gouv.fr est le catalogue de téléchargement : tu y cherches `IGNF_BD-TOPO`, puis le département 75.

Ni le site de QGIS (il donne le logiciel, pas les données), ni OpenStreetMap (une autre carte, faite par des bénévoles) ne fournissent la BD TOPO.

**À retenir :** Géoportail = regarder ; cartes.gouv.fr = télécharger les données de l'IGN.

> [!tip] Astuce
> Le téléchargement est long (plusieurs centaines de Mo). Le jour du cours, le lien direct du département de Paris a été partagé dans le chat : il pointe vers `data.geopf.fr/telechargement/download/BDTOPO/…`.

## Lire le nom d'un fichier BD TOPO

```text
BDTOPO_3-5_TOUSTHEMES_SHP_LAMB93_D075_2026-06-15.7z
```

Le nom est découpé en morceaux séparés par `_`. Chaque morceau donne une information :

| Morceau | Sens |
|---|---|
| `BDTOPO_3-5` | produit et version (3.5) |
| `TOUSTHEMES` | tous les thèmes d'un coup |
| `SHP` | format Shapefile |
| `LAMB93` | projection Lambert 93 |
| `D075` | département 75 (Paris) |
| `2026-06-15` | date de l'édition |
| `.7z` | archive compressée : il faut un outil comme 7-Zip pour l'ouvrir |

Quelques repères pour les autres valeurs possibles :

- **format** : `SHP` = Shapefile, `GPKG` = GeoPackage (un seul fichier qui contient toutes les couches), aussi `CSV` (un tableau texte) ou `GeoJSON` (du texte au format JSON, courant sur le web) ;
- **projection** : `LAMB93` = Lambert 93 (EPSG:2154), `WGS84` = coordonnées GPS en degrés ;
- **département** : `D` + le numéro écrit sur **3 chiffres** (`D075` pour 75, `D013` pour 13, `D971` pour la Guadeloupe) ;
- **date** : écrite **année-mois-jour** (format international).

**Exemple résolu : on lit `BDTOPO_3-5_TOUSTHEMES_GPKG_LAMB93_D069_2025-03-21.7z`.**

1. `GPKG` : format GeoPackage (et non Shapefile).
2. `LAMB93` : projection Lambert 93.
3. `D069` : on enlève le `D` et le zéro qui sert seulement à faire 3 chiffres, il reste le département **69** (Rhône).
4. `2025-03-21` : année 2025, mois 03 (mars), jour **21**. Piège : le jour est le **dernier** nombre, pas celui du milieu.
5. `.7z` : c'est l'archive qui contient les couches, pas le format des couches. On l'ouvre avec 7-Zip (ou un outil équivalent), ni avec un navigateur, ni avec Excel, ni avec le Bloc-notes.

**À retenir :** découpe le nom aux `_` et lis chaque morceau ; date = année-mois-jour ; `.7z` = l'emballage, pas le format des couches.

## L'Institut Paris Region

L'**Institut Paris Region** étudie l'aménagement et l'urbanisme en Île-de-France et publie des études avec des données ouvertes. Publications citées en cours :

- **Réseaux routiers en Île-de-France** ;
- **Le réseau cyclable structurant** (RCS) : schéma de plus de 4 500 km d'itinéraires continus couvrant la région ;
- **Les logements pour les étudiants** : recensement des résidences étudiantes (Crous, etc.) ;
- **Le parc social francilien** : près du quart des résidences principales, environ 1 370 000 logements au 1er janvier 2020 ;
- **L'offre de locations saisonnières** à la veille des JOP 2024 ;
- **30 ans de production de la ville** : le recyclage urbain limite la consommation d'espaces agricoles et naturels ;
- **Le MOS** (Mode d'occupation du sol) : une des plus anciennes et complètes bases d'occupation du sol à l'échelle régionale, avec 11 millésimes.

Un **millésime**, c'est une **édition datée** de la même base (comme l'année d'un vin). Avec 11 millésimes, le MOS décrit l'occupation du sol à 11 dates différentes : on peut donc **comparer** et voir l'évolution (champs devenus logements, par exemple). La BD TOPO, elle, décrit le territoire à la date de son édition.

**Exemple résolu : un itinéraire du réseau cyclable, c'est quelle géométrie ?** Un itinéraire se parcourt d'un bout à l'autre : il n'a pas d'aire utile, mais une longueur. C'est donc une **ligne** (comme une route). Les 4 500 km sont d'ailleurs la longueur totale de ces lignes.

**À retenir :** Institut Paris Region = études et données sur l'Île-de-France ; MOS = occupation du sol en plusieurs dates, pour voir l'évolution.

## Un document d'urbanisme : le SCoT

Le **SCoT** (Schéma de cohérence territoriale) fixe les grandes orientations d'aménagement d'un territoire intercommunal (logement, transports, espaces naturels). Une **intercommunalité** est un regroupement de plusieurs communes voisines qui décident ensemble. L'exemple cité : le résumé du projet de SCoT de **Marne-et-Gondoire** (document PDF).

Le SCoT ne fixe ni une projection, ni le prix des logements, ni le nom des communes : c'est un **projet** qui dit où construire, où protéger la nature, comment organiser les transports.

**À retenir :** SCoT = le plan d'aménagement d'un groupe de communes.

## OpenStreetMap

**OpenStreetMap** (OSM) est une carte du monde **libre, gratuite, construite par des contributeurs** bénévoles (comme Wikipédia). Elle contient des commerces, restaurants (avec le type de cuisine), gares, etc. Elle sert de fond de carte et de source de données quand la BD TOPO ne suffit pas.

> [!warning] Piège
> Les données OSM sont ajoutées par des bénévoles : elles peuvent être incomplètes ou mal étiquetées. Vérifie toujours le résultat.

**Exemple résolu : tu comptes les boulangeries d'une rue avec OSM et tu en trouves 2. Peux-tu l'affirmer ?**

1. **Cause possible d'erreur :** personne n'a peut-être encore ajouté la 3e boulangerie ; une boulangerie fermée l'an dernier est peut-être encore présente ; une autre est peut-être notée « commerce » sans préciser « boulangerie ».
2. **Vérification :** comparer avec une autre source (photo aérienne de Géoportail, annuaire, site d'avis, ou aller voir sur place) et regarder la **date de dernière modification** des objets.
3. **Conclusion :** tu annonces le résultat en citant la source et la date (« 2 boulangeries selon OSM, données de mars 2026 »).

**À retenir :** OSM = utile et gratuit mais collaboratif ; donne la cause du doute, recoupe avec une autre source, note la date.

## Choisir la bonne source

| Besoin | Source |
|---|---|
| données de référence (bâtiments, routes, limites, eau) | **BD TOPO** (catalogue cartes.gouv.fr) |
| regarder une carte ou une photo aérienne | **Géoportail** |
| évolution de l'occupation du sol en Île-de-France | **MOS** (Institut Paris Region) |
| études franciliennes (vélo, logement étudiant, logement social) | **Institut Paris Region** |
| commerces, restaurants, points d'intérêt | **OpenStreetMap** |
| orientations d'aménagement d'une intercommunalité | **SCoT** |

**Exemple résolu : tu cherches les pharmacies de ton quartier.** Une pharmacie est un commerce, pas une donnée de référence décrivant le territoire : la BD TOPO n'est pas faite pour lister les commerces. Le MOS décrit des types d'occupation (habitat, bois…), pas des commerces un par un. Le SCoT est un projet, pas un inventaire. Il reste **OpenStreetMap**, à vérifier.

Attention aux faux choix : Shapefile est un **format**, Lambert 93 une **projection**, QGIS un **logiciel** : aucun n'est une source de données.

**À retenir :** demande-toi « quelle sorte d'information ? » (référence, évolution, commerce, projet) puis prends la source qui la produit.

## Avant de télécharger

- Vérifie le **format** (SHP, GPKG, CSV…) et le **système de coordonnées**.
- Vérifie la **date** de l'édition.
- Vérifie la **licence** : les données ouvertes sont réutilisables, mais il faut citer la source.
