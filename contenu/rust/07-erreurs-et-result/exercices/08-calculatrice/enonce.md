Écris `calculer(expression)` qui évalue un calcul de la forme `nombre opérateur nombre`, séparés par des espaces : `"12 + 30"`.

Opérateurs : `+`, `-`, `*`, `/` (division entière). Les erreurs, dans cet ordre de vérification :

1. pas exactement trois morceaux → `FormatInvalide` ;
2. un nombre illisible → `NombreInvalide(le texte fautif)` (on lit d'abord celui de gauche) ;
3. opérateur inconnu → `OperateurInconnu(l'opérateur)` ;
4. division par zéro → `DivisionParZero`.

| Appel | Résultat |
|---|---|
| `calculer("12 + 30")` | `Ok(42)` |
| `calculer("8 / 0")` | `Err(DivisionParZero)` |
| `calculer("2 ^ 3")` | `Err(OperateurInconnu("^"))` |
| `calculer("deux + 2")` | `Err(NombreInvalide("deux"))` |
| `calculer("1 +")` | `Err(FormatInvalide)` |

> [!tip] Découper le texte
> `expression.split_whitespace()` découpe le texte aux espaces. On récupère les morceaux un par un avec `.next()`, qui renvoie un `Option` (`None` quand il n'y en a plus).
