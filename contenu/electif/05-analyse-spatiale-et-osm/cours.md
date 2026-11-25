# Analyse spatiale et OpenStreetMap

Une **analyse spatiale** utilise la **position** des objets (et non leurs attributs) : « qui est près de quoi ? », « qui est dans quoi ? ».

### Requête attributaire ou analyse spatiale ?

- Une **requête attributaire** (chapitre précédent) lit seulement la **table d'attributs** : elle compare des valeurs écrites dans des colonnes (`"POPULATION" > 10000`, `"NATURE" = 'Type autoroutier'`). Outils : **Sélectionner par expression**, **Filtre**.
- Une **analyse spatiale** regarde la **carte** : où est l'objet, à quelle distance d'un autre, s'il touche ou recouvre un autre. Outils : **Tampon**, **Sélectionner par localisation**.

**Exemple résolu : attributaire ou spatiale ?**

| Question | Ce qu'il faut regarder | Type |
|---|---|---|
| Quels bâtiments font plus de 20 m de haut ? | la colonne `HAUTEUR` de la table | attributaire |
| Quels bâtiments sont à moins de 50 m de la Seine ? | la distance entre deux formes sur la carte | spatiale |
| Quelles routes s'appellent « Rue de la Paix » ? | la colonne du nom | attributaire |
| Quelles écoles sont dans le 11e arrondissement ? | si le point de l'école est dans la surface de l'arrondissement | spatiale |

Pour décider, demande-toi : « la réponse est-elle déjà écrite dans une colonne du tableau ? » Oui : attributaire. Non, il faut mesurer ou comparer des positions : spatiale.

**À retenir :** attributaire = on lit le tableau ; spatiale = on regarde où sont les objets les uns par rapport aux autres.

## La zone tampon (buffer)

Une **zone tampon** est une surface tracée à une distance donnée autour d'un objet.

- Menu **Vecteur > Géotraitement > Tampon**.
- On choisit la couche, la **distance** et on lance.
- La distance est dans l'**unité du système de coordonnées** de la couche.

La forme du tampon dépend de la géométrie de départ :

| Objet de départ | Tampon obtenu |
|---|---|
| un point (une gare) | un disque dont le rayon vaut la distance |
| une ligne (une route) | une bande de chaque côté de la ligne, arrondie aux bouts |
| une surface (un parc) | la surface agrandie tout autour de la distance choisie |

Le résultat est une **nouvelle couche** de surfaces (un tampon par objet de départ). La couche d'origine n'est pas modifiée.

> [!warning] Piège
> En EPSG:4326 (degrés), « 200 » veut dire 200 **degrés**. Avant un tampon, vérifie que la couche est en **mètres** (EPSG:2154). Sinon, reprojette-la : clic droit > Exporter > Sauvegarder les objets sous… et choisis le bon système.

### Quelle valeur saisir ?

1. Regarde le système de coordonnées de la couche (propriétés de la couche > Information, ou en bas à droite de QGIS pour le projet).
2. EPSG:2154 (Lambert 93) : l'unité est le **mètre**. EPSG:4326 (WGS 84, latitude / longitude) : l'unité est le **degré**.
3. Si l'unité est le degré, reprojette d'abord en EPSG:2154. Une fois en mètres, convertis la distance demandée **en mètres** : 1 km = 1 000 m.

**Exemple résolu :** une couche d'arrêts de bus est en EPSG:4326 et on veut des tampons de 800 m, puis de 2,5 km.

| Étape | Ce qu'on fait | Résultat |
|---|---|---|
| 1. Lire le système | la couche est en EPSG:4326 | unité = degré, on ne peut pas saisir 800 tel quel |
| 2. Reprojeter | Exporter > Sauvegarder les objets sous… en EPSG:2154 | nouvelle couche en mètres |
| 3. Tampon de 800 m | la distance est déjà en mètres | on saisit **800** |
| 4. Tampon de 2,5 km | 2,5 × 1 000 = 2 500 | on saisit **2500** |

Si on avait saisi 800 sur la couche en degrés, chaque tampon ferait 800 degrés de rayon : une valeur absurde, puisque le tour complet de la Terre ne fait que 360 degrés.

**Erreurs fréquentes :** saisir 2,5 pour 2,5 km sur une couche en mètres (on obtient un tampon de 2,5 m, à peine visible) ; oublier de reprojeter.

**À retenir :** la distance d'un tampon est dans l'unité de la couche ; en Lambert 93 c'est le mètre, donc tout se convertit en mètres (km × 1 000).

## Sélection par localisation

**Vecteur > Outils de recherche > Sélectionner par localisation** : on sélectionne les objets d'une couche A qui ont un **lien spatial** avec une couche B.

Dans la fenêtre, on lit la phrase : « Sélectionner les objets de **[couche A]** qui **[relation]** les objets de **[couche B]** ». La couche A est celle dont on veut garder des objets (les restaurants) ; la couche B sert de comparaison (les tampons).

| Relation | Sens |
|---|---|
| intersecte | les formes se touchent ou se recouvrent |
| contient | A contient entièrement B |
| est à l'intérieur | A est dans B |
| touche | les bords se touchent |
| est disjoint | les formes n'ont **aucun** point commun (l'inverse de « intersecte ») |
| égale | les deux formes sont exactement les mêmes |

« Intersecte » est la relation la plus large : elle prend tout ce qui est dedans, à cheval ou posé sur le bord. C'est presque toujours elle qu'on choisit pour « dans une zone ».

**Exemple résolu :** une couche de pharmacies (points) et un tampon de 300 m autour d'un hôpital. Quelles pharmacies garde chaque relation ?

| Pharmacie | Distance à l'hôpital | Position par rapport au tampon | intersecte ? | est disjoint ? |
|---|---|---|---|---|
| P1 | 120 m | dedans | oui | non |
| P2 | 300 m pile | sur le bord | oui | non |
| P3 | 450 m | dehors | non | oui |

Avec « intersecte », on obtient P1 et P2 : les pharmacies à 300 m ou moins. Avec « est disjoint », on obtient P3 : c'est l'inverse exact. « Égale » ne garde rien : un point n'a jamais la même forme qu'un disque.

S'il y a plusieurs hôpitaux et que leurs tampons se chevauchent, une pharmacie proche des deux n'est sélectionnée **qu'une fois** : une sélection est une liste d'objets, sans doublon.

**À retenir :** pour « les objets dans la zone », sélectionne la couche à filtrer (A) avec la relation **intersecte** par rapport à la couche zone (B).

### Par localisation ou par expression ?

- **Sélectionner par expression** : une condition sur les **colonnes** (`"cuisine" = 'italian'`). Ne regarde jamais la carte.
- **Sélectionner par localisation** : une condition sur la **position** par rapport à une autre couche.

Pour « les restaurants dans le tampon », l'information « je suis dans le tampon » n'est écrite dans aucune colonne : seule la sélection par localisation peut la trouver.

**À retenir :** si la condition parle de distance, d'inclusion ou de contact entre deux couches, c'est **par localisation**.

## Exemple du cours : restaurants à moins de 200 m d'une gare

1. Récupérer les **gares** (BD TOPO, couche d'équipements de transport, ou OSM) et les **restaurants** (OSM avec QuickOSM).
2. Reprojeter en **EPSG:2154**.
3. Créer un **tampon de 200 m** autour des gares.
4. **Sélectionner par localisation** les restaurants qui **intersectent** le tampon.

```text
gares  ->  tampon 200 m  ->  restaurants qui intersectent le tampon
```

Pourquoi cet ordre :

| Étape | Pourquoi à ce moment-là |
|---|---|
| Reprojeter | le tampon a besoin de mètres : sans ça, « 200 » serait faux dès l'étape suivante |
| Tampon | il crée la zone « à moins de 200 m » qui n'existait pas encore |
| Sélection par localisation | elle a besoin de la zone pour savoir quels restaurants garder |
| Export (plus bas) | on ne peut exporter le résultat qu'une fois la sélection faite |

Les outils qui ne servent **pas** ici : la **jointure** (elle relie un tableau à une couche par une colonne commune), le **filtre** (il cache des objets d'après leurs attributs), la **fusion** de couches (elle assemble plusieurs couches en une), la **symbologie** (elle change seulement les couleurs). Aucun ne trace de zone autour d'un objet.

Variante : le calcul de distance direct avec l'outil **Matrice de distance** ou `distance(...)` dans une expression, mais le tampon est plus simple.

**À retenir :** « les X à moins de N m des Y » = EPSG:2154, tampon de N m autour des Y, sélection par localisation des X qui intersectent.

## Les restaurants italiens avec OpenStreetMap

La BD TOPO ne connaît pas les restaurants. Avec **QuickOSM** :

- **Clé** `amenity`, **valeur** `restaurant` : tous les restaurants ;
- ajouter la clé `cuisine`, valeur `italian` : seulement les restaurants italiens ;
- zone : le nom de la commune (par exemple Montreuil).

### Comment fonctionne une étiquette OSM

Dans OpenStreetMap (OSM), chaque objet porte des **étiquettes** (*tags*) de la forme `clé=valeur` :

- la **clé** dit de quoi on parle (`amenity` = un équipement ou service, `shop` = un commerce, `cuisine` = le type de cuisine) ;
- la **valeur** précise (`restaurant`, `bakery`, `japanese`…).

Les clés et les valeurs sont en **anglais** et en **minuscules** : `italian`, pas `italien` ni `Italian`. Quand on met deux conditions dans QuickOSM, l'objet doit avoir **les deux** étiquettes.

**QuickOSM** (extension à installer : Extensions > Installer/Gérer les extensions) interroge les données d'OSM et les charge comme une couche. Ne le confonds pas avec **QuickMapServices**, qui ajoute seulement des **fonds de carte** (des images) sans données utilisables.

**Exemple résolu : les restaurants japonais et les boulangeries de Vincennes.**

| Ce qu'on cherche | Clé | Valeur | Remarque |
|---|---|---|---|
| tous les restaurants | `amenity` | `restaurant` | le restaurant est un « équipement » |
| seulement les japonais | `cuisine` | `japanese` | deuxième condition, en plus de la première |
| les boulangeries | `shop` | `bakery` | une boulangerie est un commerce : la clé change |

Dans QuickOSM : on saisit la première clé et sa valeur, on ajoute une ligne pour la deuxième condition, on choisit « Dans » et on tape `Vincennes`, puis **Exécuter la requête**. La couche obtenue arrive en EPSG:4326 : pense à la reprojeter avant un tampon.

**Erreurs fréquentes :** écrire la valeur en français (`japonais`), mettre une majuscule, ou chercher une boulangerie avec `amenity` (rien ne sort).

**À retenir :** une requête OSM = des couples `clé=valeur` en anglais et en minuscules ; chaque condition ajoutée resserre le résultat.

> [!info] À savoir
> OpenStreetMap n'est pas toujours rempli : un restaurant sans la clé `cuisine` ne sera pas trouvé comme « italien ».

## Exporter le résultat

Clic droit sur la couche > **Exporter > Sauvegarder les objets sélectionnés sous…**

| Format | Quand l'utiliser |
|---|---|
| **GeoPackage** (`.gpkg`) | **à préférer** : un seul fichier, supporte les noms longs et les accents |
| Shapefile (`.shp`) | échange avec d'anciens outils (plusieurs fichiers, noms de champs limités à 10 caractères) |
| CSV | tableau sans géométrie (ou avec X/Y) |

Un PDF, un PNG ou un JPEG ne sont pas des formats de données : ce sont des **images** de carte, on ne peut plus sélectionner ni analyser les objets dedans.

Exemple de livrable du cours : `restaurant_italien_montreuil.gpkg`.

> [!tip] Astuce
> Coche **« Sauvegarder seulement les objets sélectionnés »** pour n'exporter que le résultat de ta requête.

Les autres cases de la fenêtre ne filtrent rien : « Ajouter le fichier sauvegardé à la carte » affiche seulement le nouveau fichier dans le projet une fois créé.

**Exemple résolu :** tu as sélectionné 14 boulangeries sur les 230 de la couche, et tu dois rendre `boulangeries_vincennes.gpkg`.

1. L'extension demandée est `.gpkg` : format **GeoPackage**.
2. Nom du fichier : exactement `boulangeries_vincennes`.
3. Système de coordonnées : garde EPSG:2154 si on te le demande en mètres.
4. Coche **Sauvegarder seulement les objets sélectionnés** : le fichier contiendra 14 objets. Sans la case, il en contiendrait 230.
5. Vérifie : ouvre la table d'attributs du nouveau fichier, elle doit avoir 14 lignes.

**À retenir :** l'extension demandée donne le format, et la case « objets sélectionnés » fait la différence entre ton résultat et toute la couche.
