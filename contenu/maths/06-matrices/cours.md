# Matrices et produit matriciel

> [!info] Pourquoi ce chapitre ?
> Un jeu de données, une couche de réseau de neurones, un graphe, une matrice de confusion : tout ça se range dans des **tableaux de nombres**. La matrice est l'outil central du module : les déterminants, les valeurs propres et la PCA reposent dessus.

## 1. Qu'est-ce qu'une matrice ?

Une **matrice** de taille $m \times n$ est un tableau de nombres à $m$ **lignes** et $n$ **colonnes** :

$$A = \begin{pmatrix} a_{11} & a_{12} & \dots & a_{1n} \\ \vdots & & & \vdots \\ a_{m1} & a_{m2} & \dots & a_{mn} \end{pmatrix}$$

Le coefficient $a_{ij}$ est à la **ligne $i$**, **colonne $j$** (toujours la ligne d'abord).

Exemple : $M = \begin{pmatrix} 4 & -2 & 7 \\ 0 & 1 & 3 \end{pmatrix}$ est une matrice $2 \times 3$, avec $a_{13} = 7$ et $a_{21} = 0$.

Cas particuliers :

- une matrice $n \times 1$ (une seule colonne) est un **vecteur colonne** ;
- une matrice $1 \times n$ (une seule ligne) est un **vecteur ligne** ;
- une matrice $n \times n$ est dite **carrée**.

> [!tip] Lien avec la data
> Un tableau de $m$ observations (lignes) décrites par $n$ variables (colonnes) est une matrice $m \times n$. Une image en niveaux de gris est une matrice de pixels.

> [!info] Sur ce site
> Quand on te demande une matrice, écris ses coefficients **ligne par ligne** dans une liste : $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ s'écrit `(a, b, c, d)`.

## 2. Addition et multiplication par un nombre

- **Addition** : terme à terme, et seulement entre deux matrices de **même taille**.
- **Multiplication par un scalaire** $\lambda$ : on multiplie **chaque** coefficient par $\lambda$.

$$\begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} + \begin{pmatrix} 4 & -1 \\ 0 & 2 \end{pmatrix} = \begin{pmatrix} 5 & -1 \\ 2 & 5 \end{pmatrix} \qquad 3\begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix} = \begin{pmatrix} 3 & 0 \\ 6 & 9 \end{pmatrix}$$

## 3. Le produit matriciel

### Quand peut-on multiplier ?

Le produit $AB$ existe seulement si le **nombre de colonnes de $A$** est égal au **nombre de lignes de $B$** :

$$\underbrace{A}_{m \times n} \times \underbrace{B}_{n \times p} = \underbrace{AB}_{m \times p}$$

Les deux tailles « du milieu » doivent être égales ; celles « du bord » donnent la taille du résultat.

### La règle ligne × colonne

Le coefficient $(AB)_{ij}$ se calcule avec la **ligne $i$ de $A$** et la **colonne $j$ de $B$** : on multiplie terme à terme, puis on additionne.

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}\, b_{kj} = a_{i1} b_{1j} + a_{i2} b_{2j} + \dots + a_{in} b_{nj}$$

Exemple avec $A = \begin{pmatrix} 1 & 3 \\ 2 & -1 \end{pmatrix}$ et $B = \begin{pmatrix} 2 & 0 \\ 1 & 4 \end{pmatrix}$ :

$$AB = \begin{pmatrix} 1 \times 2 + 3 \times 1 & 1 \times 0 + 3 \times 4 \\ 2 \times 2 + (-1) \times 1 & 2 \times 0 + (-1) \times 4 \end{pmatrix} = \begin{pmatrix} 5 & 12 \\ 3 & -4 \end{pmatrix}$$

### Le produit n'est pas commutatif

Dans l'autre sens, avec les mêmes matrices :

$$BA = \begin{pmatrix} 2 & 6 \\ 9 & -1 \end{pmatrix} \neq AB$$

> [!warning] $AB \neq BA$ en général
> L'ordre compte. Parfois, un seul des deux produits existe : avec $A$ de taille $2 \times 3$ et $B$ de taille $3 \times 4$, $AB$ existe ($2 \times 4$) mais pas $BA$ ($4 \neq 2$).

> [!tip] Lien avec la data
> Dans un réseau de neurones, les couches s'enchaînent dans un ordre précis : chaque couche transforme la sortie de la précédente. On ne peut pas échanger l'ordre des produits.

## 4. Identité et transposée

La **matrice identité** $I_n$ est la matrice carrée $n \times n$ avec des $1$ sur la diagonale et des $0$ partout ailleurs :

$$I_2 = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \qquad I_3 = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

Elle joue le rôle du nombre $1$ : $A I_n = I_n A = A$ (quand les tailles le permettent).

La **transposée** $A^T$ s'obtient en **échangeant lignes et colonnes** : $(A^T)_{ij} = a_{ji}$. Une matrice $m \times n$ devient $n \times m$.

$$\begin{pmatrix} 1 & 0 & 5 \\ 2 & -3 & 4 \end{pmatrix}^T = \begin{pmatrix} 1 & 2 \\ 0 & -3 \\ 5 & 4 \end{pmatrix}$$

La 1re ligne devient la 1re colonne, la 2e ligne devient la 2e colonne.

> [!tip] Astuce
> $A^T A$ est toujours carrée et **symétrique** (elle est égale à sa transposée) : son coefficient $(i, j)$ est la somme des produits de la colonne $i$ et de la colonne $j$ de $A$.

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

### La matrice d'une application linéaire

Une application linéaire est entièrement connue par les **images des vecteurs de base**. Sa matrice (dans la base canonique) a pour **colonnes** ces images.

Exemple : $f(x, y) = (x + 2y,\ 3x - y)$, avec $e_1 = (1, 0)$ et $e_2 = (0, 1)$.

- $f(e_1) = (1, 3)$ : c'est la 1re colonne ;
- $f(e_2) = (2, -1)$ : c'est la 2e colonne.

$$A = \begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix}$$

Vérification : $A \begin{pmatrix} 2 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 + 2 \\ 6 - 1 \end{pmatrix} = \begin{pmatrix} 4 \\ 5 \end{pmatrix}$, et on a bien $f(2, 1) = (2 + 2,\ 6 - 1) = (4, 5)$.

### Le produit matrice × vecteur

$A\vec x$ est une **combinaison linéaire des colonnes** de $A$, avec les coordonnées de $\vec x$ comme coefficients :

$$\begin{pmatrix} 1 & 2 \\ 3 & -1 \end{pmatrix}\begin{pmatrix} 2 \\ 1 \end{pmatrix} = 2\begin{pmatrix} 1 \\ 3 \end{pmatrix} + 1\begin{pmatrix} 2 \\ -1 \end{pmatrix} = \begin{pmatrix} 4 \\ 5 \end{pmatrix}$$

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

### Même application, autre base, autre matrice

La matrice **dépend de la base choisie**. Dans une autre base, la même application a une autre matrice. Une matrice n'est donc pas l'application elle-même, c'est sa **représentation** dans une base. Bien choisir la base pour obtenir une matrice très simple (diagonale) : c'est toute l'idée de la **diagonalisation** (chapitre suivant de big data).

### Produit = composition

Si $f$ a pour matrice $A$ et $g$ a pour matrice $B$, alors « faire $f$ **puis** $g$ » ($g \circ f$) a pour matrice $BA$ : la première appliquée est **à droite**.

C'est la vraie raison de la règle ligne × colonne. Et c'est aussi pour ça que $AB \neq BA$ : faire $f$ puis $g$ n'est en général pas la même chose que faire $g$ puis $f$.

## 6. Les matrices en IABD

- **Couche dense d'un réseau de neurones** : $\vec y = W\vec x + \vec b$. Le produit $W\vec x$ est une transformation linéaire, $\vec b$ un décalage. Si $W$ est de taille $3 \times 2$, la couche prend $2$ valeurs en entrée et en sort $3$.
- **Matrice d'adjacence** d'un graphe : $A_{ij} = 1$ si les sommets $i$ et $j$ sont reliés, $0$ sinon. Le coefficient $(A^2)_{ij}$ compte les **chemins de longueur 2** entre $i$ et $j$.
- **Matrice de confusion** : ligne = classe réelle, colonne = classe prédite. La **diagonale** compte les exemples bien classés.
- **Matrice de corrélation** : chaque case mesure le lien entre deux colonnes d'un jeu de données.

Dans tous les cas, on utilise les mêmes règles (somme, produit, transposée).

## À retenir

- Taille $m \times n$ = $m$ lignes, $n$ colonnes ; $a_{ij}$ = ligne $i$, colonne $j$.
- $AB$ existe si colonnes de $A$ = lignes de $B$ ; $(m \times n)(n \times p) = m \times p$.
- Produit **ligne × colonne**, **non commutatif**.
- $I_n$ est neutre ; $A^T$ échange lignes et colonnes.
- Matrice d'une application linéaire : ses **colonnes** sont les images des vecteurs de base. Produit de matrices = composition.

> [!warning] Pièges
> - On n'additionne que des matrices de **même taille**.
> - $(AB)_{ij}$ utilise la **ligne** $i$ de $A$ et la **colonne** $j$ de $B$, jamais l'inverse.
> - $AB \neq BA$ en général, et l'un des deux peut ne pas exister.
> - Une application avec un « $+1$ » n'est pas linéaire : elle n'envoie pas $\vec 0$ sur $\vec 0$.
