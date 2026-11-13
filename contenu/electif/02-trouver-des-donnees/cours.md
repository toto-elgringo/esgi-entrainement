# Trouver et télécharger des données

Un SIG n'est utile que si on a des **données**. Ce chapitre fait le tour des sources vues en cours.

## Les portails de l'IGN

| Site | À quoi il sert |
|---|---|
| **Géoportail** (geoportail.gouv.fr) | consulter cartes, photographies aériennes et données géographiques de référence |
| **cartes.gouv.fr** | le **catalogue** : on cherche un jeu de données et on le télécharge |

Pour la BD TOPO, il faut aller dans le catalogue de cartes.gouv.fr, jeu de données `IGNF_BD-TOPO`.

> [!tip] Astuce
> Le téléchargement est long (plusieurs centaines de Mo). Le jour du cours, le lien direct du département de Paris a été partagé dans le chat : il pointe vers `data.geopf.fr/telechargement/download/BDTOPO/…`.

## Lire le nom d'un fichier BD TOPO

```text
BDTOPO_3-5_TOUSTHEMES_SHP_LAMB93_D075_2026-06-15.7z
```

| Morceau | Sens |
|---|---|
| `BDTOPO_3-5` | produit et version (3.5) |
| `TOUSTHEMES` | tous les thèmes d'un coup |
| `SHP` | format Shapefile |
| `LAMB93` | projection Lambert 93 |
| `D075` | département 75 (Paris) |
| `2026-06-15` | date de l'édition |
| `.7z` | archive compressée : il faut un outil comme 7-Zip pour l'ouvrir |

## L'Institut Paris Region

L'**Institut Paris Region** étudie l'aménagement et l'urbanisme en Île-de-France et publie des études avec des données ouvertes. Publications citées en cours :

- **Réseaux routiers en Île-de-France** ;
- **Le réseau cyclable structurant** (RCS) : schéma de plus de 4 500 km d'itinéraires continus couvrant la région ;
- **Les logements pour les étudiants** : recensement des résidences étudiantes (Crous, etc.) ;
- **Le parc social francilien** : près du quart des résidences principales, environ 1 370 000 logements au 1er janvier 2020 ;
- **L'offre de locations saisonnières** à la veille des JOP 2024 ;
- **30 ans de production de la ville** : le recyclage urbain limite la consommation d'espaces agricoles et naturels ;
- **Le MOS** (Mode d'occupation du sol) : une des plus anciennes et complètes bases d'occupation du sol à l'échelle régionale, avec 11 millésimes.

## Un document d'urbanisme : le SCoT

Le **SCoT** (Schéma de cohérence territoriale) fixe les grandes orientations d'aménagement d'un territoire intercommunal (logement, transports, espaces naturels). L'exemple cité : le résumé du projet de SCoT de **Marne-et-Gondoire** (document PDF).

## OpenStreetMap

**OpenStreetMap** (OSM) est une carte du monde **libre, construite par des contributeurs**. Elle contient des commerces, restaurants, gares, etc. Elle sert de fond de carte et de source de données quand la BD TOPO ne suffit pas.

> [!warning] Piège
> Les données OSM sont ajoutées par des bénévoles : elles peuvent être incomplètes ou mal étiquetées. Vérifie toujours le résultat.

## Avant de télécharger

- Vérifie le **format** (SHP, GPKG, CSV…) et le **système de coordonnées**.
- Vérifie la **date** de l'édition.
- Vérifie la **licence** : les données ouvertes sont réutilisables, mais il faut citer la source.
