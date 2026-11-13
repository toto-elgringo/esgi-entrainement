# Cas d'usage et aménagement du territoire

## À quoi sert un SIG au quotidien ?

Exemples évoqués en cours :

| Métier | Usage |
|---|---|
| **Pompiers** | gérer leurs véhicules et choisir le chemin le plus rapide vers une intervention |
| **Police nationale** | de nombreux logiciels optimisent les patrouilles |
| **Transport et livraison** | optimiser les tournées des camions (même principe que pour les pompiers) |

Le point commun : on **croise** des données (routes, positions, adresses) pour décider mieux et plus vite.

## L'aménagement en Île-de-France

Les publications de l'Institut Paris Region donnent des sujets d'analyse réels :

| Sujet | Données utiles | Question possible |
|---|---|---|
| **Réseau routier** | tronçons de route | quelles communes sont éloignées d'une autoroute ? |
| **Réseau cyclable structurant** | lignes d'itinéraires | combien de kilomètres près d'une gare ? |
| **Logements étudiants** | points (résidences) | quelles résidences à moins de 500 m d'une station ? |
| **Parc social** | logements par commune | quelle part des résidences principales ? |
| **Locations saisonnières** | annonces localisées | où se concentrent-elles avant les JOP 2024 ? |
| **Occupation du sol (MOS)** | surfaces par type d'usage | combien d'espaces naturels remplacés par du bâti ? |

> [!info] À savoir
> **Recyclage urbain** : reconstruire sur des terrains déjà urbanisés. Il limite la consommation d'espaces agricoles et naturels, un des grands enjeux d'un SCoT.

## Un projet type, étape par étape

1. **Poser la question** (ex. où implanter une station ?).
2. **Trouver les données** (IGN, Institut Paris Region, OSM).
3. **Préparer** : bon système de coordonnées, nettoyage.
4. **Analyser** : requêtes attributaires, tampons, sélections spatiales, jointures.
5. **Présenter** : carte lisible et exportée, avec source et date.

> [!tip] Astuce
> Écris ta question en une phrase **avant** d'ouvrir QGIS : elle te dit quelles couches charger et quel outil utiliser.

## Prérequis « web » du cours

Le descriptif du cours mentionnait « web » comme prérequis. Il s'agit surtout de savoir **télécharger des fichiers, ouvrir des archives et utiliser des services en ligne** (catalogues de données, cartes en ligne), pas de programmer un site.
