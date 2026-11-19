Écris `tri_selection(tab, n)` qui trie le tableau dans l'ordre croissant avec le **tri par sélection** : à chaque étape, on cherche le minimum de la partie pas encore triée et on l'échange avec la première case de cette partie.

```text
5 2 9 1 7  ->  1 2 9 5 7  ->  1 2 9 5 7  ->  1 2 5 9 7  ->  1 2 5 7 9
```

Utilise la fonction `echanger` fournie (elle compte les échanges dans `nb_echanges`). Les tests vérifient que :

- le tableau est bien trié (doublons, valeurs négatives, tableau vide ou d'une case compris) ;
- il y a **au plus `n - 1` échanges** : c'est ce qui distingue le tri par sélection des tris par voisins ;
- un tableau déjà trié ne provoque **aucun** échange : n'échange pas une case avec elle-même.
