# Analyse spatiale et OpenStreetMap

Une **analyse spatiale** utilise la **position** des objets (et non leurs attributs) : « qui est près de quoi ? », « qui est dans quoi ? ».

## La zone tampon (buffer)

Une **zone tampon** est une surface tracée à une distance donnée autour d'un objet.

- Menu **Vecteur > Géotraitement > Tampon**.
- On choisit la couche, la **distance** et on lance.
- La distance est dans l'**unité du système de coordonnées** de la couche.

> [!warning] Piège
> En EPSG:4326 (degrés), « 200 » veut dire 200 **degrés**. Avant un tampon, vérifie que la couche est en **mètres** (EPSG:2154). Sinon, reprojette-la : clic droit > Exporter > Sauvegarder les objets sous… et choisis le bon système.

## Sélection par localisation

**Vecteur > Outils de recherche > Sélectionner par localisation** : on sélectionne les objets d'une couche A qui ont un **lien spatial** avec une couche B.

| Relation | Sens |
|---|---|
| intersecte | les formes se touchent ou se recouvrent |
| contient | A contient entièrement B |
| est à l'intérieur | A est dans B |
| touche | les bords se touchent |

## Exemple du cours : restaurants à moins de 200 m d'une gare

1. Récupérer les **gares** (BD TOPO, couche d'équipements de transport, ou OSM) et les **restaurants** (OSM avec QuickOSM).
2. Reprojeter en **EPSG:2154**.
3. Créer un **tampon de 200 m** autour des gares.
4. **Sélectionner par localisation** les restaurants qui **intersectent** le tampon.

```text
gares  ->  tampon 200 m  ->  restaurants qui intersectent le tampon
```

Variante : le calcul de distance direct avec l'outil **Matrice de distance** ou `distance(...)` dans une expression, mais le tampon est plus simple.

## Les restaurants italiens avec OpenStreetMap

La BD TOPO ne connaît pas les restaurants. Avec **QuickOSM** :

- **Clé** `amenity`, **valeur** `restaurant` : tous les restaurants ;
- ajouter la clé `cuisine`, valeur `italian` : seulement les restaurants italiens ;
- zone : le nom de la commune (par exemple Montreuil).

> [!info] À savoir
> OpenStreetMap n'est pas toujours rempli : un restaurant sans la clé `cuisine` ne sera pas trouvé comme « italien ».

## Exporter le résultat

Clic droit sur la couche > **Exporter > Sauvegarder les objets sélectionnés sous…**

| Format | Quand l'utiliser |
|---|---|
| **GeoPackage** (`.gpkg`) | **à préférer** : un seul fichier, supporte les noms longs et les accents |
| Shapefile (`.shp`) | échange avec d'anciens outils (plusieurs fichiers, noms de champs limités à 10 caractères) |
| CSV | tableau sans géométrie (ou avec X/Y) |

Exemple de livrable du cours : `restaurant_italien_montreuil.gpkg`.

> [!tip] Astuce
> Coche **« Sauvegarder seulement les objets sélectionnés »** pour n'exporter que le résultat de ta requête.
