Une boutique enregistre ses achats : le client, la catégorie et le montant en euros. Construis un petit **pipeline** d'analyse avec des fonctions **pures** : aucune ne modifie la liste reçue, chacune renvoie une nouvelle valeur. La fonction `exemple()` fournit des données.

1. `totaliser_par(achats, cle)` : le total des montants pour chaque valeur de la clé. `cle` est une fonction qui dit, pour un achat, dans quel groupe le ranger.
2. `total_par_client(achats)` : le total dépensé par chaque client. Utilise `totaliser_par`.
3. `total_par_categorie(achats)` : le total rapporté par chaque catégorie. Utilise `totaliser_par`.
4. `meilleurs_clients(achats, n)` : les `n` clients qui ont le plus dépensé, avec leur total, du plus grand au plus petit. En cas d'égalité, par ordre alphabétique.
5. `categorie_phare(achats)` : la catégorie qui rapporte le plus (en cas d'égalité, la première dans l'ordre alphabétique), ou `None` s'il n'y a aucun achat.
6. `avec_remise(achats, categorie, pourcentage)` : une **nouvelle** liste où les achats de cette catégorie coûtent `pourcentage` % de moins, arrondi vers le bas : `montant * (100 - pourcentage) / 100`. Les autres achats ne changent pas.

Pas de boucle `for` : des chaînes d'itérateurs. Un `mut` local est accepté seulement pour l'accumulateur d'un `fold` ou pour trier une liste qui t'appartient (les tests ne vérifient que les résultats).

Avec `let achats = exemple();` :

| Appel | Résultat |
|---|---|
| `total_par_client(&achats)` | `{"Ana": 77, "Léo": 69, "Mia": 48, "Zoé": 45}` |
| `total_par_categorie(&achats)` | `{"jeux": 145, "livres": 52, "musique": 42}` |
| `meilleurs_clients(&achats, 2)` | `[("Ana", 77), ("Léo", 69)]` |
| `categorie_phare(&achats)` | `Some("jeux")` |
| `avec_remise(&achats, "jeux", 50)[1].montant` | `30` (au lieu de 60) |

> [!info] `BTreeMap`
> Elle s'utilise comme une `HashMap`, mais range ses clés dans l'ordre alphabétique : l'affichage et les comparaisons donnent toujours le même ordre.

> [!tip] Des fonctions qui se branchent entre elles
> Comme tout est pur, les fonctions se composent : `categorie_phare(&avec_remise(&achats, "jeux", 100))` donne la catégorie phare si les jeux devenaient gratuits, sans rien changer à `achats`.
