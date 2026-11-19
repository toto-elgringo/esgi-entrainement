Comme les commandes `head` et `tail` de Linux, écris deux fonctions qui renvoient une **liste** de lignes, sans leurs retours à la ligne :

- `premieres_lignes(chemin, n)` : les `n` premières lignes du fichier ;
- `dernieres_lignes(chemin, n)` : les `n` dernières lignes du fichier, dans l'ordre du fichier.

Si le fichier a moins de `n` lignes, on renvoie toutes ses lignes. Si `n` vaut `0` ou est négatif, on renvoie `[]`.

Avec un fichier qui contient :

```text
Bonjour
La prog, c'est sympa !
Mais alors là, vraiment sympa :)
```

```python
dernieres_lignes("journal.txt", 2)
# ["La prog, c'est sympa !", 'Mais alors là, vraiment sympa :)']
premieres_lignes("journal.txt", 1)
# ['Bonjour']
```

> [!warning] Pense aux gros fichiers
> Un journal de serveur peut faire plusieurs gigaoctets : on ne le charge pas en entier en mémoire avec `read()` ou `readlines()`. Parcours-le ligne par ligne.
