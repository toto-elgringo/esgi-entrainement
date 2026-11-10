# Valeurs propres et diagonalisation

> [!info] Pourquoi ce chapitre ?
> C'est le chapitre le plus dense du module, et la préparation directe de la **PCA** (analyse en composantes principales). L'idée : trouver les directions qu'une matrice se contente d'**étirer**, puis s'en servir comme base pour rendre la matrice **diagonale**, donc très simple.

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

## 2. Trouver les valeurs propres

> [!tip] Méthode (admise)
> $\lambda$ est une valeur propre de $A$ si et seulement si
> $$\det(A - \lambda I) = 0$$
> C'est l'**équation caractéristique**.

Pourquoi ? $A\vec v = \lambda\vec v$ s'écrit $(A - \lambda I)\vec v = \vec 0$. Pour qu'il existe une solution $\vec v$ non nulle, la matrice $A - \lambda I$ ne doit **pas** être inversible : son déterminant est nul (chapitre précédent).

Exemple avec $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ : on retire $\lambda$ sur la diagonale.

$$\det(A - \lambda I) = \begin{vmatrix} 2 - \lambda & 1 \\ 1 & 2 - \lambda \end{vmatrix} = (2 - \lambda)^2 - 1 = \lambda^2 - 4\lambda + 3 = (\lambda - 1)(\lambda - 3)$$

Les valeurs propres sont $\lambda_1 = 3$ et $\lambda_2 = 1$.

> [!tip] Matrice triangulaire ou diagonale
> $\det(A - \lambda I)$ est alors le produit des $(a_{ii} - \lambda)$ : les valeurs propres se **lisent sur la diagonale**, sans calcul. Par exemple, $\begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix}$ a pour valeurs propres $3$ et $2$.

## 3. Trouver les vecteurs propres

Pour chaque valeur propre $\lambda$, on résout le système $(A - \lambda I)\vec v = \vec 0$ (pivot de Gauss, chapitre précédent). Il a toujours une infinité de solutions : une ligne disparaît.

Toujours avec $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$ :

- $\lambda_1 = 3$ : $A - 3I = \begin{pmatrix} -1 & 1 \\ 1 & -1 \end{pmatrix}$, d'où $-v_1 + v_2 = 0$, soit $v_1 = v_2$. On prend $\vec v_1 = (1, 1)$.
- $\lambda_2 = 1$ : $A - I = \begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}$, d'où $v_1 + v_2 = 0$, soit $v_2 = -v_1$. On prend $\vec v_2 = (1, -1)$.

> [!info] Défini à un facteur près
> Si $\vec v$ est un vecteur propre, $2\vec v$, $-\vec v$ ou $10\vec v$ le sont aussi, pour la même valeur propre. $(2, 2)$ ou $(-1, -1)$ conviennent aussi bien que $(1, 1)$.

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

> [!info] Vérifier sans calculer $P^{-1}$
> $A = PDP^{-1}$ revient à $AP = PD$ : il suffit de vérifier que $A$ fois chaque colonne de $P$ donne cette colonne multipliée par sa valeur propre.

## 5. Pourquoi diagonaliser : les puissances

$$A^n = P D^n P^{-1} \qquad \text{avec} \qquad D^n = \begin{pmatrix} \lambda_1^n & 0 \\ 0 & \lambda_2^n \end{pmatrix}$$

En effet, $A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}$ : les $P^{-1}P$ du milieu s'annulent. Élever une matrice diagonale à une puissance ne coûte rien : on élève chaque coefficient de la diagonale. Calculer $A^{100}$ directement demanderait 99 produits de matrices.

Sur l'exemple, avec $P^{-1} = \dfrac{1}{2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$ :

$$A^n = \frac{1}{2}\begin{pmatrix} 3^n + 1 & 3^n - 1 \\ 3^n - 1 & 3^n + 1 \end{pmatrix}$$

Pour $n = 2$, on retrouve bien $A^2 = \begin{pmatrix} 5 & 4 \\ 4 & 5 \end{pmatrix}$.

> [!tip] Lien avec la data
> Un processus qui se répète, $\vec x_{n+1} = A\vec x_n$ (certaines chaînes de Markov, systèmes dynamiques), donne $\vec x_n = A^n \vec x_0$. Les valeurs propres décident de tout : si toutes vérifient $|\lambda| < 1$, le processus **converge** vers $\vec 0$ ; si l'une a $|\lambda| > 1$, il **explose** ; une valeur propre négative le fait **osciller** (changer de signe à chaque étape).

## 6. Matrices par blocs

On peut découper une grande matrice en **sous-matrices** (des blocs) et calculer bloc par bloc, comme avec des nombres, tant que les tailles des blocs sont compatibles :

$$\begin{pmatrix} A & B \\ C & D \end{pmatrix} \begin{pmatrix} E \\ F \end{pmatrix} = \begin{pmatrix} AE + BF \\ CE + DF \end{pmatrix}$$

Exemple : $M = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 1 \\ 0 & 2 & 5 \end{pmatrix}$ se découpe en $A = \begin{pmatrix} 1 & 2 \\ 3 & 1 \end{pmatrix}$, $B = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$, $C = \begin{pmatrix} 0 & 2 \end{pmatrix}$, $D = (5)$. C'est la **même** matrice, écrite autrement.

> [!tip] Lien avec la data
> Une matrice de millions de lignes ne tient pas en mémoire : on la découpe en blocs traités séparément (en parallèle, ou morceau par morceau), puis on recombine. C'est le principe du **calcul matriciel distribué**.

## 7. Quand on ne peut pas diagonaliser

Certaines matrices n'ont **pas assez de vecteurs propres indépendants** pour former une base : elles ne sont pas diagonalisables. On peut alors les **trigonaliser** : $A = PTP^{-1}$ avec $T$ **triangulaire**. Une matrice triangulaire reste simple (ses valeurs propres se lisent sur la diagonale). Le calcul n'est pas au programme : il suffit de savoir que cette solution existe.

## 8. Vers la PCA

Dans un nuage de points, certaines directions **expliquent** une grande partie de la dispersion des données, d'autres presque rien. Ces directions sont les **vecteurs propres** de la **matrice de covariance** des données, et l'importance de chaque direction est sa **valeur propre**.

La PCA garde les quelques directions de plus grandes valeurs propres et oublie les autres. La part d'information (de variance) gardée par une direction vaut

$$\frac{\lambda_i}{\lambda_1 + \lambda_2 + \dots + \lambda_n}$$

Exemple : avec les valeurs propres $7$, $2$ et $1$ (total $10$), la 1re direction garde à elle seule $70\,\%$ de la variance.

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
