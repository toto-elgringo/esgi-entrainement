Cette fois, le code contient **ses propres tests** dans le module `mes_tests`. Ils sont lancés avec ceux de la plateforme quand tu cliques sur « Vérifier » : **tous** doivent passer.

Trois choses à corriger :

1. Le test `division_avec_reste` ne compile pas (**E0308**, « mismatched types ») : il compare un `u32` avec `3.5`. Corrige la valeur attendue (division **entière**).
2. `diviser(a, 0)` doit paniquer avec le message exact `"division par zéro"` (au lieu du message anglais de Rust).
3. Le test `division_par_zero` panique, donc il échoue. Indique à Rust que cette panique est **attendue**, avec le bon message.

> [!warning] Le nom du module
> La plateforme ajoute un module `mod tests` à la fin de ton code. C'est pour ça que tes tests sont dans `mod mes_tests` : deux modules ne peuvent pas avoir le même nom.

> [!tip] Bonus
> Ajoute un quatrième test à `mes_tests` qui utilise `assert!` ou `assert_ne!`.
