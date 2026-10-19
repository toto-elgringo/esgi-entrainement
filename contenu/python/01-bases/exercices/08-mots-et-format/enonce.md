Écris trois fonctions sur les chaînes :

- `compter_mots(phrase)` : renvoie le nombre de mots de la phrase (séparés par des espaces). `compter_mots("Il fait beau")` → `3` ;
- `initiales(nom_complet)` : renvoie les initiales en majuscules, chacune suivie d'un point. `initiales("ada lovelace")` → `"A.L."` ;
- `ticket(quantite, article, prix)` : renvoie une ligne de ticket de caisse avec le **prix total** à 2 décimales. `ticket(2, "pomme", 0.7)` → `"2 x pomme : 1.40 e"`.

Utilise `split`, `join` et le formatage avec `%` (ou une f-string).
