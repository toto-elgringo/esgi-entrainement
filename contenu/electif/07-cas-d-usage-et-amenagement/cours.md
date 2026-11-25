# Cas d'usage et aménagement du territoire

## À quoi sert un SIG au quotidien ?

Exemples évoqués en cours :

| Métier | Usage |
|---|---|
| **Pompiers** | gérer leurs véhicules et choisir le chemin le plus rapide vers une intervention |
| **Police nationale** | de nombreux logiciels optimisent les patrouilles |
| **Transport et livraison** | optimiser les tournées des camions (même principe que pour les pompiers) |

Le point commun : on **croise** des données (routes, positions, adresses) pour décider mieux et plus vite.

« Croiser » veut dire mettre plusieurs couches ensemble pour répondre à une question qu'aucune couche ne règle seule. Par exemple, la couche des routes seule ne dit pas où est l'incendie, et l'adresse de l'incendie seule ne dit pas comment y aller : c'est en les superposant qu'on trouve le trajet.

**Exemple résolu : quelles données croise chaque métier ?**

| Besoin | Données croisées | Décision prise |
|---|---|---|
| Pompiers : partir vers un feu | position des casernes et des camions, réseau routier, adresse de l'appel | quel camion envoyer, par quelle route |
| Police : organiser les patrouilles | secteurs, lieux des incidents passés, rues | où et quand passer en priorité |
| Livreur : faire sa tournée | adresses des colis, réseau routier, horaires | dans quel ordre livrer pour rouler le moins |

Dans les trois cas, la question porte sur des **déplacements** entre des **lieux** : c'est ce que le SIG sait calculer.

**À retenir :** un SIG sert à décider en croisant des lieux (adresses, positions) avec un réseau (routes) ; pompiers et police sont les deux exemples du cours.

## L'aménagement en Île-de-France

L'**aménagement du territoire**, c'est décider où construire, où garder la nature, où faire passer les routes et les transports. Les publications de l'Institut Paris Region (l'agence d'urbanisme de la région) donnent des sujets d'analyse réels :

| Sujet | Données utiles | Question possible |
|---|---|---|
| **Réseau routier** | tronçons de route | quelles communes sont éloignées d'une autoroute ? |
| **Réseau cyclable structurant** | lignes d'itinéraires | combien de kilomètres près d'une gare ? |
| **Logements étudiants** | points (résidences) | quelles résidences à moins de 500 m d'une station ? |
| **Parc social** | logements par commune | quelle part des résidences principales ? |
| **Locations saisonnières** | annonces localisées | où se concentrent-elles avant les JOP 2024 ? |
| **Occupation du sol (MOS)** | surfaces par type d'usage | combien d'espaces naturels remplacés par du bâti ? |

### Le MOS

Le **MOS** (Mode d'occupation du sol) est une carte de toute l'Île-de-France découpée en **surfaces**, chacune avec son usage : forêt, terre agricole, habitat individuel, habitat collectif, activités, routes… Il est refait régulièrement depuis les années 1980 : chaque édition s'appelle un **millésime** (comme pour un vin, c'est l'année).

Pour mesurer comment le territoire change, on **compare deux millésimes** : une surface « terre agricole » dans l'ancien et « habitat » dans le récent a été construite entre les deux.

**Exemple résolu : une commune entre deux millésimes du MOS.**

| Usage | Ancien millésime | Millésime récent | Évolution |
|---|---|---|---|
| Espaces naturels et agricoles | 120 ha | 95 ha | 120 - 95 = 25 ha perdus |
| Habitat | 60 ha | 80 ha | 80 - 60 = 20 ha gagnés |
| Activités | 20 ha | 25 ha | 25 - 20 = 5 ha gagnés |

1. Total de chaque millésime : 120 + 60 + 20 = 200 ha, et 95 + 80 + 25 = 200 ha. La commune ne grandit pas, seuls les usages changent.
2. Les 25 ha perdus par la nature ont été pris par l'habitat (20 ha) et les activités (5 ha) : 20 + 5 = 25.
3. Conclusion : 25 ha d'espaces naturels et agricoles ont été remplacés par du bâti.

Ce type de question ne marche qu'avec une donnée en **surfaces** et **datée** : c'est pour cela qu'on prend le MOS, et pas le réseau cyclable (des lignes) ou les logements étudiants (des points).

**À retenir :** pour suivre l'évolution du bâti face aux espaces naturels, compare deux millésimes du MOS.

> [!info] À savoir
> **Recyclage urbain** : reconstruire sur des terrains déjà urbanisés. Il limite la consommation d'espaces agricoles et naturels, un des grands enjeux d'un SCoT.

Le **SCoT** (Schéma de cohérence territoriale) est un document qui fixe, pour un groupe de communes, les grandes règles d'aménagement : où construire, où protéger la nature. Le contraire du recyclage urbain est l'**étalement urbain** : construire sur des champs ou des forêts en périphérie.

**Exemple résolu : recyclage urbain ou étalement ?**

| Projet | Le terrain était déjà construit ? | Type |
|---|---|---|
| des logements à la place d'une ancienne usine | oui | recyclage urbain |
| un lotissement sur un champ de blé | non | étalement urbain |
| des bureaux dans un ancien parking | oui | recyclage urbain |

**À retenir :** recyclage urbain = reconstruire sur du déjà construit, pour épargner les espaces naturels et agricoles.

## Choisir la géométrie d'une donnée

Pour chaque sujet, il faut savoir sous quelle forme la donnée est dessinée, car cela décide des outils (on mesure une longueur sur une ligne, une aire sur une surface).

On se pose les questions dans l'ordre :

1. L'objet **couvre une zone** dont on veut l'aire (en m² ou en ha) ? **Surface**.
2. Sinon, c'est un **tracé** qu'on suit d'un bout à l'autre, avec une longueur ? **Ligne**.
3. Sinon, seule sa **position** compte ? **Point**.

**Exemple résolu :**

| Donnée | Couvre une zone ? | Un tracé ? | Géométrie |
|---|---|---|---|
| les arrêts de tramway | non | non, un emplacement | point |
| une ligne de tramway | non | oui | ligne |
| les lacs de la région | oui | | surface |
| une voie ferrée | non | oui | ligne |
| les communes | oui | | surface |

**À retenir :** zone avec une aire → surface ; tracé avec une longueur → ligne ; simple emplacement → point.

## Un projet type, étape par étape

1. **Poser la question** (ex. où implanter une station ?).
2. **Trouver les données** (IGN, Institut Paris Region, OSM).
3. **Préparer** : bon système de coordonnées, nettoyage.
4. **Analyser** : requêtes attributaires, tampons, sélections spatiales, jointures.
5. **Présenter** : carte lisible et exportée, avec source et date.

> [!tip] Astuce
> Écris ta question en une phrase **avant** d'ouvrir QGIS : elle te dit quelles couches charger et quel outil utiliser.

On commence par la question parce que tout en découle : sans elle, on ne sait ni quelles couches charger, ni quel outil utiliser, ni quoi montrer sur la carte. Les couleurs, les extensions et l'export viennent après.

**Exemple résolu : « Quels collèges sont à moins de 300 m d'une autoroute ? »**

| Étape | Ce qu'on fait ici |
|---|---|
| 1. Question | les collèges (à garder) et les autoroutes (pour mesurer la distance) ; « 300 m » = une distance, donc un tampon |
| 2. Données | collèges : OSM avec QuickOSM (`amenity=school`, en ne gardant que les collèges) ; autoroutes : BD TOPO, `TRONCON_DE_ROUTE` |
| 3. Préparer | tout reprojeter en EPSG:2154 (mètres) ; ne garder que les autoroutes par une requête attributaire `"NATURE" = 'Type autoroutier'` |
| 4. Analyser | tampon de 300 m autour des autoroutes, puis sélection par localisation des collèges qui intersectent le tampon |
| 5. Présenter | export de la sélection en GeoPackage, puis carte avec titre, légende, échelle, source et date |

Une question attributaire (« quelles communes ont plus de 25 % de logements sociaux ? ») suit le même plan, avec à l'étape 4 une jointure (le CSV du parc social sur la couche des communes) puis une requête attributaire sur la colonne jointe.

**À retenir :** question → données → préparation (EPSG:2154) → analyse → carte ; la question donne les couches, la distance donne le tampon.

## Prérequis « web » du cours

Le descriptif du cours mentionnait « web » comme prérequis. Il s'agit surtout de savoir **télécharger des fichiers, ouvrir des archives et utiliser des services en ligne** (catalogues de données, cartes en ligne), pas de programmer un site.
