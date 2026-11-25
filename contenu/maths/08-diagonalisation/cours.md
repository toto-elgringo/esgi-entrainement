# Valeurs propres et diagonalisation

> [!info] Pourquoi ce chapitre ?
> C'est le chapitre le plus dense du module, et la préparation directe de la **PCA** (analyse en composantes principales). L'idée : trouver les directions qu'une matrice se contente d'**étirer**, puis s'en servir comme base pour rendre la matrice **diagonale**, donc très simple.

## 0. Rappels utiles

Trois calculs reviennent tout le temps dans ce chapitre.

**Matrice fois vecteur (ligne × colonne).** Chaque coordonnée du résultat est une ligne de la matrice multipliée par le vecteur, terme à terme, puis additionnée :

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

Exemple : $\begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix}(4, 5)$ : 1re ligne $3 \times 4 + 1 \times 5 = 17$, 2e ligne $0 \times 4 + 2 \times 5 = 10$, soit $(17, 10)$.

**Déterminant $2 \times 2$** : produit de la diagonale moins produit de l'autre diagonale.

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$

**Équation du second degré** $\lambda^2 + p\lambda + q = 0$ : on calcule $\Delta = p^2 - 4q$ ; si $\Delta \ge 0$, les solutions sont $\dfrac{-p \pm \sqrt{\Delta}}{2}$. Raccourci : on cherche deux nombres dont la **somme** vaut $-p$ et le **produit** vaut $q$.

Exemple : $\lambda^2 - 5\lambda + 4 = 0$. Somme $5$, produit $4$ : ce sont $1$ et $4$ (en effet $1 + 4 = 5$ et $1 \times 4 = 4$). Avec $\Delta$ : $25 - 16 = 9$, $\lambda = \frac{5 \pm 3}{2}$, soit $4$ et $1$.

**À retenir :** ligne × colonne pour un produit, $ad - bc$ pour un déterminant $2 \times 2$, « somme et produit » pour un second degré.

## 1. Vecteurs propres et valeurs propres

Soit $A$ une matrice **carrée**. Un vecteur $\vec v \neq \vec 0$ est un **vecteur propre** de $A$ s'il existe un réel $\lambda$ tel que

$$A\vec v = \lambda \vec v$$

Le nombre $\lambda$ est la **valeur propre** associée à $\vec v$.

- $A$ ne fait qu'**étirer** ou **rétrécir** $\vec v$ (d'un facteur $\lambda$), sans changer sa direction. Si $\lambda < 0$, le vecteur est en plus retourné.
- C'est rare : la plupart des vecteurs sont **tournés** par $A$, pas seulement agrandis.

Exemple : avec $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ et $\vec v = (1, 1)$, on a $A\vec v = (3, 3) = 3\vec v$. Donc $\vec v$ est un vecteur propre, de valeur propre $3$.

```anim
vecteurs
titre: Un vecteur propre garde sa direction
consigne: u = (2, 1) et v = (1, 2) sont les colonnes de A. Avec a = 1 et b = 1 (x = (1, 1)), le point jaune A·x = (3, 3) reste sur la diagonale : x est un vecteur propre, étiré 3 fois. Essaie a = 1, b = 0 : A·x = (2, 1) n'est plus dans la direction de (1, 0).
ux: 2
uy: 1
vx: 1
vy: 2
a: 1
b: 1
```

> [!warning] Le vecteur nul ne compte pas
> On a toujours $A\vec 0 = \lambda \vec 0$ pour n'importe quel $\lambda$ : c'est pour ça que la définition exige $\vec v \neq \vec 0$.

### Tester si un vecteur est propre

On calcule $A\vec x$, puis on regarde si le résultat est **le même nombre** fois $\vec x$, sur **toutes** les coordonnées.

**Exemple résolu :** $B = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ (elle échange les deux coordonnées). On teste $\vec x = (1, -1)$ et $\vec y = (1, 0)$.

| Vecteur | Calcul de $B \times$ vecteur | Résultat | Même nombre partout ? |
|---|---|---|---|
| $(1, -1)$ | $(0 \times 1 + 1 \times (-1),\ 1 \times 1 + 0 \times (-1))$ | $(-1, 1)$ | $-1 = -1 \times 1$ et $1 = -1 \times (-1)$ : oui, $-1$ |
| $(1, 0)$ | $(0 \times 1 + 1 \times 0,\ 1 \times 1 + 0 \times 0)$ | $(0, 1)$ | il faudrait $0 = k \times 1$ et $1 = k \times 0$ : impossible |

- $(1, -1)$ est un vecteur propre de valeur propre $-1$ : il est retourné, mais reste sur la même droite.
- $(1, 0)$ n'est **pas** un vecteur propre : son image $(0, 1)$ part dans une autre direction.

Une valeur propre peut être négative, et elle peut aussi valoir $0$ (voir plus bas) : seul le **vecteur** doit être non nul.

**À retenir :** calcule $A\vec x$, puis divise coordonnée par coordonnée : si tu trouves le même nombre partout, c'est la valeur propre ; sinon, ce n'est pas un vecteur propre.

## 2. Trouver les valeurs propres

> [!tip] Méthode (admise)
> $\lambda$ est une valeur propre de $A$ si et seulement si
> $$\det(A - \lambda I) = 0$$
> C'est l'**équation caractéristique**.

Pourquoi ? $A\vec v = \lambda\vec v$ s'écrit $(A - \lambda I)\vec v = \vec 0$. Pour qu'il existe une solution $\vec v$ non nulle, la matrice $A - \lambda I$ ne doit **pas** être inversible : son déterminant est nul (chapitre précédent).

$A - \lambda I$, c'est $A$ où l'on a retiré $\lambda$ **seulement sur la diagonale** ($I$ a des $1$ sur la diagonale et des $0$ ailleurs, donc $\lambda I$ ne touche que la diagonale).

Exemple avec $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ : on retire $\lambda$ sur la diagonale.

$$\det(A - \lambda I) = \begin{vmatrix} 2 - \lambda & 1 \\ 1 & 2 - \lambda \end{vmatrix} = (2 - \lambda)^2 - 1 = \lambda^2 - 4\lambda + 3 = (\lambda - 1)(\lambda - 3)$$

Les valeurs propres sont $\lambda_1 = 3$ et $\lambda_2 = 1$.

**Exemple résolu pas à pas :** $B = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}$.

1. On retire $\lambda$ sur la diagonale : $B - \lambda I = \begin{pmatrix} 1 - \lambda & 4 \\ 2 & 3 - \lambda \end{pmatrix}$. Le $4$ et le $2$ ne bougent pas.
2. Déterminant ($ad - bc$) : $(1 - \lambda)(3 - \lambda) - 4 \times 2$.
3. On développe : $(1 - \lambda)(3 - \lambda) = 3 - \lambda - 3\lambda + \lambda^2 = \lambda^2 - 4\lambda + 3$, puis on retire $8$ : $\lambda^2 - 4\lambda - 5$.
4. On résout $\lambda^2 - 4\lambda - 5 = 0$ : deux nombres de somme $4$ et de produit $-5$, ce sont $5$ et $-1$. (Avec $\Delta = 16 + 20 = 36$ : $\lambda = \frac{4 \pm 6}{2}$, soit $5$ et $-1$.)

Les valeurs propres de $B$ sont $5$ et $-1$.

> [!tip] Contrôle rapide (matrice $2 \times 2$)
> La **somme** des valeurs propres vaut la **trace** (somme de la diagonale) et leur **produit** vaut le **déterminant**. Sur $B$ : $5 + (-1) = 4 = 1 + 3$ et $5 \times (-1) = -5 = 1 \times 3 - 4 \times 2$. Si ça ne colle pas, il y a une erreur de calcul.

Erreur fréquente : oublier le « $- bc$ » (ici le $- 8$) et ne garder que le produit de la diagonale.

**À retenir :** retire $\lambda$ sur la diagonale, calcule $ad - bc$, résous l'équation du second degré, puis contrôle avec la trace et le déterminant.

> [!tip] Matrice triangulaire ou diagonale
> $\det(A - \lambda I)$ est alors le produit des $(a_{ii} - \lambda)$ : les valeurs propres se **lisent sur la diagonale**, sans calcul. Par exemple, $\begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix}$ a pour valeurs propres $3$ et $2$.

Une matrice est **triangulaire** quand tous les nombres d'un même côté de la diagonale sont nuls : sous la diagonale (triangulaire **supérieure**) ou au-dessus (triangulaire **inférieure**). La règle marche dans les deux cas.

**Exemple résolu :** $T = \begin{pmatrix} -2 & 0 & 0 \\ 5 & 7 & 0 \\ 1 & 3 & 4 \end{pmatrix}$.

1. Au-dessus de la diagonale, il n'y a que des $0$ : $T$ est triangulaire inférieure.
2. $\det(T - \lambda I) = (-2 - \lambda)(7 - \lambda)(4 - \lambda)$ : les nombres sous la diagonale ($5$, $1$, $3$) disparaissent du calcul.
3. Les valeurs propres sont donc $-2$, $7$ et $4$.

Erreurs fréquentes : lire la première ligne, prendre les nombres hors de la diagonale, ou oublier un signe moins.

**À retenir :** triangulaire (zéros d'un côté) ou diagonale : les valeurs propres sont les nombres de la diagonale, avec leur signe.

### Une valeur propre peut valoir 0

$\lambda = 0$ est une valeur propre quand $A\vec v = \vec 0$ pour un $\vec v$ **non nul**, c'est-à-dire quand $\det(A - 0 \times I) = \det(A) = 0$ : la matrice n'est pas inversible.

**Exemple résolu :** $C = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$ a $\det(C) = 4 - 4 = 0$. Avec $\vec v = (2, -1)$ : $C\vec v = (2 - 2,\ 4 - 4) = (0, 0) = 0 \times \vec v$. Donc $0$ est une valeur propre, et $(2, -1)$ un vecteur propre associé.

**À retenir :** une valeur propre nulle est permise ; un vecteur propre nul, jamais.

## 3. Trouver les vecteurs propres

Pour chaque valeur propre $\lambda$, on résout le système $(A - \lambda I)\vec v = \vec 0$ (pivot de Gauss, chapitre précédent). Il a toujours une infinité de solutions : une ligne disparaît.

Toujours avec $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ :

- $\lambda_1 = 3$ : $A - 3I = \begin{pmatrix} -1 & 1 \\ 1 & -1 \end{pmatrix}$, d'où $-v_1 + v_2 = 0$, soit $v_1 = v_2$. On prend $\vec v_1 = (1, 1)$.
- $\lambda_2 = 1$ : $A - I = \begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}$, d'où $v_1 + v_2 = 0$, soit $v_2 = -v_1$. On prend $\vec v_2 = (1, -1)$.

**Exemple résolu pas à pas :** les vecteurs propres de $B = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}$ (valeurs propres $5$ et $-1$).

Pour $\lambda = 5$ :

1. $B - 5I = \begin{pmatrix} 1 - 5 & 4 \\ 2 & 3 - 5 \end{pmatrix} = \begin{pmatrix} -4 & 4 \\ 2 & -2 \end{pmatrix}$.
2. 1re ligne : $-4v_1 + 4v_2 = 0$, donc $v_1 = v_2$. La 2e ligne, $2v_1 - 2v_2 = 0$, dit **la même chose** (c'est normal : une ligne « disparaît »).
3. On choisit une valeur simple, $v_2 = 1$ : $\vec v = (1, 1)$.
4. Vérification : $B(1, 1) = (1 + 4,\ 2 + 3) = (5, 5) = 5\,(1, 1)$.

Pour $\lambda = -1$ :

1. $B - (-1)I = B + I = \begin{pmatrix} 2 & 4 \\ 2 & 4 \end{pmatrix}$ (retirer $-1$, c'est ajouter $1$).
2. Ligne : $2v_1 + 4v_2 = 0$, donc $v_1 = -2v_2$.
3. Avec $v_2 = -1$ : $\vec v = (2, -1)$.
4. Vérification : $B(2, -1) = (2 - 4,\ 4 - 3) = (-2, 1) = -1 \times (2, -1)$.

Si tu trouves que les deux lignes donnent seulement $\vec v = (0, 0)$, c'est que la valeur propre est fausse : refais l'équation caractéristique.

**À retenir :** écris $A - \lambda I$, tire une relation entre $v_1$ et $v_2$ d'**une** ligne, choisis une valeur simple, puis vérifie avec $A\vec v = \lambda \vec v$.

> [!info] Défini à un facteur près
> Si $\vec v$ est un vecteur propre, $2\vec v$, $-\vec v$ ou $10\vec v$ le sont aussi, pour la même valeur propre. $(2, 2)$ ou $(-1, -1)$ conviennent aussi bien que $(1, 1)$.

Pourquoi : $A(k\vec v) = k\,A\vec v = k\lambda\vec v = \lambda\,(k\vec v)$. Par exemple, pour $B$ et $\lambda = -1$, $(-4, 2) = -2 \times (2, -1)$ est aussi un vecteur propre. En revanche $(-1, 2)$ ne l'est pas : ce n'est pas un multiple de $(2, -1)$ (les coordonnées sont inversées, pas multipliées par un même nombre).

**À retenir :** pour savoir si deux vecteurs sont « le même vecteur propre », cherche un nombre $k$ tel que l'un soit $k$ fois l'autre, sur les deux coordonnées.

## 4. Diagonaliser

> [!tip] Principe
> Si $A$ (de taille $n \times n$) a $n$ vecteurs propres qui forment une **base**, on range :
> - dans $P$ : les vecteurs propres, **en colonnes** ;
> - dans $D$ : les valeurs propres, **sur la diagonale**, dans le **même ordre**.
>
> Alors $$A = P D P^{-1}$$

Sur l'exemple :

$$P = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} \qquad D = \begin{pmatrix} 3 & 0 \\ 0 & 1 \end{pmatrix}$$

La 1re colonne de $P$, $(1, 1)$, va avec la 1re valeur de $D$, $3$.

C'est l'idée du chapitre « Matrices » : **même application, autre base, autre matrice**. Dans la base des vecteurs propres, l'application est simplement « étirer de 3 dans une direction, de 1 dans l'autre » : sa matrice est $D$.

**Exemple résolu pas à pas :** diagonaliser $B = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}$, avec $(1, 1)$ pour $5$ et $(2, -1)$ pour $-1$.

1. **Colonnes de $P$** : 1re colonne $(1, 1)$, 2e colonne $(2, -1)$. On écrit chaque vecteur **de haut en bas** :
$$P = \begin{pmatrix} 1 & 2 \\ 1 & -1 \end{pmatrix}$$
Lue ligne par ligne, $P$ donne $(1, 2, 1, -1)$ : la 1re ligne prend le 1er nombre de **chaque** vecteur.
2. **$D$ dans le même ordre** : $5$ (pour la 1re colonne) puis $-1$ : $D = \begin{pmatrix} 5 & 0 \\ 0 & -1 \end{pmatrix}$.
3. **$P$ est-elle inversible ?** $\det(P) = 1 \times (-1) - 2 \times 1 = -3 \neq 0$. Oui : les deux vecteurs propres ne sont pas alignés, ils forment une base. (Si $\det(P) = 0$, on n'aurait pas de $P^{-1}$, donc pas de diagonalisation.)
4. **Changer l'ordre** : si on veut $D = \begin{pmatrix} -1 & 0 \\ 0 & 5 \end{pmatrix}$, on échange aussi les **colonnes** de $P$ : $P = \begin{pmatrix} 2 & 1 \\ -1 & 1 \end{pmatrix}$, soit $(2, 1, -1, 1)$ ligne par ligne.

Erreurs fréquentes : mettre les vecteurs propres en **lignes** (on obtiendrait $\begin{pmatrix} 1 & 1 \\ 2 & -1 \end{pmatrix}$, qui est une autre matrice), échanger les valeurs de $D$ sans échanger les colonnes de $P$, ou échanger les lignes de $P$ au lieu des colonnes.

**À retenir :** la $k$-ième colonne de $P$ est le vecteur propre de la $k$-ième valeur de $D$ ; ce que tu échanges d'un côté, échange-le de l'autre.

> [!info] Vérifier sans calculer $P^{-1}$
> $A = PDP^{-1}$ revient à $AP = PD$ : il suffit de vérifier que $A$ fois chaque colonne de $P$ donne cette colonne multipliée par sa valeur propre.

## 5. Pourquoi diagonaliser : les puissances

$$A^n = P D^n P^{-1} \qquad \text{avec} \qquad D^n = \begin{pmatrix} \lambda_1^n & 0 \\ 0 & \lambda_2^n \end{pmatrix}$$

En effet, $A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}$ : les $P^{-1}P$ du milieu s'annulent. Élever une matrice diagonale à une puissance ne coûte rien : on élève chaque coefficient de la diagonale. Calculer $A^{100}$ directement demanderait 99 produits de matrices.

### Puissance d'une matrice diagonale

**Exemple résolu :** $K = \begin{pmatrix} 4 & 0 \\ 0 & -1 \end{pmatrix}$.

- $K^2$ : $4^2 = 16$ et $(-1)^2 = 1$, donc $\begin{pmatrix} 16 & 0 \\ 0 & 1 \end{pmatrix}$.
- $K^3$ : $4^3 = 64$ et $(-1)^3 = -1$, donc $\begin{pmatrix} 64 & 0 \\ 0 & -1 \end{pmatrix}$.
- $K^n$ : $\begin{pmatrix} 4^n & 0 \\ 0 & (-1)^n \end{pmatrix}$. Les zéros restent des zéros.

Pour un nombre négatif : puissance **paire** → résultat positif, puissance **impaire** → résultat négatif. Et $4^n$ (puissance) n'est pas $4n$ (multiplication) : $4^3 = 64$, alors que $4 \times 3 = 12$.

**À retenir :** une matrice diagonale s'élève à la puissance case par case sur la diagonale ; surveille le signe des nombres négatifs.

> [!warning] Seulement pour une matrice diagonale
> Pour une matrice **non** diagonale, $A^2$ n'est **pas** la matrice des carrés. Avec $B = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}$, le produit ligne × colonne donne $B^2 = \begin{pmatrix} 1 \times 1 + 4 \times 2 & 1 \times 4 + 4 \times 3 \\ 2 \times 1 + 3 \times 2 & 2 \times 4 + 3 \times 3 \end{pmatrix} = \begin{pmatrix} 9 & 16 \\ 8 & 17 \end{pmatrix}$, et pas $\begin{pmatrix} 1 & 16 \\ 4 & 9 \end{pmatrix}$.

### Puissance grâce à $PD^nP^{-1}$

Sur l'exemple, avec $P^{-1} = \dfrac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$ :

$$A^n = \frac{1}{2}\begin{pmatrix} 3^n + 1 & 3^n - 1 \\ 3^n - 1 & 3^n + 1 \end{pmatrix}$$

Pour $n = 2$, on retrouve bien $A^2 = \begin{pmatrix} 5 & 4 \\ 4 & 5 \end{pmatrix}$.

L'inverse d'une matrice $2 \times 2$ se calcule avec la formule :

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

(on échange les deux nombres de la diagonale, on change le signe des deux autres, on divise par le déterminant).

**Exemple résolu pas à pas :** une formule pour $B^n$, avec $P = \begin{pmatrix} 1 & 2 \\ 1 & -1 \end{pmatrix}$ et $D = \begin{pmatrix} 5 & 0 \\ 0 & -1 \end{pmatrix}$.

1. **$P^{-1}$** : $\det(P) = -3$, donc $P^{-1} = \frac{1}{-3}\begin{pmatrix} -1 & -2 \\ -1 & 1 \end{pmatrix} = \frac{1}{3}\begin{pmatrix} 1 & 2 \\ 1 & -1 \end{pmatrix}$.
2. **$D^n$** $= \begin{pmatrix} 5^n & 0 \\ 0 & (-1)^n \end{pmatrix}$.
3. **$PD^n$** : multiplier à droite par une diagonale multiplie chaque **colonne** de $P$ par sa valeur : 1re colonne fois $5^n$, 2e colonne fois $(-1)^n$.
$$PD^n = \begin{pmatrix} 5^n & 2(-1)^n \\ 5^n & -(-1)^n \end{pmatrix}$$
4. **Une case de $PD^nP^{-1}$** : case $(i, j)$ = ligne $i$ de $PD^n$ fois colonne $j$ de $P^{-1}$. Case $(1, 1)$ : la ligne $(5^n,\ 2(-1)^n)$ fois la colonne $\frac{1}{3}(1, 1)$ donne
$$\frac{5^n + 2(-1)^n}{3}$$
5. **Contrôle** : pour $n = 1$, $\frac{5 - 2}{3} = 1$, c'est bien la case $(1, 1)$ de $B$ ; pour $n = 2$, $\frac{25 + 2}{3} = 9$, c'est bien celle de $B^2$.

Erreurs fréquentes : oublier le facteur $\frac{1}{3}$ de $P^{-1}$, multiplier les **lignes** de $P$ par les valeurs propres au lieu des colonnes, ou ne pas vérifier avec $n = 1$.

**À retenir :** $PD^n$ (colonnes fois $\lambda^n$), puis ligne fois colonne de $P^{-1}$, puis contrôle avec $n = 1$ : on doit retrouver $A$.

### Un processus qui se répète

> [!tip] Lien avec la data
> Un processus qui se répète, $\vec x_{n+1} = A\vec x_n$ (certaines chaînes de Markov, systèmes dynamiques), donne $\vec x_n = A^n \vec x_0$. Les valeurs propres décident de tout : si toutes vérifient $|\lambda| < 1$, le processus **converge** vers $\vec 0$ ; si l'une a $|\lambda| > 1$, il **explose** ; une valeur propre négative le fait **osciller** (changer de signe à chaque étape).

Quand $A$ est diagonale, chaque coordonnée évolue toute seule : la coordonnée $i$ vaut (sa valeur de départ) $\times \lambda_i^n$. C'est une **suite géométrique** de raison $\lambda_i$, et son comportement dépend seulement de $\lambda_i$ :

| Valeur propre $\lambda$ | Ce que fait $\lambda^n$ | Exemple |
|---|---|---|
| entre $0$ et $1$ | diminue vers $0$ | $0{,}5^n$ : $1, 0{,}5, 0{,}25, \dots$ |
| égale à $1$ | ne bouge pas | $1, 1, 1, \dots$ |
| plus grande que $1$ | grandit sans limite (explose) | $2^n$ : $1, 2, 4, 8, \dots$ |
| entre $-1$ et $0$ | change de signe et tend vers $0$ | $(-0{,}5)^n$ : $1, -0{,}5, 0{,}25, \dots$ |
| égale à $-1$ | change de signe, taille constante (oscille) | $1, -1, 1, -1, \dots$ |
| plus petite que $-1$ | change de signe et explose | $(-2)^n$ : $1, -2, 4, -8, \dots$ |

**Exemple résolu :** $A = \begin{pmatrix} 0{,}1 & 0 \\ 0 & -0{,}5 \end{pmatrix}$ et $\vec x_0 = (10, 6)$.

1. $A^n = \begin{pmatrix} 0{,}1^n & 0 \\ 0 & (-0{,}5)^n \end{pmatrix}$, donc $\vec x_n = (10 \times 0{,}1^n,\ 6 \times (-0{,}5)^n)$.
2. Premiers termes : $\vec x_1 = (1, -3)$, $\vec x_2 = (0{,}1;\ 1{,}5)$, $\vec x_3 = (0{,}01;\ -0{,}75)$.
3. Les deux valeurs propres sont entre $-1$ et $1$ : $\vec x_n \to (0, 0)$. La 2e coordonnée change de signe à chaque étape, mais sa taille fond quand même.

Pour que le processus converge vers $\vec 0$, il faut que **toutes** les valeurs propres soient entre $-1$ et $1$ (strictement) : une seule valeur plus grande que $1$ en valeur absolue suffit à tout faire exploser.

Erreur fréquente : écrire $10 \times 0{,}1 \times n$ au lieu de $10 \times 0{,}1^n$. Chaque étape **multiplie** par $\lambda$, elle n'ajoute pas.

**À retenir :** coordonnée $i$ = départ $\times \lambda_i^n$ ; regarde la taille de chaque $\lambda$ (plus petite ou plus grande que $1$) puis son signe.

## 6. Matrices par blocs

On peut découper une grande matrice en **sous-matrices** (des blocs) et calculer bloc par bloc, comme avec des nombres, tant que les tailles des blocs sont compatibles :

$$\begin{pmatrix} A & B \\ C & D \end{pmatrix} \begin{pmatrix} E \\ F \end{pmatrix} = \begin{pmatrix} AE + BF \\ CE + DF \end{pmatrix}$$

Exemple : $M = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 1 \\ 0 & 2 & 5 \end{pmatrix}$ se découpe en $A = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix}$, $B = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$, $C = \begin{pmatrix} 0 & 2 \end{pmatrix}$, $D = (5)$. C'est la **même** matrice, écrite autrement.

Pour **assembler** les blocs : $B$ a autant de lignes que $A$, il se colle **à droite** de $A$ (il prolonge ses lignes) ; $C$ a autant de colonnes que $A$, il se colle **en dessous** ; $D$ remplit le coin en bas à droite.

**Exemple résolu pas à pas :** $M \times (1, 1, 1)$ par blocs. On découpe le vecteur comme les colonnes de $M$ : $E = (1, 1)$ (les deux premières coordonnées) et $F = (1)$.

1. $AE$ : $(1 \times 1 + 2 \times 1,\ 3 \times 1 + 1 \times 1) = (3, 4)$.
2. $BF$ : la colonne $(0, 1)$ fois le nombre $1$, soit $(0, 1)$.
3. Bloc du haut : $AE + BF = (3, 4) + (0, 1) = (3, 5)$.
4. $CE$ : une ligne fois une colonne donne **un nombre** : $0 \times 1 + 2 \times 1 = 2$. $DF = 5 \times 1 = 5$. Bloc du bas : $2 + 5 = 7$.
5. Contrôle direct : $M(1, 1, 1) = (1 + 2 + 0,\ 3 + 1 + 1,\ 0 + 2 + 5) = (3, 5, 7)$. Même résultat.

Erreurs fréquentes : poser $B$ en ligne ou $C$ en colonne, ou oublier un des deux morceaux ($BF$ ou $DF$) dans la somme.

**À retenir :** on calcule par blocs comme avec des nombres, en gardant l'ordre des produits ; le résultat est exactement celui du calcul complet.

> [!tip] Lien avec la data
> Une matrice de millions de lignes ne tient pas en mémoire : on la découpe en blocs traités séparément (en parallèle, ou morceau par morceau), puis on recombine. C'est le principe du **calcul matriciel distribué**.

Le découpage ne change **ni le résultat** ni le nombre total de multiplications : il les **répartit** entre plusieurs machines ou plusieurs passages en mémoire.

## 7. Quand on ne peut pas diagonaliser

Certaines matrices n'ont **pas assez de vecteurs propres indépendants** pour former une base : elles ne sont pas diagonalisables. On peut alors les **trigonaliser** : $A = PTP^{-1}$ avec $T$ **triangulaire**. Une matrice triangulaire reste simple (ses valeurs propres se lisent sur la diagonale). Le calcul n'est pas au programme : il suffit de savoir que cette solution existe.

**Exemple résolu :** $N = \begin{pmatrix} 2 & 3 \\ 0 & 2 \end{pmatrix}$.

1. Triangulaire : une seule valeur propre, $2$ (deux fois).
2. Vecteurs propres : $N - 2I = \begin{pmatrix} 0 & 3 \\ 0 & 0 \end{pmatrix}$, d'où $3v_2 = 0$, soit $v_2 = 0$. Les vecteurs propres sont donc tous de la forme $(t, 0)$ : une **seule** direction.
3. Pour remplir $P$ ($2 \times 2$), il faudrait deux vecteurs propres non alignés : impossible. $N$ n'est **pas** diagonalisable (elle est déjà triangulaire).

**À retenir :** toutes les matrices ne sont pas diagonalisables ; il faut $n$ vecteurs propres non alignés pour une matrice $n \times n$.

## 8. Vers la PCA

Dans un nuage de points, certaines directions **expliquent** une grande partie de la dispersion des données, d'autres presque rien. Ces directions sont les **vecteurs propres** de la **matrice de covariance** des données, et l'importance de chaque direction est sa **valeur propre**.

La PCA garde les quelques directions de plus grandes valeurs propres et oublie les autres. La part d'information (de variance) gardée par une direction vaut

$$\frac{\lambda_i}{\lambda_1 + \lambda_2 + \dots + \lambda_n}$$

Exemple : avec les valeurs propres $7$, $2$ et $1$ (total $10$), la 1re direction garde à elle seule $70\,\%$ de la variance.

**Exemple résolu : combien de directions garder ?** Valeurs propres $12$, $5$, $2$ et $1$, et on veut garder au moins $85\,\%$ de la variance.

1. **Variance totale** = somme des valeurs propres : $12 + 5 + 2 + 1 = 20$.
2. **Parts cumulées**, des plus grandes valeurs propres aux plus petites :

| Directions gardées | Somme des $\lambda$ | Part cumulée | Au moins $85\,\%$ ? |
|---|---|---|---|
| 1 | $12$ | $12 / 20 = 60\,\%$ | non |
| 2 | $12 + 5 = 17$ | $17 / 20 = 85\,\%$ | oui |
| 3 | $19$ | $95\,\%$ | oui |

3. On s'arrête à la **première** ligne qui atteint le seuil : **2** directions suffisent ($85\,\%$ est bien « au moins $85\,\%$ »).

Erreurs fréquentes : donner la valeur propre ($12$) au lieu du pourcentage, oublier de diviser par le total, ou prendre une direction de trop.

**À retenir :** part = $\lambda_i$ / somme ; on additionne les parts dans l'ordre décroissant jusqu'à atteindre le seuil.

## À retenir

- $A\vec v = \lambda\vec v$ avec $\vec v \neq \vec 0$ : $\vec v$ est étiré, pas tourné.
- Valeurs propres : solutions de $\det(A - \lambda I) = 0$ ; vecteurs propres : solutions de $(A - \lambda I)\vec v = \vec 0$.
- Triangulaire ou diagonale : valeurs propres sur la diagonale.
- $A = PDP^{-1}$ (vecteurs propres en colonnes de $P$, valeurs propres dans $D$) et $A^n = PD^nP^{-1}$.
- Par blocs : on calcule comme avec des nombres. Pas diagonalisable : on trigonalise.

> [!warning] Pièges
> - Un vecteur propre n'est **jamais** nul, mais une valeur propre peut valoir $0$.
> - L'ordre des colonnes de $P$ doit suivre l'ordre des valeurs propres dans $D$.
> - Dans $\det(A - \lambda I)$, on retire $\lambda$ **seulement sur la diagonale**.
> - Toutes les matrices ne sont pas diagonalisables.
