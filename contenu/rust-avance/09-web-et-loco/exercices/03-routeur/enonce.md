Complète le `Routeur` : une table (méthode, modèle de chemin, gestionnaire).

- `ajouter(methode, modele, gestionnaire)` enregistre un gestionnaire (une fonction ou une closure `Fn(&Requete) -> Reponse`).
- `traiter(methode, chemin)` cherche la **première** route qui correspond (même méthode et `correspond` réussit), appelle son gestionnaire avec une `Requete` contenant les paramètres capturés, et renvoie sa réponse.
- Aucune route ne correspond : réponse `404` avec le corps `introuvable`.

Les types `Requete` et `Reponse`, la fonction `correspond` et `Requete::param` sont déjà écrits.
