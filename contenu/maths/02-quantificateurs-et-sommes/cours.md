# Quantificateurs, prédicats et sommes

Ce chapitre donne deux outils très utilisés en informatique :

- les **quantificateurs** ($\forall$, $\exists$), pour écrire précisément des règles comme les contraintes d'une base de données ;
- les **sommes** ($\Sigma$) et les **produits** ($\Pi$), qui sont la version mathématique de `COUNT`, `SUM`, `AVG` et `GROUP BY`.

## 1. Les prédicats

Un **prédicat** est une phrase qui contient une variable. Elle n'est ni vraie ni fausse tant qu'on n'a pas choisi la valeur de la variable.

Exemple : $P(x) : x^2 \geq 4$.

- $P(3)$ est vrai, car $9 \geq 4$.
- $P(1)$ est faux, car $1 < 4$.

Un prédicat peut avoir plusieurs variables : $R(x, y)$ : « $x$ a acheté le produit $y$ ».

> [!info] Lien avec SQL
> Une clause `WHERE ville = 'Paris' AND age > 18` est un prédicat $P(\text{ville}, \text{age})$ : pour chaque ligne, il vaut vrai ou faux, et SQL ne garde que les lignes où il est vrai.

## 2. Les quantificateurs

| Symbole | Se lit | Sens |
|---|---|---|
| $\forall x,\ P(x)$ | « pour tout $x$ » | $P(x)$ est vrai pour **toutes** les valeurs de $x$ |
| $\exists x,\ P(x)$ | « il existe $x$ » | $P(x)$ est vrai pour **au moins une** valeur de $x$ |

On précise toujours l'ensemble dans lequel on prend la variable : $\forall p \in \text{Produits},\ \text{prix}(p) > 0$.

### L'ordre des quantificateurs compte

Avec $R(x, y)$ : « $y$ est le manager de $x$ » :

- $\forall x\ \exists y\ R(x, y)$ : **chaque** employé a un manager (qui peut être différent d'un employé à l'autre) ;
- $\exists y\ \forall x\ R(x, y)$ : **une seule** personne manage tout le monde.

Le second est beaucoup plus fort. Si le second est vrai, le premier l'est aussi, mais pas l'inverse.

> [!warning] Piège
> On ne peut pas échanger $\forall$ et $\exists$ sans changer le sens de la phrase.

### Nier une phrase « couche par couche »

Pour nier, on part de l'extérieur et on avance vers l'intérieur : chaque $\forall$ devient $\exists$, chaque $\exists$ devient $\forall$, puis on nie le prédicat à la fin.

$$\neg\big(\forall x\ \exists y\ R(x,y)\big) \iff \exists x\ \forall y\ \neg R(x,y)$$

Exemples :

- « Tout client a passé une commande » se nie en « **il existe** un client qui n'a passé **aucune** commande ».
- « Il existe un produit disponible dans tous les entrepôts » se nie en « **tout** produit est absent d'**au moins un** entrepôt ».

> [!tip] Méthode
> Nier « tous » donne « au moins un ne... pas ». Nier « il existe » donne « aucun » (ou « tous ne... pas »).

En SQL, nier « tout client a une commande » revient à chercher un client pour lequel il n'existe pas de commande : c'est le rôle de `NOT EXISTS`.

### Écrire les contraintes d'une base de données

- **Clé étrangère** (chaque commande référence un client qui existe) :
$$\forall c \in \text{Commandes},\ \exists u \in \text{Clients},\ c.\mathrm{id\_client} = u.\mathrm{id\_client}$$
- **Unicité** (deux clients différents n'ont jamais le même email) :
$$\forall u_1, u_2 \in \text{Clients},\ u_1 \neq u_2 \Rightarrow u_1.\mathrm{email} \neq u_2.\mathrm{email}$$

> [!warning] Piège de l'unicité
> Écrire seulement $\forall u_1, u_2,\ u_1.\mathrm{email} \neq u_2.\mathrm{email}$ est faux : avec $u_1 = u_2$, un client aurait un email différent de lui-même. Il faut la condition $u_1 \neq u_2$.

## 3. Les sommes

### La notation $\Sigma$

$$\sum_{k=1}^{n} a_k = a_1 + a_2 + \dots + a_n$$

- $k$ est l'**indice**. C'est une variable **muette** : on peut l'appeler $i$, $j$ ou $k$, le résultat ne change pas.
- $1$ et $n$ sont les **bornes** : on prend toutes les valeurs entières de $k$ entre les deux.
- Le nombre de termes est $n - 1 + 1 = n$. De façon générale, de $k = p$ à $k = q$ il y a $q - p + 1$ termes.

Exemple : $\displaystyle\sum_{k=1}^{4} k^2 = 1 + 4 + 9 + 16 = 30$.

### Les règles de calcul

$$\sum_{k=1}^{n} (a_k + b_k) = \sum_{k=1}^{n} a_k + \sum_{k=1}^{n} b_k \qquad \sum_{k=1}^{n} c\, a_k = c \sum_{k=1}^{n} a_k \qquad \sum_{k=1}^{n} c = n\,c$$

On dit que la somme est **linéaire** : on peut la couper en morceaux et sortir les constantes.

> [!warning] Piège
> $\displaystyle\sum a_k b_k \neq \Big(\sum a_k\Big)\Big(\sum b_k\Big)$ en général. Exemple : $1 \times 1 + 2 \times 2 = 5$ alors que $(1 + 2)(1 + 2) = 9$.

### Les formules à connaître

$$\sum_{k=1}^{n} k = \frac{n(n+1)}{2} \qquad\qquad \sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$$

Exemple avec la linéarité :
$$\sum_{k=1}^{n} (2k + 3) = 2 \sum_{k=1}^{n} k + \sum_{k=1}^{n} 3 = n(n+1) + 3n = n^2 + 4n$$

> [!info] Coût d'une double boucle
> Comparer chaque ligne d'une table avec toutes les suivantes demande $1 + 2 + \dots + (n-1) = \frac{(n-1)n}{2}$ comparaisons, soit environ $\frac{n^2}{2}$. C'est pour cela qu'une double boucle devient lente sur une grosse table.

### Le changement d'indice

On remplace $k$ par une nouvelle variable, par exemple $j = k - 2$. Les **bornes se décalent**, la valeur de la somme ne change pas.

$$S = \sum_{k=3}^{n+2} (k - 2)$$

Avec $j = k - 2$ : quand $k = 3$, $j = 1$ ; quand $k = n + 2$, $j = n$. Donc
$$S = \sum_{j=1}^{n} j = \frac{n(n+1)}{2}$$

> [!tip] Méthode
> Calcule la nouvelle variable pour la borne du bas **et** pour la borne du haut, puis réécris le terme général avec la nouvelle variable.

### Les sommes doubles

$$\sum_{i=1}^{m} \sum_{j=1}^{n} a_{i,j}$$

On fixe $i$, on additionne sur $j$, puis on additionne les résultats sur $i$. C'est comme parcourir un tableau ligne par ligne.

Si les bornes de l'une ne dépendent pas de l'autre, on peut **inverser l'ordre** des deux sommes : le total ne change pas (comme additionner un tableau par lignes ou par colonnes).

Exemple : $v_{i,j}$ = ventes du magasin $i$ la semaine $j$. Le chiffre d'affaires total est $\sum_i \sum_j v_{i,j}$, celui du magasin 2 est $\sum_j v_{2,j}$.

### Les sommes télescopiques

Quand chaque terme est une **différence** de deux termes qui se suivent, presque tout s'annule :

$$\sum_{k=1}^{n} (u_{k+1} - u_k) = (u_2 - u_1) + (u_3 - u_2) + \dots + (u_{n+1} - u_n) = u_{n+1} - u_1$$

Exemple : $\dfrac{1}{k(k+1)} = \dfrac{1}{k} - \dfrac{1}{k+1}$, donc
$$\sum_{k=1}^{n} \frac{1}{k(k+1)} = 1 - \frac{1}{n+1} = \frac{n}{n+1}$$

> [!tip] Retrouver la somme des carrés (méthode d'examen)
> On part de $(k+1)^3 - k^3 = 3k^2 + 3k + 1$ et on additionne pour $k$ de 1 à $n$.
> - À gauche, tout se télescope : $(n+1)^3 - 1$.
> - À droite : $3 \sum k^2 + 3 \frac{n(n+1)}{2} + n$.
>
> En isolant $\sum k^2$, on trouve $\dfrac{n(n+1)(2n+1)}{6}$.

### Les produits

$$\prod_{k=1}^{n} a_k = a_1 \times a_2 \times \dots \times a_n \qquad \prod_{k=1}^{n} k = n! \qquad \prod_{k=1}^{n} c = c^n$$

$n!$ se lit « factorielle $n$ » : $5! = 1 \times 2 \times 3 \times 4 \times 5 = 120$.

Les produits peuvent aussi se simplifier « en cascade » :
$$\prod_{k=2}^{n} \frac{k}{k-1} = \frac{2}{1} \times \frac{3}{2} \times \dots \times \frac{n}{n-1} = n$$

### Les sommes infinies (aperçu)

$\sum_{k=1}^{+\infty} a_k$ n'a de sens que si les termes deviennent assez vite négligeables. C'est le sujet des **séries**, vues plus tard.

## 4. Le pont vers SQL

| Maths | SQL |
|---|---|
| $\sum 1$ | `COUNT(*)` |
| $\sum a_k$ | `SUM(col)` |
| $\frac{1}{n} \sum a_k$ | `AVG(col)` |
| somme double (somme externe = un groupe) | `GROUP BY` |
| prédicat ligne par ligne, **avant** la somme | `WHERE` |
| prédicat sur le **résultat** d'une somme | `HAVING` |

```sql
SELECT magasin, SUM(montant) AS ca
FROM Ventes
WHERE statut = 'validee'
GROUP BY magasin
HAVING SUM(montant) > 5000;
```

`WHERE` enlève les ventes non validées **avant** de faire les sommes ; `HAVING` garde ensuite seulement les magasins dont la somme dépasse 5000.

> [!warning] Piège
> On ne peut pas écrire `WHERE SUM(montant) > 5000` : au moment où `WHERE` s'applique, la somme n'est pas encore calculée.

## À retenir

- Un prédicat devient vrai ou faux quand on fixe ses variables.
- L'ordre de $\forall$ et $\exists$ change le sens.
- Négation : de l'extérieur vers l'intérieur, $\forall \leftrightarrow \exists$, puis on nie le prédicat.
- $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$ et $\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$.
- Linéarité : on coupe les sommes et on sort les constantes, mais $\sum a_k b_k \neq \sum a_k \sum b_k$.
- Changement d'indice : les bornes bougent.
- Télescopage : $\sum (u_{k+1} - u_k) = u_{n+1} - u_1$.
- `WHERE` filtre avant la somme, `HAVING` après. `GROUP BY` = somme double.
