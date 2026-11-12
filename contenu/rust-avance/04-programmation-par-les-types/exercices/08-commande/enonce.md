Une commande passe par trois étapes : **brouillon**, **validée**, **expédiée**. Chaque étape est un type différent : `Commande<Brouillon>`, `Commande<Validee>`, `Commande<Expediee>`. Les fonctions qui n'ont de sens qu'à une étape n'existent que pour elle (on ne peut pas expédier un brouillon, ni ajouter un article à une commande expédiée).

Le programme et les `decrire` sont déjà écrits. Complète les trois **transitions** :

1. `ajouter(&mut self, article)` sur un brouillon : ajoute l'article à la liste.
2. `valider(self)` : consomme le brouillon. Renvoie `Err("Commande <n> refusée : aucun article")` si la liste est vide, sinon `Ok` d'une commande validée.
3. `expedier(self)` : consomme la commande validée et renvoie une commande expédiée avec le numéro de suivi `"SUIVI-<n>"`.

Le programme doit afficher exactement :

```text
Commande 42 : brouillon, 0 article(s)
Commande 42 : brouillon, 2 article(s)
Commande 42 : validée, 2 article(s)
Commande 42 : expédiée, 2 article(s), suivi SUIVI-42
Commande 7 refusée : aucun article
```

> [!tip] Ici l'état porte des données
> `Expediee { suivi }` contient le numéro de suivi, qui n'existe qu'une fois la commande expédiée. Avec un état qui contient des valeurs, pas besoin de `PhantomData`.
