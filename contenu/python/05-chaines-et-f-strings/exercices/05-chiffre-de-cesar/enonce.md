Le **chiffre de César** décale chaque lettre de l'alphabet d'un nombre fixe de rangs. Avec un décalage de 3 : `a` devient `d`, `b` devient `e`... et `x` revient au début : `x` → `a`, `y` → `b`, `z` → `c`.

Écris :

- `chiffrer(texte, decalage)` : décale les lettres **minuscules et majuscules** (en gardant la casse), et laisse les autres caractères intacts. `chiffrer("Hello, World!", 3)` → `"Khoor, Zruog!"` ;
- `dechiffrer(texte, decalage)` : l'opération inverse.

Le décalage peut être négatif ou plus grand que 26.
