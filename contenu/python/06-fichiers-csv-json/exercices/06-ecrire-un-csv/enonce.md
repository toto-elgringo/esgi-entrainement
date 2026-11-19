On repart d'un fichier de notes au même format que dans l'exercice précédent (en-tête, `;`, décimales avec une virgule).

Écris `ecrire_bulletin(source, cible)`, qui lit les notes de `source` et écrit dans `cible` un nouveau CSV, séparé par des `;` :

- une première ligne d'en-tête : `nom;moyenne;resultat` ;
- puis une ligne par élève : son nom, sa moyenne écrite avec **une décimale** (`15.0`, `4.3`), et `admis` si sa moyenne est d'au moins 10, `ajourné` sinon ;
- les élèves sont rangés de la **meilleure** moyenne à la moins bonne (par ordre alphabétique en cas d'égalité).

La fonction renvoie le nombre d'élèves écrits. Avec la source :

```text
nom;maths;physique;histoire
Ben;10;15;20
"Martin; Jr";12;4,5;18
John;3;2;8
```

la cible contient :

```text
nom;moyenne;resultat
Ben;15.0;admis
"Martin; Jr";11.5;admis
John;4.3;ajourné
```

et la fonction renvoie `3`.

> [!warning] Les guillemets
> Le nom `Martin; Jr` contient le délimiteur : il doit être écrit **entre guillemets**, sinon le fichier aurait une colonne de trop. Le module `csv` s'en charge si tu écris avec `csv.writer`.
