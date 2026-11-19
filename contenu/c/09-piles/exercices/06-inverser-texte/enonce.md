La pile dans un tableau est déjà écrite (`estVide`, `empiler`, `depiler`, `sommet`). Utilise-la pour écrire `inverser(texte, resultat)`, qui range dans `resultat` le texte à l'envers :

| `texte` | `resultat` |
|---|---|
| `"abc"` | `"cba"` |
| `"Bonjour !"` | `"! ruojnoB"` |
| `""` | `""` |

Le texte fait au plus 99 caractères ; `resultat` a toujours assez de place. Un caractère est un petit entier en C : on peut l'empiler dans une pile d'`int` et le récupérer dans un `char`.

> [!tip] Méthode
> Empile tous les caractères, puis dépile-les un par un dans `resultat`. N'oublie pas le `'\0'` final : sans lui, `resultat` n'est pas un texte.
