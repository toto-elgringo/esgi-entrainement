Un horaire est un tuple `(heures, minutes, secondes)`. Écris d'abord deux fonctions de conversion, puis **réutilise-les** dans les autres au lieu de refaire les calculs :

| Fonction | Renvoie | Exemple |
|---|---|---|
| `en_secondes(heures, minutes, secondes)` | le nombre total de secondes | `en_secondes(1, 10, 3)` → `4203` |
| `en_horaire(secondes)` | le tuple `(heures, minutes, secondes)` | `en_horaire(4203)` → `(1, 10, 3)` |
| `ecart(debut, fin)` | l'écart entre deux horaires, toujours positif, sous forme d'horaire | `ecart((14, 30, 0), (20, 15, 0))` → `(5, 45, 0)` |
| `ajouter(horaire, secondes)` | l'horaire atteint après `secondes` secondes (le nombre peut être négatif), ramené dans la journée | `ajouter((23, 30, 0), 3600)` → `(0, 30, 0)` |
| `duree_totale(horaires)` | la somme de plusieurs durées, sous forme d'horaire (peut dépasser 24 h) | `duree_totale([(1, 50, 0), (0, 20, 30)])` → `(2, 10, 30)` |

> [!tip] Une seule source de vérité
> Si une formule est écrite à un seul endroit, une erreur se corrige à un seul endroit. `ecart`, `ajouter` et `duree_totale` tiennent en une ou deux lignes chacune.
