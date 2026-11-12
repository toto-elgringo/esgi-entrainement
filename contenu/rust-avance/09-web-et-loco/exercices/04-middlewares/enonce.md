Un middleware est une fonction qui **enveloppe** un gestionnaire. Écris-en deux.

- `journaliser(suivant, journal)` : avant d'appeler `suivant`, ajoute la ligne `début <chemin>` au journal ; après, ajoute `fin <chemin> <statut>`. La réponse du gestionnaire est renvoyée telle quelle.
- `exiger_jeton(suivant, attendu)` : si la requête porte le jeton `attendu`, appelle `suivant`. Sinon, répond `401` avec le corps `non autorisé` **sans** appeler `suivant`.

Le journal est partagé : `Rc<RefCell<Vec<String>>>`.

Exemple avec `journaliser(exiger_jeton(page, "secret"), journal)` et une requête `/prive` sans jeton :

```text
début /prive
fin /prive 401
```
