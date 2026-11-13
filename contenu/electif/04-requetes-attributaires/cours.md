# Requêtes attributaires

Une **requête attributaire** sélectionne des objets d'après les **valeurs de leur table d'attributs** (et non leur position).

## Deux outils dans QGIS

| Outil | Où | Effet |
|---|---|---|
| **Sélectionner par expression** | barre d'outils, icône ε | **surligne** les objets qui répondent à la condition |
| **Filtre** | clic droit sur la couche > Filtrer | **masque** tous les autres objets (la couche ne garde que ceux-là) |

> [!tip] Astuce
> Commence par **sélectionner** pour vérifier le résultat. Utilise le filtre seulement quand tu es sûr : il cache le reste de la couche.

## Écrire une expression

Un nom de champ s'écrit entre **guillemets doubles**, un texte entre **apostrophes**.

```text
"NATURE" = 'Type autoroutier'
"POPULATION" > 10000
"USAGE1" = 'Résidentiel' AND "HAUTEUR" > 4
```

| Opérateur | Sens |
|---|---|
| `=`, `<>` | égal, différent |
| `>`, `<`, `>=`, `<=` | comparaisons |
| `AND` | les deux conditions doivent être vraies |
| `OR` | au moins une condition vraie |
| `NOT` | contraire |
| `LIKE` | texte qui ressemble (`%` = n'importe quoi) |
| `IN` | valeur dans une liste |

## Les trois exercices du cours

1. **Sélectionner uniquement les autoroutes** : couche `TRONCON_DE_ROUTE`, champ `NATURE`, valeur `Type autoroutier`.
2. **Sélectionner les communes de plus de 10 000 habitants** : couche `COMMUNE`, champ `POPULATION`, condition `> 10000`.
3. **Sélectionner les bâtiments résidentiels de plus de 4 m de hauteur** : couche `BATIMENT`, champs `USAGE1` et `HAUTEUR`.

> [!warning] Piège
> La BD TOPO de **Paris (75)** ne contient qu'**une seule commune** : Paris. Pour avoir plusieurs communes de plus de 10 000 habitants, charge un jeu de données de plusieurs départements (Petite Couronne par exemple).

> [!warning] Piège
> Pour les bâtiments, le champ `USAGE1` ne donne que quelques grands usages (résidentiel, commercial et services, sportif…). Impossible de filtrer par fonction précise (école, mairie…) avec ce seul champ : il faut une autre source (OpenStreetMap).

## Vérifier le nombre d'objets

Le nombre d'objets sélectionnés s'affiche dans la barre d'état en bas (« 12 objets sélectionnés ») ou dans la table d'attributs. Si le nombre est 0, vérifie l'orthographe de la valeur (majuscules, accents) : regarde les valeurs réelles dans la table.
