# Déterminants et systèmes linéaires

> [!info] Pourquoi ce chapitre ?
> Le **déterminant** est un seul nombre qui dit si une matrice carrée est « réversible » (inversible) ou si elle écrase l'espace. Il sert ensuite à résoudre des **systèmes linéaires**, ce que font en permanence les bibliothèques de calcul (NumPy, régression linéaire…).

## 1. Le déterminant d'une matrice 2 × 2

$$\det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$$

On multiplie la diagonale « descendante », on retire le produit de l'autre diagonale.

Exemple : $\det \begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix} = 4 \times 2 - 3 \times 1 = 5$.

> [!info] Notation
> On écrit aussi le déterminant avec des barres droites : $\begin{vmatrix} 4 & 3 \\ 1 & 2 \end{vmatrix} = 5$.

## 2. En dimension plus grande : les cofacteurs

Pour une matrice $A = (a_{ij})$ de taille $n \times n$ :

- le **mineur** $M_{ij}$ est le déterminant de la matrice $(n-1) \times (n-1)$ obtenue en **barrant la ligne $i$ et la colonne $j$** ;
- le **cofacteur** est $C_{ij} = (-1)^{i+j} M_{ij}$ : le mineur, avec un signe.

Les signes $(-1)^{i+j}$ forment un damier qui commence par $+$ en haut à gauche :

$$\begin{pmatrix} + & - & + & - \\ - & + & - & + \\ + & - & + & - \\ - & + & - & + \end{pmatrix}$$

**Développement selon la ligne $i$** (admis) :

$$\det(A) = \sum_{j=1}^{n} a_{ij}\, C_{ij} = \sum_{j=1}^{n} (-1)^{i+j}\, a_{ij}\, M_{ij}$$

On peut choisir **n'importe quelle ligne ou colonne** : le résultat est toujours le même.

> [!tip] Astuce
> Développe selon la ligne (ou la colonne) qui contient le **plus de zéros** : chaque $0$ supprime un mineur à calculer.

### Le cas 3 × 3

Selon la 1re ligne :

$$\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} = a \begin{vmatrix} e & f \\ h & i \end{vmatrix} - b \begin{vmatrix} d & f \\ g & i \end{vmatrix} + c \begin{vmatrix} d & e \\ g & h \end{vmatrix}$$

En développant tout, on obtient la **règle de Sarrus** (valable **uniquement** en $3 \times 3$) :

$$\det = aei + bfg + cdh - ceg - bdi - afh$$

Exemple avec $A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & -1 & 2 \\ 0 & 1 & 4 \end{pmatrix}$.

- Par cofacteurs (ligne 1) : $1 \times \begin{vmatrix} -1 & 2 \\ 1 & 4 \end{vmatrix} - 2 \times \begin{vmatrix} 3 & 2 \\ 0 & 4 \end{vmatrix} + 0 = 1 \times (-6) - 2 \times 12 = -30$.
- Par Sarrus : $(-4) + 0 + 0 - 0 - 24 - 2 = -30$. Même résultat.

### Un exemple 4 × 4

Sarrus ne marche plus : seuls les cofacteurs fonctionnent. Avec

$$B = \begin{pmatrix} 2 & 0 & 1 & 0 \\ 1 & 3 & 0 & 0 \\ 0 & 1 & 2 & 1 \\ 0 & 0 & 1 & 2 \end{pmatrix}$$

la 1re ligne a deux zéros : seuls $a_{11} = 2$ (signe $+$) et $a_{13} = 1$ (signe $+$) comptent.

$$\det(B) = 2 \begin{vmatrix} 3 & 0 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{vmatrix} + 1 \begin{vmatrix} 1 & 3 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 2 \end{vmatrix} = 2 \times 9 + 1 \times 2 = 20$$

Les mineurs $3 \times 3$ se calculent à leur tour par cofacteurs ou par Sarrus : la méthode est **récursive**. Vérification par la 4e colonne (signes $-$ puis $+$ pour les lignes 3 et 4) : $-1 \times 6 + 2 \times 13 = 20$.

## 3. Propriétés utiles

- **Matrice triangulaire ou diagonale** : le déterminant est le **produit des coefficients de la diagonale**. Exemple : $\det \begin{pmatrix} 4 & 1 & -2 \\ 0 & -1 & 7 \\ 0 & 0 & 2 \end{pmatrix} = 4 \times (-1) \times 2 = -8$.
- **Échanger deux lignes** change le signe du déterminant.
- **Ajouter à une ligne un multiple d'une autre** ne change pas le déterminant (c'est ce qu'on fait pendant le pivot de Gauss).
- $\det(AB) = \det(A) \times \det(B)$ et $\det(A^T) = \det(A)$.

## 4. Déterminant et inversibilité

> [!tip] Le résultat clé (admis)
> Une matrice carrée $A$ est **inversible** si et seulement si $\det(A) \neq 0$.

- $\det(A) = 0$ : les colonnes de $A$ sont **liées** (chapitre « Espaces vectoriels »). La matrice **écrase** l'espace dans une dimension plus petite (le plan sur une droite, par exemple) : on ne peut pas revenir en arrière.
- $\det(A) \neq 0$ : les colonnes forment une **base**, la transformation est réversible.

```anim
vecteurs
titre: Des colonnes liées écrasent le plan
consigne: u = (1, 2) et v = (2, 4) sont les colonnes d'une matrice de déterminant 1 × 4 − 2 × 2 = 0. Bouge a et b : le résultat reste toujours sur la même droite, la matrice écrase le plan. Déplace v hors de cette droite : le déterminant devient non nul et tout le plan est atteint.
ux: 1
uy: 2
vx: 2
vy: 4
a: 1
b: 1
```

> [!tip] Lien avec la data
> Des colonnes redondantes dans un jeu de données (multicolinéarité) donnent un déterminant **proche de 0** : signe classique d'instabilité numérique dans une régression.

## 5. La matrice inverse

L'**inverse** $A^{-1}$ est l'unique matrice telle que $A A^{-1} = A^{-1} A = I$. Elle existe seulement si $\det(A) \neq 0$.

Formule directe en $2 \times 2$ (admise) : on **échange** les deux coefficients de la diagonale, on **change le signe** des deux autres, et on divise par le déterminant.

$$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \quad \Longrightarrow \quad A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

Exemple : $A = \begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix}$, $\det(A) = 5$, donc $A^{-1} = \dfrac{1}{5} \begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix}$.

> [!tip] Vérifier
> Multiplie $A$ par ton $A^{-1}$ : tu dois retrouver $I$. Ici $\begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix} = \begin{pmatrix} 5 & 0 \\ 0 & 5 \end{pmatrix} = 5\, I$, donc $A \times \frac{1}{5}\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix} = I$.

## 6. Systèmes linéaires

Un système linéaire s'écrit sous forme matricielle $A\vec x = \vec b$ :

$$\begin{cases} x + 3y = 7 \\ 2x - y = 0 \end{cases} \quad \Longleftrightarrow \quad \begin{pmatrix} 1 & 3 \\ 2 & -1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 7 \\ 0 \end{pmatrix}$$

Deux méthodes au programme : le **pivot de Gauss** et la **règle de Cramer**.

### Le pivot de Gauss

On combine les lignes ($L_2 \leftarrow L_2 - 2L_1$, etc.) pour faire apparaître des zéros sous la diagonale, jusqu'à un système **triangulaire**. Puis on résout **de bas en haut** (la remontée).

Exemple :

$$\begin{cases} x + y + 2z = 5 \\ 2x + 3y - z = 7 \\ x - y + 3z = 2 \end{cases}$$

1. $L_2 \leftarrow L_2 - 2L_1$ et $L_3 \leftarrow L_3 - L_1$ : on obtient $y - 5z = -3$ et $-2y + z = -3$.
2. $L_3 \leftarrow L_3 + 2L_2$ : on obtient $-9z = -9$.
3. Remontée : $z = 1$, puis $y = -3 + 5z = 2$, puis $x = 5 - y - 2z = 1$.

Solution unique : $(x, y, z) = (1, 2, 1)$. On vérifie dans les trois équations de départ.

### Quand une ligne disparaît

$$\begin{cases} x + y - z = 2 \\ 3x + 3y - 3z = 6 \\ x + 2y + z = 5 \end{cases}$$

$L_2 \leftarrow L_2 - 3L_1$ donne $0 = 0$ : la 2e équation était **trois fois la 1re**, elle n'apportait rien. $L_3 \leftarrow L_3 - L_1$ donne $y + 2z = 3$.

Il reste 2 équations pour 3 inconnues. On pose $z = t$ (un **paramètre libre**) : $y = 3 - 2t$ et $x = 2 - y + z = -1 + 3t$. Il y a une **infinité de solutions**, une pour chaque valeur de $t$.

Si au contraire une ligne devient $0 = c$ avec $c \neq 0$ (par exemple $x + 2y = 3$ et $2x + 4y = 7$ donnent $0 = 1$), c'est une **contradiction** : **aucune solution**.

| Fin du pivot | Conclusion |
|---|---|
| Système triangulaire complet | Une seule solution |
| Une ligne devient $0 = 0$ | Infinité de solutions (paramètre libre) |
| Une ligne devient $0 = c$, $c \neq 0$ | Aucune solution |

> [!tip] Lien avec la data
> Aucune solution : des contraintes **incompatibles** (deux règles métier contradictoires). Infinité de solutions : une **redondance**, exactement une famille liée.

### La règle de Cramer (cas 2 × 2, admise)

Pour le système $\begin{cases} ax + by = e \\ cx + dy = f \end{cases}$ avec $\Delta = \begin{vmatrix} a & b \\ c & d \end{vmatrix} \neq 0$ :

$$x = \frac{\Delta_x}{\Delta} \qquad y = \frac{\Delta_y}{\Delta} \qquad \text{avec } \Delta_x = \begin{vmatrix} e & b \\ f & d \end{vmatrix},\ \Delta_y = \begin{vmatrix} a & e \\ c & f \end{vmatrix}$$

$\Delta_x$ : on remplace la **colonne de $x$** par le second membre ; $\Delta_y$ : la **colonne de $y$**.

Exemple, avec le système $x + 3y = 7$, $2x - y = 0$ :

$$\Delta = \begin{vmatrix} 1 & 3 \\ 2 & -1 \end{vmatrix} = -7 \qquad \Delta_x = \begin{vmatrix} 7 & 3 \\ 0 & -1 \end{vmatrix} = -7 \qquad \Delta_y = \begin{vmatrix} 1 & 7 \\ 2 & 0 \end{vmatrix} = -14$$

donc $x = 1$ et $y = 2$. La même idée marche en $3 \times 3$, avec des déterminants $3 \times 3$.

### Pivot ou Cramer ?

- **Cramer** : rapide pour 2 ou 3 inconnues, mais il faut calculer beaucoup de déterminants dès que le système grandit. Et il ne marche que si $\Delta \neq 0$.
- **Pivot de Gauss** : marche pour **toutes les tailles**, et c'est lui qui dit si on est dans le cas « infinité » ou « aucune solution ». C'est la méthode utilisée par les bibliothèques de calcul.

## À retenir

- $\det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$ ; au-delà, développement par cofacteurs (Sarrus en $3 \times 3$ seulement).
- $\det(A) \neq 0 \iff A$ inversible $\iff$ colonnes libres.
- Inverse $2 \times 2$ : échanger la diagonale, changer le signe du reste, diviser par $\det$.
- Pivot : triangulariser puis remonter ; trois issues (une, une infinité, aucune solution).
- Cramer : $x = \Delta_x / \Delta$, pratique en petite dimension.

> [!warning] Pièges
> - Les signes du damier : le cofacteur de $a_{12}$ a un signe $-$.
> - Sarrus ne s'applique **pas** aux matrices $4 \times 4$.
> - Pas d'inverse si $\det = 0$ : la formule diviserait par zéro.
> - Une ligne $0 = 0$ ne veut pas dire « aucune solution » : c'est une **infinité**. Seul $0 = c$ avec $c \neq 0$ est impossible.
