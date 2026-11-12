# Des listes qui partagent leur fin

Avec `Box`, une liste appartient à un seul propriétaire. Ici le maillon suivant est un `Rc<ListeRc>` : plusieurs listes peuvent **partager** la même fin.

```text
a = 5 -> 10 -> Vide
b = 3 -> (a)
c = 4 -> (a)
```

Écris :

- `somme(liste)` : somme de toutes les valeurs ;
- `prolonger(valeur, suite)` : crée un nouveau maillon `valeur` qui pointe vers `suite` (sans copier `suite`) et le renvoie dans un `Rc` ;
- `nombre_de_liens(liste)` : nombre de propriétaires de ce maillon (le compteur fort).

> [!tip] Astuce
> `Rc::clone(&a)` est très rapide : il ne copie pas la liste, il ajoute seulement 1 au compteur.
