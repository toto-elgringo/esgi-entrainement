Ce tri par tas s'appuie sur deux fonctions **justes**, qui reçoivent chacune une taille :

| Fonction | Avant l'appel | Après l'appel |
|---|---|---|
| `insererDernier(t, taille)` | les `taille - 1` premières cases sont un tas, la case `taille - 1` est la valeur à ajouter | les `taille` premières cases sont un tas |
| `retirerRacine(t, taille)` | les `taille` premières cases sont un tas | les `taille - 1` premières cases sont un tas, l'ancienne racine est dans la case `taille - 1` |

`triParTas` construit le tas par insertions, puis retire la racine jusqu'à ce que tout soit rangé. Mais les **bornes de ses deux boucles** sont fausses :

```text
triParTas sur  3 1 2
attendu : 1 2 3
obtenu  : 2 1 3
```

Corrige les deux boucles. Ne touche pas à `insererDernier` ni à `retirerRacine`.

> [!tip] Méthode
> Pour chaque boucle, écris la liste des valeurs que prend `taille` pour `n = 3`, puis demande-toi : quelle case est ajoutée au tas à chaque tour ? Quel est le plus petit tas dont il faut encore retirer la racine ?
