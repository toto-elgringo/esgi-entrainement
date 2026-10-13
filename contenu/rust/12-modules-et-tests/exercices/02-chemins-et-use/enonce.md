Le restaurant range son menu dans des modules imbriqués.

1. `menu()` ne compile pas (**E0433**, « cannot find module `entrees` in this scope ») : `entrees` et `desserts` sont dans `restaurant`. Corrige avec un `use` (ou des chemins complets).
   `menu()` doit renvoyer `"salade puis tarte"`.
2. Ajoute dans `restaurant` un module public `plats` avec une fonction publique `du_jour()` qui renvoie `"steak"`.
3. Écris `menu_complet()` qui renvoie `"salade, steak puis tarte"`.

> [!tip] Le chemin
> `restaurant::desserts::du_jour()` se lit comme un chemin de fichier : dossier `restaurant`, sous-dossier `desserts`, fonction `du_jour`.
