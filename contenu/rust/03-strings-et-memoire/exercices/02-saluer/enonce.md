La fonction `saluer` doit accepter **n'importe quel texte** :

- un texte écrit dans le code : `saluer("Bob")` ;
- une `String` empruntée : `saluer(&prenom)` ;
- un morceau de texte : `saluer(&phrase[0..7])`.

Résultat attendu : `saluer("Bob")` renvoie `"Bonjour Bob !"`.

Le code ne compile pas. Corrige **uniquement la signature** de `saluer`.

> [!tip] Prendre l'emprunt, rendre le possédé
> La fonction lit le nom (paramètre emprunté) et fabrique un nouveau texte (retour possédé : `String`).
