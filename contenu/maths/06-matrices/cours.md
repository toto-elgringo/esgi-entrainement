# Matrices et produit matriciel

> [!info] Pourquoi ce chapitre ?
> Un jeu de données, une couche de réseau de neurones, un graphe, une matrice de confusion : tout ça se range dans des **tableaux de nombres**. La matrice est l'outil central du module : les déterminants, les valeurs propres et la PCA reposent dessus.

## 1. Qu'est-ce qu'une matrice ?

Une **matrice** de taille $m \times n$ est un tableau de nombres à $m$ **lignes** et $n$ **colonnes** :

$$A = \begin{pmatrix} a_{11} & a_{12} & \dots & a_{1n} \\ \vdots & & & \vdots \\ a_{m1} & a_{m2} & \dots & a_{mn} \end{pmatrix}$$

Le coefficient $a_{ij}$ est à la **ligne $i$**, **colonne $j$** (toujours la ligne d'abord).

- Une **ligne** est une rangée **horizontale** (on la lit de gauche à droite).
- Une **colonne** est une rangée **verticale** (on la lit de haut en bas).
- La **taille** s'écrit toujours « nombre de lignes $\times$ nombre de colonnes ». Une matrice $2 \times 3$ a 2 lignes et 3 colonnes, donc $2 \times 3 = 6$ coefficients.

Exemple : $M = \begin{pmatrix} 4 & -2 & 7 \\ 0 & 1 & 3 \end{pmatrix}$ est une matrice $2 \times 3$, avec $a_{13} = 7$ et $a_{21} = 0$.

**Exemple résolu :** soit $P = \begin{pmatrix} 6 & -1 \\ 0 & 8 \\ 2 & 5 \end{pmatrix}$. Quelle est sa taille ? Que valent $p_{12}$ et $p_{31}$ ?

1. On compte les rangées horizontales : $(6, -1)$, $(0, 8)$, $(2, 5)$, soit **3 lignes**.
2. On compte les nombres dans une ligne : 2, donc **2 colonnes**. La taille est $3 \times 2$ (et pas $2 \times 3$).
3. $p_{12}$ : ligne 1, colonne 2. On descend à la 1re ligne $(6, -1)$ et on prend le 2e nombre : $p_{12} = -1$ (avec son signe).
4. $p_{31}$ : ligne 3, colonne 1. On descend à la 3e ligne $(2, 5)$ et on prend le 1er nombre : $p_{31} = 2$.

| Coefficient | Ligne | Colonne | Valeur |
|---|---|---|---|
| $p_{12}$ | 1 | 2 | $-1$ |
| $p_{31}$ | 3 | 1 | $2$ |
| $p_{21}$ | 2 | 1 | $0$ |

**À retenir :** taille = lignes puis colonnes ; pour $a_{ij}$, choisis d'abord la ligne $i$, puis avance jusqu'à la colonne $j$.

Cas particuliers :

- une matrice $n \times 1$ (une seule colonne) est un **vecteur colonne** ;
- une matrice $1 \times n$ (une seule ligne) est un **vecteur ligne** ;
- une matrice $n \times n$ est dite **carrée** ;
- la **diagonale** d'une matrice carrée est formée des cases $a_{11}, a_{22}, a_{33}, \dots$ (même numéro de ligne et de colonne), du coin en haut à gauche au coin en bas à droite.

> [!tip] Lien avec la data
> Un tableau de $m$ observations (lignes) décrites par $n$ variables (colonnes) est une matrice $m \times n$. Une image en niveaux de gris est une matrice de pixels.

> [!info] Sur ce site
> Quand on te demande une matrice, écris ses coefficients **ligne par ligne** dans une liste : $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ s'écrit `(a, b, c, d)`.

Par exemple, $\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$ s'écrit `(1, 2, 3, 4)` : d'abord toute la 1re ligne (1 puis 2), ensuite toute la 2e (3 puis 4). Écrire `(1, 3, 2, 4)` serait lire **colonne par colonne** : c'est faux. Pour une $3 \times 2$, on écrit les 3 lignes à la suite, soit 6 nombres.

## 2. Addition et multiplication par un nombre

- **Addition** : terme à terme, et seulement entre deux matrices de **même taille**.
- **Soustraction** : pareil, case par case : $(A - B)_{ij} = a_{ij} - b_{ij}$.
- **Multiplication par un scalaire** $\lambda$ (un nombre) : on multiplie **chaque** coefficient par $\lambda$.

$$\begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} + \begin{pmatrix} 4 & -1 \\ 0 & 2 \end{pmatrix} = \begin{pmatrix} 5 & -1 \\ 2 & 5 \end{pmatrix} \qquad 3\begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} = \begin{pmatrix} 3 & 0 \\ 6 & 9 \end{pmatrix}$$

**Exemple résolu :** avec $A = \begin{pmatrix} 2 & -3 \\ 1 & 4 \end{pmatrix}$ et $B = \begin{pmatrix} -1 & 0 \\ 5 & 2 \end{pmatrix}$, calculons $3A - B$.

1. D'abord $3A$ : chaque case est multipliée par 3, $3A = \begin{pmatrix} 6 & -9 \\ 3 & 12 \end{pmatrix}$.
2. Puis on retire $B$ case par case, en faisant attention aux signes :

| Case | $3A$ | $B$ | $3A - B$ |
|---|---|---|---|
| (1, 1) | $6$ | $-1$ | $6 - (-1) = 7$ |
| (1, 2) | $-9$ | $0$ | $-9 - 0 = -9$ |
| (2, 1) | $3$ | $5$ | $3 - 5 = -2$ |
| (2, 2) | $12$ | $2$ | $12 - 2 = 10$ |

Donc $3A - B = \begin{pmatrix} 7 & -9 \\ -2 & 10 \end{pmatrix}$, soit `(7, -9, -2, 10)` ligne par ligne.

**À retenir :** addition, soustraction et multiplication par un nombre se font **case par case** ; retirer un nombre négatif revient à ajouter : $6 - (-1) = 7$.

## 3. Le produit matriciel

### Quand peut-on multiplier ?

Le produit $AB$ existe seulement si le **nombre de colonnes de $A$** est égal au **nombre de lignes de $B$** :

$$\underbrace{A}_{m \times n} \times \underbrace{B}_{n \times p} = \underbrace{AB}_{m \times p}$$

Les deux tailles « du milieu » doivent être égales ; celles « du bord » donnent la taille du résultat.

**Exemple résolu :** $P$ est $2 \times 5$, $Q$ est $5 \times 3$ et $R$ est $3 \times 2$. Quels produits existent ?

| Produit | Tailles écrites côte à côte | Milieu égal ? | Taille du résultat |
|---|---|---|---|
| $PQ$ | $(2 \times 5)(5 \times 3)$ | $5 = 5$, oui | $2 \times 3$ |
| $QP$ | $(5 \times 3)(2 \times 5)$ | $3 \neq 2$, non | n'existe pas |
| $QR$ | $(5 \times 3)(3 \times 2)$ | $3 = 3$, oui | $5 \times 2$ |
| $RP$ | $(3 \times 2)(2 \times 5)$ | $2 = 2$, oui | $3 \times 5$ |

Pour un produit de trois matrices $PQR$, on avance deux par deux : $PQ$ est $2 \times 3$, puis $(2 \times 3)(3 \times 2)$ a un milieu égal, donc $PQR$ existe et fait $2 \times 2$.

**À retenir :** écris les deux tailles côte à côte ; les deux nombres du milieu doivent être égaux, et on garde ceux du bord.

### La règle ligne × colonne

Le coefficient $(AB)_{ij}$ se calcule avec la **ligne $i$ de $A$** et la **colonne $j$ de $B$** : on multiplie terme à terme, puis on additionne.

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}\, b_{kj} = a_{i1} b_{1j} + a_{i2} b_{2j} + \dots + a_{in} b_{nj}$$

Exemple avec $A = \begin{pmatrix} 1 & 3 \\ 2 & -1 \end{pmatrix}$ et $B = \begin{pmatrix} 2 & 0 \\ 1 & 4 \end{pmatrix}$ :

$$AB = \begin{pmatrix} 1 \times 2 + 3 \times 1 & 1 \times 0 + 3 \times 4 \\ 2 \times 2 + (-1) \times 1 & 2 \times 0 + (-1) \times 4 \end{pmatrix} = \begin{pmatrix} 5 & 12 \\ 3 & -4 \end{pmatrix}$$

**Le même calcul, case par case :**

| Case de $AB$ | Ligne de $A$ | Colonne de $B$ | Calcul | Résultat |
|---|---|---|---|---|
| (1, 1) | $(1, 3)$ | $(2, 1)$ | $1 \times 2 + 3 \times 1$ | $5$ |
| (1, 2) | $(1, 3)$ | $(0, 4)$ | $1 \times 0 + 3 \times 4$ | $12$ |
| (2, 1) | $(2, -1)$ | $(2, 1)$ | $2 \times 2 + (-1) \times 1$ | $3$ |
| (2, 2) | $(2, -1)$ | $(0, 4)$ | $2 \times 0 + (-1) \times 4$ | $-4$ |

La colonne $j$ de $B$ se lit **de haut en bas** : la colonne 1 de $B$ est $(2, 1)$, pas $(2, 0)$.

> [!warning] Ce n'est pas case par case
> On ne multiplie **pas** $a_{11}$ par $b_{11}$, $a_{12}$ par $b_{12}$, etc. Ici, cela donnerait $\begin{pmatrix} 2 & 0 \\ 2 & -4 \end{pmatrix}$, qui est faux. Chaque case du produit est une **somme** de produits.

**Exemple résolu avec des matrices rectangulaires :** $C = \begin{pmatrix} 2 & 0 & 1 \\ 1 & -1 & 3 \end{pmatrix}$ ($2 \times 3$) et $D = \begin{pmatrix} 1 & 2 \\ 0 & 1 \\ -2 & 4 \end{pmatrix}$ ($3 \times 2$).

1. Tailles : $(2 \times 3)(3 \times 2)$, le milieu vaut 3 des deux côtés, donc $CD$ existe et fait $2 \times 2$.
2. Chaque ligne de $C$ a **3** nombres et chaque colonne de $D$ aussi : chaque case est une somme de **trois** produits.
3. Case (1, 1) : ligne 1 de $C$ $(2, 0, 1)$ et colonne 1 de $D$ $(1, 0, -2)$ : $2 \times 1 + 0 \times 0 + 1 \times (-2) = 0$.
4. Case (1, 2) : $(2, 0, 1)$ et $(2, 1, 4)$ : $4 + 0 + 4 = 8$.
5. Case (2, 1) : $(1, -1, 3)$ et $(1, 0, -2)$ : $1 + 0 - 6 = -5$.
6. Case (2, 2) : $(1, -1, 3)$ et $(2, 1, 4)$ : $2 - 1 + 12 = 13$.

Donc $CD = \begin{pmatrix} 0 & 8 \\ -5 & 13 \end{pmatrix}$. Dans l'autre sens, $DC$ est $(3 \times 2)(2 \times 3) = 3 \times 3$ : elle n'a même pas la même taille. On peut calculer une seule case sans tout faire : $(DC)_{31}$ = ligne 3 de $D$ $(-2, 4)$ et colonne 1 de $C$ $(2, 1)$, soit $-4 + 4 = 0$.

**À retenir :** case $(i, j)$ = ligne $i$ de la 1re matrice « fois » colonne $j$ de la 2e : on multiplie les nombres deux à deux, puis on additionne tout.

### Le produit n'est pas commutatif

Dans l'autre sens, avec les mêmes matrices $A$ et $B$ :

$$BA = \begin{pmatrix} 2 & 6 \\ 9 & -1 \end{pmatrix} \neq AB$$

Pas à pas : case (1, 1) de $BA$ = ligne 1 de $B$ $(2, 0)$ et colonne 1 de $A$ $(1, 2)$, soit $2 + 0 = 2$ ; case (1, 2) : $(2, 0)$ et $(3, -1)$, soit $6$ ; case (2, 1) : $(1, 4)$ et $(1, 2)$, soit $1 + 8 = 9$ ; case (2, 2) : $(1, 4)$ et $(3, -1)$, soit $3 - 4 = -1$. On compare avec $AB = \begin{pmatrix} 5 & 12 \\ 3 & -4 \end{pmatrix}$ : ce n'est pas la même matrice.

> [!warning] $AB \neq BA$ en général
> L'ordre compte. Parfois, un seul des deux produits existe : avec $A$ de taille $2 \times 3$ et $B$ de taille $3 \times 4$, $AB$ existe ($2 \times 4$) mais pas $BA$ ($4 \neq 2$).

**À retenir :** un seul exemple où $AB \neq BA$ suffit pour dire que le produit n'est **pas commutatif** ; pour calculer $BA$, on recommence tout avec les lignes de $B$.

> [!tip] Lien avec la data
> Dans un réseau de neurones, les couches s'enchaînent dans un ordre précis : chaque couche transforme la sortie de la précédente. On ne peut pas échanger l'ordre des produits.

## 4. Identité et transposée

La **matrice identité** $I_n$ est la matrice carrée $n \times n$ avec des $1$ sur la diagonale et des $0$ partout ailleurs :

$$I_2 = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \qquad I_3 = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

Elle joue le rôle du nombre $1$ : $A I_n = I_n A = A$ (quand les tailles le permettent).

**Exemple résolu :** $\begin{pmatrix} 3 & 5 \\ -2 & 7 \end{pmatrix} I_2$. Case (1, 1) : $(3, 5)$ et $(1, 0)$ donnent $3 + 0 = 3$. Case (1, 2) : $(3, 5)$ et $(0, 1)$ donnent $0 + 5 = 5$. Case (2, 1) : $(-2, 7)$ et $(1, 0)$ donnent $-2$. Case (2, 2) : $(-2, 7)$ et $(0, 1)$ donnent $7$. On retrouve exactement la matrice de départ.

**À retenir :** multiplier par $I_n$ ne change rien, comme multiplier un nombre par 1.

Quand deux matrices carrées vérifient $AB = BA = I_n$, on dit que $B$ est l'**inverse** de $A$ (on l'écrit $A^{-1}$, voir le chapitre suivant). Pour savoir si $B$ est l'inverse de $A$, on calcule $AB$ : si on ne trouve pas $I_n$, ce n'est pas l'inverse.

La **transposée** $A^T$ s'obtient en **échangeant lignes et colonnes** : $(A^T)_{ij} = a_{ji}$. Une matrice $m \times n$ devient $n \times m$.

$$\begin{pmatrix} 1 & 0 & 5 \\ 2 & -3 & 4 \end{pmatrix}^T = \begin{pmatrix} 1 & 2 \\ 0 & -3 \\ 5 & 4 \end{pmatrix}$$

La 1re ligne devient la 1re colonne, la 2e ligne devient la 2e colonne.

**Exemple résolu :** transposer $N = \begin{pmatrix} 4 & 0 & -1 \\ 2 & 6 & 3 \end{pmatrix}$ ($2 \times 3$).

1. La 1re ligne $(4, 0, -1)$ s'écrit **debout** : c'est la 1re colonne de $N^T$.
2. La 2e ligne $(2, 6, 3)$ devient la 2e colonne.
3. Résultat : $N^T = \begin{pmatrix} 4 & 2 \\ 0 & 6 \\ -1 & 3 \end{pmatrix}$, de taille $3 \times 2$. Ligne par ligne sur ce site : `(4, 2, 0, 6, -1, 3)`.

Vérification sur une case : $(N^T)_{31}$ doit valoir $n_{13} = -1$. C'est bien le cas.

**À retenir :** les lignes deviennent les colonnes ; la taille $m \times n$ devient $n \times m$.

### Le produit d'une matrice par sa transposée

$A^T A$ et $A A^T$ existent **toujours**, mais n'ont pas la même taille. Avec $A$ de taille $2 \times 3$ :

| Produit | Tailles | Résultat |
|---|---|---|
| $A A^T$ | $(2 \times 3)(3 \times 2)$ | $2 \times 2$ |
| $A^T A$ | $(3 \times 2)(2 \times 3)$ | $3 \times 3$ |

Une matrice carrée est **symétrique** si elle est égale à sa transposée : la case $(i, j)$ vaut la case $(j, i)$ (elle est « en miroir » par rapport à la diagonale).

**Exemple résolu :** $N N^T$ avec le $N$ ci-dessus. La colonne $j$ de $N^T$ est la ligne $j$ de $N$. Donc la case $(i, j)$ de $NN^T$ multiplie la **ligne $i$** de $N$ par la **ligne $j$** de $N$.

- Case (1, 1) : $(4, 0, -1)$ avec elle-même : $16 + 0 + 1 = 17$.
- Case (1, 2) : $(4, 0, -1)$ avec $(2, 6, 3)$ : $8 + 0 - 3 = 5$.
- Case (2, 1) : $(2, 6, 3)$ avec $(4, 0, -1)$ : le même calcul dans l'autre ordre, $5$.
- Case (2, 2) : $(2, 6, 3)$ avec elle-même : $4 + 36 + 9 = 49$.

$NN^T = \begin{pmatrix} 17 & 5 \\ 5 & 49 \end{pmatrix}$ : elle est bien symétrique (les deux 5 se font face).

> [!tip] Astuce
> $A^T A$ est toujours carrée et **symétrique** (elle est égale à sa transposée) : son coefficient $(i, j)$ est la somme des produits de la colonne $i$ et de la colonne $j$ de $A$.

**À retenir :** $AA^T$ croise les **lignes** de $A$ entre elles, $A^TA$ croise les **colonnes** ; les deux sont symétriques.

## 5. Matrices et applications linéaires

### Application linéaire

Une application $f : \mathbb{R}^n \to \mathbb{R}^m$ est **linéaire** si elle respecte les combinaisons linéaires : pour tous vecteurs $\vec u$, $\vec v$ et tout réel $\lambda$,

$$f(\vec u + \vec v) = f(\vec u) + f(\vec v) \qquad \text{et} \qquad f(\lambda \vec u) = \lambda f(\vec u)$$

Conséquence immédiate : $f(\vec 0) = \vec 0$. C'est un test rapide pour repérer une application **non** linéaire.

| Application | Linéaire ? |
|---|---|
| $f(x, y) = (x + 2y,\ 3x - y)$ | oui |
| rotations, projections, homothéties | oui |
| $g(x) = x + 1$ | non : $g(0) = 1 \neq 0$ |
| $h(x) = x^2$ | non : $h(2x) = 4x^2 \neq 2h(x)$ |

En pratique, pour une formule en $x$ et $y$, on regarde **chaque coordonnée** du résultat :

| Ce qu'on voit dans une coordonnée | Exemple | Linéaire ? |
|---|---|---|
| seulement des « nombre × variable » | $4x - y$, $3y$, $-x$ | oui |
| une constante ajoutée | $x + 5$, ou une coordonnée égale à $7$ | non : $(0, 0)$ n'est pas envoyé sur $(0, 0)$ |
| un produit de variables | $xy$ | non |
| un carré, une racine, un sinus… | $x^2$, $\sqrt{y}$ | non |

> [!warning] $f(\vec 0) = \vec 0$ ne suffit pas
> Le test du vecteur nul sert seulement à **éliminer**. $p(x, y) = (x^2,\ y)$ envoie bien $(0, 0)$ sur $(0, 0)$, et pourtant elle n'est pas linéaire : en doublant le vecteur, $p(2x, 2y) = (4x^2, 2y)$, alors que $2\,p(x, y) = (2x^2, 2y)$. La 1re coordonnée est multipliée par 4 au lieu de 2.

**Exemple résolu :** $q(x, y) = (5x,\ x - 1)$ est-elle linéaire ?

1. Test du vecteur nul : $q(0, 0) = (0,\ 0 - 1) = (0, -1)$.
2. On devrait trouver $(0, 0)$ : ce n'est pas le cas, donc $q$ n'est **pas linéaire**. La faute vient de la constante $-1$.

**Exemple résolu :** $r(x, y) = (2x + y,\ -3y)$ est-elle linéaire ?

1. 1re coordonnée $2x + y$ : deux termes « nombre × variable » ($2 \times x$ et $1 \times y$).
2. 2e coordonnée $-3y$ : un terme « nombre × variable ».
3. Ni constante, ni produit, ni carré : $r$ est **linéaire**.

**À retenir :** constante, produit de variables ou carré = pas linéaire ; seulement des « nombre × variable » = linéaire.

### La matrice d'une application linéaire

Une application linéaire est entièrement connue par les **images des vecteurs de base**. Sa matrice (dans la base canonique) a pour **colonnes** ces images.

Exemple : $f(x, y) = (x + 2y,\ 3x - y)$, avec $e_1 = (1, 0)$ et $e_2 = (0, 1)$.

- $f(e_1) = (1, 3)$ : c'est la 1re colonne ;
- $f(e_2) = (2, -1)$ : c'est la 2e colonne.

$$A = \begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix}$$

Vérification : $A \begin{pmatrix} 2 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 + 2 \\ 6 - 1 \end{pmatrix} = \begin{pmatrix} 4 \\ 5 \end{pmatrix}$, et on a bien $f(2, 1) = (2 + 2,\ 6 - 1) = (4, 5)$.

**Exemple résolu, en détail :** $s(x, y) = (2x - 4y,\ x + 3y)$.

1. $s(e_1)$ : on remplace $x$ par 1 et $y$ par 0 : $(2 \times 1 - 4 \times 0,\ 1 + 3 \times 0) = (2, 1)$.
2. $s(e_2)$ : on remplace $x$ par 0 et $y$ par 1 : $(2 \times 0 - 4 \times 1,\ 0 + 3 \times 1) = (-4, 3)$. Le signe moins de $-4y$ reste.
3. On range ces images **debout**, en colonnes : $S = \begin{pmatrix} 2 & -4 \\ 1 & 3 \end{pmatrix}$, soit `(2, -4, 1, 3)` ligne par ligne.
4. Raccourci : la 1re **ligne** de $S$ contient les coefficients de la 1re coordonnée $2x - 4y$, la 2e ligne ceux de $x + 3y$.
5. Vérification avec un vecteur : $s(1, 2) = (2 - 8,\ 1 + 6) = (-6, 7)$, et $S\begin{pmatrix} 1 \\ 2 \end{pmatrix} = \begin{pmatrix} 2 - 8 \\ 1 + 6 \end{pmatrix}$ donne la même chose.

Erreur fréquente : ranger $s(e_1)$ et $s(e_2)$ en **lignes**, ce qui donne $\begin{pmatrix} 2 & 1 \\ -4 & 3 \end{pmatrix}$ : c'est la transposée, pas la bonne matrice.

**À retenir :** calcule $f(e_1)$, $f(e_2)$, puis écris-les en **colonnes** ; vérifie sur un vecteur.

### Le produit matrice × vecteur

$A\vec x$ est une **combinaison linéaire des colonnes** de $A$, avec les coordonnées de $\vec x$ comme coefficients :

$$\begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix}\begin{pmatrix} 2 \\ 1 \end{pmatrix} = 2\begin{pmatrix} 1 \\ 3 \end{pmatrix} + 1\begin{pmatrix} 2 \\ -1 \end{pmatrix} = \begin{pmatrix} 4 \\ 5 \end{pmatrix}$$

On peut aussi faire « ligne × vecteur » : 1re coordonnée = ligne 1 $(1, 2)$ avec $(2, 1)$, soit $2 + 2 = 4$ ; 2e coordonnée = ligne 2 $(3, -1)$ avec $(2, 1)$, soit $6 - 1 = 5$. Les deux façons donnent le même résultat.

```anim
vecteurs
titre: Une matrice transforme un vecteur
consigne: u et v sont les deux colonnes de A. Les curseurs a et b jouent le rôle des coordonnées de x : le point jaune est le résultat de A·x, c'est-à-dire a·u + b·v.
ux: 1
uy: 3
vx: 2
vy: -1
a: 2
b: 1
```

**À retenir :** $A\vec x$ a une coordonnée par **ligne** de $A$, et $\vec x$ doit avoir une coordonnée par **colonne** de $A$.

### Même application, autre base, autre matrice

La matrice **dépend de la base choisie**. Dans une autre base, la même application a une autre matrice. Une matrice n'est donc pas l'application elle-même, c'est sa **représentation** dans une base. Bien choisir la base pour obtenir une matrice très simple (diagonale) : c'est toute l'idée de la **diagonalisation** (chapitre suivant de big data).

### Produit = composition

Si $f$ a pour matrice $A$ et $g$ a pour matrice $B$, alors « faire $f$ **puis** $g$ » ($g \circ f$) a pour matrice $BA$ : la première appliquée est **à droite**.

Pourquoi ? $g \circ f$ se lit « $g$ rond $f$ » et veut dire $g(f(\vec x))$ : on calcule d'abord $f(\vec x) = A\vec x$, puis on applique $g$ au résultat : $B(A\vec x) = (BA)\vec x$. La matrice $A$ est collée au vecteur, donc à droite.

C'est la vraie raison de la règle ligne × colonne. Et c'est aussi pour ça que $AB \neq BA$ : faire $f$ puis $g$ n'est en général pas la même chose que faire $g$ puis $f$.

**Exemple résolu :** $f$ double la 1re coordonnée, matrice $A = \begin{pmatrix} 2 & 0 \\ 0 & 1 \end{pmatrix}$ ; $g$ échange les deux coordonnées, matrice $B = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$.

1. « $f$ puis $g$ » ($g \circ f$) : matrice $BA$. Case (1, 1) : $(0, 1)$ et $(2, 0)$ donnent $0$ ; case (1, 2) : $(0, 1)$ et $(0, 1)$ donnent $1$ ; case (2, 1) : $(1, 0)$ et $(2, 0)$ donnent $2$ ; case (2, 2) : $(1, 0)$ et $(0, 1)$ donnent $0$. Donc $BA = \begin{pmatrix} 0 & 1 \\ 2 & 0 \end{pmatrix}$.
2. Vérification sur $(3, 5)$, étape par étape : $f(3, 5) = (6, 5)$, puis $g(6, 5) = (5, 6)$. Avec la matrice : $BA\begin{pmatrix} 3 \\ 5 \end{pmatrix} = \begin{pmatrix} 0 + 5 \\ 6 + 0 \end{pmatrix} = \begin{pmatrix} 5 \\ 6 \end{pmatrix}$. Même résultat.
3. « $g$ puis $f$ » ($f \circ g$) : matrice $AB = \begin{pmatrix} 0 & 2 \\ 1 & 0 \end{pmatrix}$. Sur $(3, 5)$ : $g(3, 5) = (5, 3)$ puis $f(5, 3) = (10, 3)$. Ce n'est pas $(5, 6)$ : l'ordre change le résultat.

**À retenir :** « $f$ puis $g$ » = $g \circ f$ = $BA$ : la matrice de la **première** étape s'écrit **à droite**.

## 6. Les matrices en IABD

- **Couche dense d'un réseau de neurones** : $\vec y = W\vec x + \vec b$. Le produit $W\vec x$ est une transformation linéaire, $\vec b$ un décalage (le **biais**). Si $W$ est de taille $3 \times 2$, la couche prend $2$ valeurs en entrée et en sort $3$.
- **Matrice d'adjacence** d'un graphe : $A_{ij} = 1$ si les sommets $i$ et $j$ sont reliés, $0$ sinon. Le coefficient $(A^2)_{ij}$ compte les **chemins de longueur 2** entre $i$ et $j$.
- **Matrice de confusion** : ligne = classe réelle, colonne = classe prédite. La **diagonale** compte les exemples bien classés.
- **Matrice de corrélation** : chaque case mesure le lien entre deux colonnes d'un jeu de données.

Dans tous les cas, on utilise les mêmes règles (somme, produit, transposée).

### Une couche de neurones, pas à pas

**Exemple résolu :** $W = \begin{pmatrix} 2 & 0 & -1 \\ 1 & 1 & 1 \end{pmatrix}$ ($2 \times 3$), $\vec x = \begin{pmatrix} 1 \\ 4 \\ 2 \end{pmatrix}$ et $\vec b = \begin{pmatrix} -3 \\ 0 \end{pmatrix}$.

1. Tailles : $W$ a **3 colonnes**, donc l'entrée $\vec x$ a 3 valeurs ; $W$ a **2 lignes**, donc la sortie a 2 valeurs.
2. $W\vec x$ : ligne 1 $(2, 0, -1)$ avec $(1, 4, 2)$ donne $2 + 0 - 2 = 0$ ; ligne 2 $(1, 1, 1)$ avec $(1, 4, 2)$ donne $1 + 4 + 2 = 7$. Donc $W\vec x = (0, 7)$.
3. On ajoute le biais coordonnée par coordonnée : $\vec y = (0 + (-3),\ 7 + 0) = (-3, 7)$.

**À retenir :** colonnes de $W$ = nombre d'entrées, lignes de $W$ = nombre de sorties ; n'oublie pas d'ajouter $\vec b$ à la fin.

### Compter des chemins avec la matrice d'adjacence

Dans un graphe **non orienté** (les liens marchent dans les deux sens), si $i$ est relié à $j$, alors $j$ est relié à $i$ : on met un 1 en $(i, j)$ **et** en $(j, i)$. La matrice est symétrique. Sans boucle (un sommet relié à lui-même), la diagonale est nulle.

Pourquoi $(A^2)_{ij}$ compte les chemins en deux pas ? $(A^2)_{ij} = A_{i1}A_{1j} + A_{i2}A_{2j} + \dots$ Chaque terme $A_{ik}A_{kj}$ vaut 1 seulement si $i$ est relié à $k$ **et** $k$ relié à $j$, c'est-à-dire si $i \to k \to j$ est un chemin. La somme compte donc tous les sommets $k$ par lesquels on peut passer.

**Exemple résolu :** 3 sommets, avec les liens 1–2 et 1–3 (2 et 3 ne sont pas reliés).

1. Matrice : $A = \begin{pmatrix} 0 & 1 & 1 \\ 1 & 0 & 0 \\ 1 & 0 & 0 \end{pmatrix}$ (1 en (1, 2), (2, 1), (1, 3), (3, 1)).
2. $(A^2)_{23}$ : ligne 2 $(1, 0, 0)$ avec colonne 3 $(1, 0, 0)$ : $1 + 0 + 0 = 1$. Un seul chemin : $2 \to 1 \to 3$.
3. $(A^2)_{11}$ : ligne 1 $(0, 1, 1)$ avec colonne 1 $(0, 1, 1)$ : $0 + 1 + 1 = 2$. Deux allers-retours : $1 \to 2 \to 1$ et $1 \to 3 \to 1$.
4. $(A^2)_{12}$ : ligne 1 $(0, 1, 1)$ avec colonne 2 $(1, 0, 0)$ : $0$. Depuis 1, on va en 2 ou 3, puis on revient forcément en 1 : impossible de finir en 2 en exactement deux pas, même si 1 et 2 sont reliés directement.

**À retenir :** $A_{ij}$ = lien direct (un pas), $(A^2)_{ij}$ = nombre de chemins en **exactement** deux pas ; ce sont deux choses différentes.

### Lire une matrice de confusion

| Ce qu'on cherche | Où le lire |
|---|---|
| Exemples bien classés | somme de la **diagonale** |
| Nombre d'exemples réellement de la classe $k$ | somme de la **ligne** $k$ |
| Nombre d'exemples **prédits** dans la classe $k$ | somme de la **colonne** $k$ |
| Total des exemples | somme de toutes les cases |

**Exemple résolu :** un filtre classe des e-mails en « normal » (classe 1) et « spam » (classe 2) : $\begin{pmatrix} 90 & 10 \\ 5 & 45 \end{pmatrix}$.

1. Bien classés : la diagonale, $90 + 45 = 135$.
2. Spams réels : ligne 2, $5 + 45 = 50$ (45 spams reconnus et 5 pris pour des e-mails normaux).
3. Prédits « spam » : colonne 2, $10 + 45 = 55$ (dont 10 e-mails normaux classés spam par erreur).
4. Dans la transposée, lignes et colonnes s'échangent : les **lignes** de la transposée sont alors les classes **prédites**.

**À retenir :** ligne = vérité, colonne = prédiction, diagonale = bonnes réponses.

## À retenir

- Taille $m \times n$ = $m$ lignes, $n$ colonnes ; $a_{ij}$ = ligne $i$, colonne $j$.
- Addition, soustraction et multiplication par un nombre : case par case.
- $AB$ existe si colonnes de $A$ = lignes de $B$ ; $(m \times n)(n \times p) = m \times p$.
- Produit **ligne × colonne**, **non commutatif**.
- $I_n$ est neutre ; $A^T$ échange lignes et colonnes ; $AA^T$ et $A^TA$ sont symétriques.
- Linéaire : seulement des « nombre × variable » ; matrice d'une application linéaire : ses **colonnes** sont les images des vecteurs de base. Produit de matrices = composition, première étape à droite.

> [!warning] Pièges
> - On n'additionne que des matrices de **même taille**.
> - $(AB)_{ij}$ utilise la **ligne** $i$ de $A$ et la **colonne** $j$ de $B$, jamais l'inverse.
> - $AB \neq BA$ en général, et l'un des deux peut ne pas exister.
> - Une application avec un « $+1$ » n'est pas linéaire : elle n'envoie pas $\vec 0$ sur $\vec 0$.
