# SIG, QGIS et BD TOPO

> [!info] À savoir
> Pour l'instant, l'électif n'a fourni que des fichiers (données de Paris, installateur de QGIS). Ce chapitre résume les notions nécessaires pour s'en servir. Il sera complété avec les vrais supports du cours.

## Un SIG, c'est quoi ?

Un **SIG** (**S**ystème d'**I**nformation **G**éographique) est un logiciel qui **stocke, affiche et analyse des données liées à un lieu** sur la Terre : routes, bâtiments, rivières, limites de communes…

Chaque objet a deux parties :

- une **géométrie** : sa forme et sa position (un point, une ligne ou une surface) ;
- des **attributs** : les informations qui le décrivent (nom, hauteur, nombre d'étages…), rangées dans un tableau.

**Exemple résolu : décrire une gare dans un SIG.**

1. Géométrie : où est la gare et quelle forme a-t-elle ? Son bâtiment a un contour au sol, c'est une surface placée à un endroit précis.
2. Attributs : ce qu'on sait d'elle, écrit dans une ligne du tableau : nom = « Gare de Lyon », hauteur = 25, usage = « transport ».
3. Le SIG relie les deux : quand tu cliques sur la forme dans la carte, il affiche la ligne du tableau qui lui correspond.

**À retenir :** un objet de SIG = une forme sur la carte (géométrie) + une ligne dans un tableau (attributs).

## QGIS et les couches

**QGIS** est un SIG **gratuit et libre**. On y empile des **couches** : une couche contient un seul type d'objet (les bâtiments, les routes, les communes…). La carte finale, c'est toutes les couches superposées, comme des calques transparents.

| Type de géométrie | Exemples |
|---|---|
| Point | adresse, pylône, arrêt de bus |
| Ligne | tronçon de route, cours d'eau, voie ferrée |
| Surface (polygone) | bâtiment, commune, parc |

### Choisir le type de géométrie

On se pose trois questions, dans l'ordre :

1. L'objet a-t-il une **aire** (on pourrait mesurer combien de m² il couvre) ? Oui : **surface**.
2. Sinon, a-t-il surtout une **longueur** (on suit un tracé d'un bout à l'autre) ? Oui : **ligne**.
3. Sinon, c'est une simple **position** : **point**.

**Exemple résolu :**

| Objet | A une aire utile ? | A surtout une longueur ? | Géométrie |
|---|---|---|---|
| un stade | oui (le terrain couvre une zone) | | surface |
| une ligne de métro | non (on veut son tracé) | oui | ligne |
| une borne de vélos | non | non (c'est un emplacement) | point |
| un département | oui (un territoire délimité) | | surface |

Le choix dépend aussi de l'**échelle** : vu de très loin, une ville entière peut devenir un point ; vu de près, une large rivière peut être dessinée en surface. On garde le cas **le plus courant**.

**À retenir :** une aire → surface ; un tracé → ligne ; juste un emplacement → point.

### L'ordre des couches

Dans le panneau des couches de QGIS, la couche **du haut est dessinée en dernier**, donc **par-dessus** les autres.

> [!tip] Astuce
> Range les couches de la plus « fine » à la plus « large » : **points en haut, puis lignes, puis surfaces**. Sinon une grande surface cache tout ce qui est en dessous.

**Exemple résolu :** tu as, de haut en bas, `PARC` (surfaces), `ARRET_BUS` (points), `VOIE_FERREE` (lignes), et tu ne vois que les parcs.

1. `PARC` est en haut : ses surfaces pleines recouvrent ce qui est dessous. C'est la cause du problème.
2. On remonte les points (`ARRET_BUS`) tout en haut : ils sont petits et ne cachent presque rien.
3. Les lignes (`VOIE_FERREE`) au milieu.
4. Les surfaces (`PARC`) tout en bas.

Nouvel ordre, de haut en bas : `ARRET_BUS`, `VOIE_FERREE`, `PARC`. Tout est visible.

**À retenir :** haut = dessiné par-dessus ; donc points en haut, lignes au milieu, surfaces en bas.

### Ouvrir une couche et lire ses attributs

Pour ouvrir une couche : menu **Couche > Ajouter une couche > Ajouter une couche vecteur** (ou glisser-déposer le fichier). Pour voir les informations de chaque objet : clic droit sur la couche, **Ouvrir la table d'attributs** (une ligne par objet, une colonne par attribut).

```anim
couches
```

## Le format Shapefile

Le **Shapefile** (SHP) est un format très répandu. Une couche n'est pas un seul fichier mais **plusieurs fichiers de même nom** qui vont ensemble :

| Extension | Contenu | Obligatoire ? |
|---|---|---|
| `.shp` | les formes (géométries) | oui |
| `.shx` | l'index des formes (pour retrouver vite chaque forme dans le `.shp`) | oui |
| `.dbf` | la table des attributs | oui |
| `.prj` | le système de coordonnées | non, mais sans lui QGIS ne sait pas où placer la couche |
| `.cpg` | l'encodage des caractères (comment lire les accents) | non, mais sans lui les accents peuvent s'afficher mal |

Pour mémoriser : *shp* = *shape* (forme), *shx* = index des *shapes*, *dbf* = *database file* (fichier de base de données), *prj* = projection, *cpg* = *code page* (encodage).

Il y a donc deux nombres à ne pas confondre : **3 fichiers obligatoires** (`.shp`, `.shx`, `.dbf`) pour que la couche s'ouvre, et en général **5 fichiers livrés** pour qu'elle soit complète (position et accents compris).

> [!warning] Piège
> Ne sépare jamais les fichiers d'une même couche : un `.shp` seul est inutilisable sans son `.shx` et son `.dbf`.

**Exemple résolu : on te donne `ROUTES.shp`, `ROUTES.dbf` et `ROUTES.prj`. La couche s'ouvre-t-elle ?**

On vérifie les trois obligatoires un par un :

| Fichier obligatoire | Présent ? |
|---|---|
| `ROUTES.shp` | oui |
| `ROUTES.shx` | **non** |
| `ROUTES.dbf` | oui |

Il manque le `.shx` : la couche ne s'ouvre pas correctement. Le `.prj` présent ne remplace pas le fichier manquant. Pour la partager sans problème, on envoie les fichiers de même nom **tous ensemble** (souvent dans un `.zip`).

**À retenir :** une couche Shapefile = tous les fichiers de même nom ; `.shp` + `.shx` + `.dbf` au strict minimum, `.prj` et `.cpg` pour qu'elle soit complète.

```anim
shapefile
```

## La BD TOPO de l'IGN

L'**IGN** (Institut national de l'information géographique et forestière) produit les données de référence en France. Sa **BD TOPO** décrit tout le territoire : bâti, routes, eau, végétation, limites administratives…

Ne pas confondre avec d'autres producteurs : l'**INSEE** fait des statistiques (population, revenus), **Météo-France** des données météo, et **OpenStreetMap** est une carte collaborative remplie par des bénévoles.

Les données reçues : BD TOPO **version 3.5**, département **75 (Paris)**, au format **Shapefile**, en **Lambert 93** (noté `LAMB93` dans le nom du dossier), édition du 15 juin 2026. Elles sont rangées en 9 thèmes :

| Thème | Ce qu'il décrit | Exemples de couches |
|---|---|---|
| ADMINISTRATIF | les limites officielles | COMMUNE, ARRONDISSEMENT, DEPARTEMENT, REGION |
| ADRESSES | les adresses et les noms de rues | ADRESSE_BAN, VOIE_NOMMEE |
| BATI | les constructions | BATIMENT, CIMETIERE, TERRAIN_DE_SPORT |
| HYDROGRAPHIE | l'eau | COURS_D_EAU, TRONCON_HYDROGRAPHIQUE, PLAN_D_EAU |
| LIEUX_NOMMES | les noms de lieux | TOPONYMIE, ZONE_D_HABITATION |
| OCCUPATION_DU_SOL | ce qui couvre le sol | ZONE_DE_VEGETATION, HAIE |
| SERVICES_ET_ACTIVITES | les réseaux et équipements | LIGNE_ELECTRIQUE, CANALISATION |
| TRANSPORT | les voies de circulation | TRONCON_DE_ROUTE, TRONCON_DE_VOIE_FERREE, AERODROME |
| ZONES_REGLEMENTEES | les zones protégées par la loi | FORET_PUBLIQUE, PARC_OU_RESERVE |

**Exemple résolu : où chercher `TRONCON_DE_VOIE_FERREE` ?**

1. On lit le nom : une voie ferrée, c'est le chemin des trains.
2. On cherche le thème qui décrit ce genre de chose : les voies de circulation, donc **TRANSPORT**.
3. Piège du mot « tronçon » : il existe aussi dans HYDROGRAPHIE (`TRONCON_HYDROGRAPHIQUE`, un morceau de cours d'eau). Ce n'est pas le mot « tronçon » qui décide, c'est **de quoi** c'est un tronçon.

Autre piège : `ZONE_DE_VEGETATION` décrit ce qui pousse sur le sol (OCCUPATION_DU_SOL), alors que `FORET_PUBLIQUE` décrit une zone protégée par la loi (ZONES_REGLEMENTEES).

**À retenir :** demande-toi « de quoi parle cette couche ? » (eau, construction, limite officielle, circulation…) puis prends le thème qui porte ce nom.

> [!tip] Astuce
> Le thème BATI contient de gros fichiers : ne charge que les couches utiles.

## Les systèmes de coordonnées

Pour placer un objet, il faut un **système de coordonnées**. Deux familles :

- **coordonnées géographiques** : latitude et longitude, en **degrés** (ex. WGS 84, celui du GPS, code EPSG:4326). Une latitude va de -90 à 90 et une longitude de -180 à 180 ;
- **coordonnées projetées** : la Terre est « aplatie » sur un plan, les coordonnées sont en **mètres**.

Chaque système a un numéro unique, son **code EPSG** :

| Code | Nom | Unité | Usage |
|---|---|---|---|
| EPSG:2154 | RGF93 / Lambert-93 | mètres | projection officielle de la France métropolitaine |
| EPSG:4326 | WGS 84 | degrés | GPS, coordonnées partout dans le monde |
| EPSG:3857 | Web Mercator | mètres | fonds de carte du web (OpenStreetMap, Google Maps), distances déformées |

Le **Lambert 93** (RGF93 / Lambert-93, code **EPSG:2154**) est la projection officielle de la France métropolitaine. Comme ses coordonnées sont en mètres, on mesure directement des distances et des surfaces.

**Exemple résolu : reconnaître l'unité.** On lit le point (648 500 ; 6 859 000).

1. Des degrés ? Impossible : une latitude ne dépasse jamais 90 et une longitude 180, or on lit 648 500.
2. Ce sont donc des **mètres**, dans un système projeté. Pour la France, c'est typiquement le Lambert 93 : X autour de quelques centaines de milliers, Y autour de 6 à 7 millions.
3. À l'inverse, (48,85 ; 2,35) est un couple latitude / longitude en degrés (WGS 84).

**À retenir :** grands nombres (centaines de milliers, millions) = mètres ; petits nombres à virgule (moins de 180) = degrés.

### Mesurer une distance en Lambert 93

Comme les coordonnées sont en mètres sur un plan, la distance en ligne droite entre deux points se calcule avec **Pythagore** :

distance = √( (écart en X)² + (écart en Y)² )

**Exemple résolu :** C = (650 000 ; 6 860 000) et D = (656 000 ; 6 868 000).

1. Écart en X : 656 000 - 650 000 = 6 000 m.
2. Écart en Y : 6 868 000 - 6 860 000 = 8 000 m.
3. Carrés : 6 000² = 36 000 000 et 8 000² = 64 000 000.
4. Somme : 36 000 000 + 64 000 000 = 100 000 000.
5. Racine carrée : √100 000 000 = 10 000. La distance CD vaut **10 000 m**, soit 10 km.

Piège : additionner les écarts (6 000 + 8 000 = 14 000) donne le trajet « en escalier » (d'abord vers l'est, puis vers le nord), pas la ligne droite. Et ce calcul ne marche **pas** en degrés : un degré ne fait pas toujours la même longueur au sol.

**À retenir :** en Lambert 93, distance = √(écart X² + écart Y²), résultat directement en mètres.

> [!warning] Piège
> Vérifie le système du projet (en bas à droite dans QGIS) : il doit être **EPSG:2154** pour les données de la BD TOPO. Mélanger deux systèmes sans conversion décale les couches.

**Exemple résolu : un projet affiche EPSG:4326 et tu charges la BD TOPO.** Les données sont en Lambert 93 (EPSG:2154), le projet en degrés : les mesures ne sont pas en mètres et les couches peuvent mal se superposer. On clique sur le code en bas à droite et on choisit **EPSG:2154**, le même système que les données.

**À retenir :** le projet doit être dans le même système que les données ; pour la BD TOPO, EPSG:2154.

```anim
coordonnees
```
