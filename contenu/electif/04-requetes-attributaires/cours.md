# Requêtes attributaires

Une **requête attributaire** sélectionne des objets d'après les **valeurs de leur table d'attributs** (et non leur position). Elle pose une question au tableau : « quelles lignes ont telle valeur dans telle colonne ? ».

Choisir les objets d'après **leur position** (ceux qui sont à moins de 200 m d'une gare, ceux qui sont dans un arrondissement…) est une autre famille d'outils : l'**analyse spatiale**. Une requête attributaire ne regarde ni la position, ni la couleur, ni la projection : seulement les valeurs des champs.

**Exemple résolu : attributaire ou spatial ?**

| Question | Ce qu'on regarde | Type |
|---|---|---|
| les routes dont la vitesse est 50 | la colonne vitesse | attributaire |
| les bâtiments de plus de 3 étages | la colonne nombre d'étages | attributaire |
| les bâtiments à moins de 100 m de la Seine | la distance sur la carte | spatial |

**À retenir :** si la réponse se lit dans une colonne du tableau, c'est une requête attributaire.

## Deux outils dans QGIS

| Outil | Où | Effet |
|---|---|---|
| **Sélectionner par expression** | barre d'outils, icône ε | **surligne** les objets qui répondent à la condition |
| **Filtre** | clic droit sur la couche > Filtrer | **masque** tous les autres objets (la couche ne garde que ceux-là) |

Aucun des deux ne **supprime** de données : la sélection surligne (en jaune) et laisse tout visible ; le filtre cache les autres objets tant qu'il est actif, et on peut l'enlever.

> [!tip] Astuce
> Commence par **sélectionner** pour vérifier le résultat. Utilise le filtre seulement quand tu es sûr : il cache le reste de la couche.

**Exemple résolu : tu sélectionnes les parcs de plus de 1 hectare et 8 objets sont surlignés.** Le résultat te paraît juste : tu mets alors la même expression en **filtre**. La couche n'affiche plus que ces 8 parcs, les autres sont cachés (pas effacés). Si plus tard tu ne vois qu'une partie d'une couche sans comprendre pourquoi, pense à un filtre resté actif (une icône d'entonnoir à côté du nom de la couche).

**À retenir :** sélectionner = surligner pour vérifier ; filtrer = n'afficher que ceux-là.

## Écrire une expression

Un nom de champ s'écrit entre **guillemets doubles**, un texte entre **apostrophes**.

```text
"NATURE" = 'Type autoroutier'
"POPULATION" > 10000
"USAGE1" = 'Résidentiel' AND "HAUTEUR" > 4
```

Trois règles d'écriture :

1. **Champ** (le nom d'une colonne) : entre guillemets doubles, `"NOM_DU_CHAMP"`.
2. **Texte** (une valeur écrite dans une case) : entre apostrophes, `'valeur'`, et **exactement** comme dans la table (mêmes majuscules, accents, espaces).
3. **Nombre** : sans rien autour et sans espace, `10000` (pas `'10 000'`, qui serait lu comme un texte).

| Opérateur | Sens |
|---|---|
| `=`, `<>` | égal, différent |
| `>`, `<`, `>=`, `<=` | comparaisons |
| `AND` | les deux conditions doivent être vraies |
| `OR` | au moins une condition vraie |
| `NOT` | contraire |
| `LIKE` | texte qui ressemble (`%` = n'importe quoi) |
| `IN` | valeur dans une liste |

Les opérateurs s'écrivent en anglais : on lit `AND` « et », mais on n'écrit pas `ET` dans QGIS.

**Exemple résolu : écrire « les voies dont le nom commence par Rue ».**

1. Le champ : `"NOM"`, entre guillemets doubles.
2. La valeur cherchée : un texte qui commence par `Rue` et continue avec n'importe quoi : `'Rue%'` (le `%` remplace « n'importe quoi »).
3. Comme ce n'est pas une égalité exacte, on utilise `LIKE`.

```text
"NOM" LIKE 'Rue%'
```

Autre exemple : les bâtiments dont l'usage est sportif **ou** religieux, avec une liste :

```text
"USAGE1" IN ('Sportif', 'Religieux')
```

**Pièges d'écriture :**

| Écriture | Ce que QGIS comprend | Problème |
|---|---|---|
| `'HAUTEUR' > 10` | le **texte** « HAUTEUR » comparé à 10 | ce n'est plus le champ, le résultat est faux |
| `"Sportif"` comme valeur | un **champ** nommé Sportif | ce champ n'existe pas : erreur |
| `HAUTEUR > 10` sans guillemets | marche souvent, mais casse si le nom a un espace ou un accent | prends l'habitude des guillemets doubles |
| `"HAUTEUR" > '10'` | un nombre comparé à un texte | résultat incertain : un nombre s'écrit sans apostrophes |

**À retenir :** guillemets doubles = champ ; apostrophes = texte ; nombre = tout nu.

### Strictement plus, ou au moins ?

| En français | Opérateur | 10 est-il gardé pour « … 10 » ? |
|---|---|---|
| plus de 10 / strictement supérieur | `>` | non |
| au moins 10 / 10 ou plus | `>=` | oui |
| moins de 10 | `<` | non |
| au plus 10 | `<=` | oui |
| exactement 10 | `=` | oui, et seulement lui |
| tout sauf 10 | `<>` | non |

**Exemple résolu : « les bâtiments d'au moins 3 étages ».** On teste trois bâtiments :

| Étages | `"NB_ETAGES" > 3` | `"NB_ETAGES" >= 3` |
|---|---|---|
| 2 | non | non |
| 3 | **non** | **oui** |
| 5 | oui | oui |

« Au moins 3 » doit garder le bâtiment de 3 étages : c'est donc `>=`.

**À retenir :** « plus de » = `>` (la valeur exclue) ; « au moins » = `>=` (la valeur incluse).

### Relier deux conditions : AND ou OR ?

**Exemple résolu : dans une couche de rues avec les champs `SENS_UNIQUE` (Oui / Non) et `VITESSE`, « les rues à sens unique et limitées à 30 km/h ».** Les deux conditions doivent être vraies **ensemble**. On teste quatre rues :

| Rue | Sens unique ? | 30 km/h ? | Avec `AND` | Avec `OR` |
|---|---|---|---|---|
| A | oui | oui | gardée | gardée |
| B | oui | non | rejetée | gardée |
| C | non | oui | rejetée | gardée |
| D | non | non | rejetée | rejetée |

Seule la rue A répond à la demande : il faut `AND`. Avec `OR`, B et C seraient gardées à tort (il suffit d'une condition vraie). `NOT` sert à prendre le contraire d'une condition, et `LIKE` à comparer des textes : aucun des deux ne relie deux conditions.

```text
"SENS_UNIQUE" = 'Oui' AND "VITESSE" = 30
```

**À retenir :** « et en même temps » → `AND` ; « l'un ou l'autre » → `OR`.

## Les trois exercices du cours

1. **Sélectionner uniquement les autoroutes** : couche `TRONCON_DE_ROUTE`, champ `NATURE`, valeur `Type autoroutier`.
2. **Sélectionner les communes de plus de 10 000 habitants** : couche `COMMUNE`, champ `POPULATION`, condition `> 10000`.
3. **Sélectionner les bâtiments résidentiels de plus de 4 m de hauteur** : couche `BATIMENT`, champs `USAGE1` et `HAUTEUR`.

Pour trouver la bonne couche, on se demande **ce que décrit** l'information cherchée : une information sur une route est dans une couche de routes (thème TRANSPORT), une information sur une commune dans `COMMUNE` (ADMINISTRATIF), une information sur un bâtiment dans `BATIMENT` (BATI).

> [!warning] Piège
> La BD TOPO de **Paris (75)** ne contient qu'**une seule commune** : Paris. Pour avoir plusieurs communes de plus de 10 000 habitants, charge un jeu de données de plusieurs départements (Petite Couronne par exemple).

Pourquoi une seule ? Paris est à la fois une **commune** et un **département** (le 75). Ses 20 arrondissements ne sont pas des communes (ils sont dans la couche `ARRONDISSEMENT`). La couche n'est donc ni cassée ni filtrée : il n'y a vraiment qu'une commune dans le département 75.

> [!warning] Piège
> Pour les bâtiments, le champ `USAGE1` ne donne que quelques grands usages (résidentiel, commercial et services, sportif…). Impossible de filtrer par fonction précise (école, mairie…) avec ce seul champ : il faut une autre source (OpenStreetMap).

**Exemple résolu : on cherche les hôpitaux dans `BATIMENT`.**

1. On ouvre la table d'attributs et on regarde les valeurs de `USAGE1` : seulement de grandes catégories.
2. Il n'existe aucune valeur « Hôpital » : aucune expression ne peut donc les trouver, même parfaitement écrite.
3. Il faut une source qui décrit les fonctions précises : **OpenStreetMap**, récupéré avec l'extension **QuickOSM** (type « hôpital »).

**À retenir :** une requête ne trouve que des valeurs qui **existent** dans la table ; sinon, change de source.

## Vérifier le nombre d'objets

Le nombre d'objets sélectionnés s'affiche dans la barre d'état en bas (« 12 objets sélectionnés ») ou dans la table d'attributs. Si le nombre est 0, vérifie l'orthographe de la valeur (majuscules, accents) : regarde les valeurs réelles dans la table.

**Exemple résolu : `"USAGE1" = 'residentiel'` donne 0 objet.** Dans la table, la valeur est écrite `Résidentiel` : majuscule et accent. Pour QGIS, `'residentiel'` est un autre texte. On corrige en `'Résidentiel'`, et les bâtiments sont sélectionnés.

**À retenir :** 0 résultat → recopie la valeur exacte depuis la table.
