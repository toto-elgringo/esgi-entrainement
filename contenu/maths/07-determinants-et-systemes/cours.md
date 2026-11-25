# Déterminants et systèmes linéaires

> [!info] Pourquoi ce chapitre ?
> Le **déterminant** est un seul nombre qui dit si une matrice carrée est « réversible » (inversible) ou si elle écrase l'espace. Il sert ensuite à résoudre des **systèmes linéaires**, ce que font en permanence les bibliothèques de calcul (NumPy, régression linéaire…).

## 1. Le déterminant d'une matrice 2 × 2

$$\det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$$

On multiplie la diagonale « descendante », on retire le produit de l'autre diagonale.

Exemple : $\det \begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix} = 4 \times 2 - 3 \times 1 = 5$.

> [!info] Notation
> On écrit aussi le déterminant avec des barres droites : $\begin{vmatrix} 4 & 3 \\ 1 & 2 \end{vmatrix} = 5$.

**Exemple résolu, avec des nombres négatifs :** $\det \begin{pmatrix} -2 & 5 \\ 3 & -4 \end{pmatrix}$.

1. On repère les lettres : $a = -2$, $b = 5$ (en haut), $c = 3$, $d = -4$ (en bas).
2. Diagonale descendante : $ad = (-2) \times (-4) = 8$ (moins par moins donne plus).
3. Autre diagonale : $bc = 5 \times 3 = 15$.
4. On **soustrait** : $ad - bc = 8 - 15 = -7$.

Un déterminant peut être négatif, positif ou nul. Exemple nul : $\det \begin{pmatrix} 3 & -6 \\ -2 & 4 \end{pmatrix} = 3 \times 4 - (-6) \times (-2) = 12 - 12 = 0$.

**À retenir :** $ad - bc$, avec des parenthèses autour des nombres négatifs ; on soustrait toujours le second produit, on ne l'ajoute jamais.

## 2. En dimension plus grande : les cofacteurs

Pour une matrice $A = (a_{ij})$ de taille $n \times n$ :

- le **mineur** $M_{ij}$ est le déterminant de la matrice $(n-1) \times (n-1)$ obtenue en **barrant la ligne $i$ et la colonne $j$** ;
- le **cofacteur** est $C_{ij} = (-1)^{i+j} M_{ij}$ : le mineur, avec un signe.

Les signes $(-1)^{i+j}$ forment un damier qui commence par $+$ en haut à gauche :

$$\begin{pmatrix} + & - & + & - \\ - & + & - & + \\ + & - & + & - \\ - & + & - & + \end{pmatrix}$$

Pour trouver le signe d'une case sans dessiner le damier : on additionne les numéros de ligne et de colonne. Somme **paire** : signe $+$ ; somme **impaire** : signe $-$. Par exemple, la case $(3, 2)$ donne $3 + 2 = 5$, impair, signe $-$.

**Exemple résolu :** avec $A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & -1 & 2 \\ 0 & 1 & 4 \end{pmatrix}$, calculons $M_{21}$ et $C_{21}$.

1. On barre la ligne 2 $(3, -1, 2)$ et la colonne 1 $(1, 3, 0)$.
2. Il reste les nombres qui ne sont ni sur cette ligne ni sur cette colonne : $\begin{pmatrix} 2 & 0 \\ 1 & 4 \end{pmatrix}$.
3. Mineur : $M_{21} = 2 \times 4 - 0 \times 1 = 8$.
4. Signe : $2 + 1 = 3$, impair, donc $-$. Cofacteur : $C_{21} = -8$.

**À retenir :** mineur = barrer puis calculer un déterminant plus petit ; cofacteur = le mineur avec le signe du damier.

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

**Le même calcul, pas à pas.**

Par cofacteurs selon la ligne 1 $(1, 2, 0)$ :

| Case | Coefficient | Signe | Mineur (on barre la ligne 1 et la colonne $j$) | Terme |
|---|---|---|---|---|
| (1, 1) | $1$ | $+$ | $(-1) \times 4 - 2 \times 1 = -6$ | $+1 \times (-6) = -6$ |
| (1, 2) | $2$ | $-$ | $3 \times 4 - 2 \times 0 = 12$ | $-2 \times 12 = -24$ |
| (1, 3) | $0$ | $+$ | inutile, multiplié par 0 | $0$ |

Total : $-6 - 24 + 0 = -30$.

Par Sarrus, avec $a = 1$, $b = 2$, $c = 0$, $d = 3$, $e = -1$, $f = 2$, $g = 0$, $h = 1$, $i = 4$ :

| Produit | Calcul | Valeur | Compté avec |
|---|---|---|---|
| $aei$ | $1 \times (-1) \times 4$ | $-4$ | $+$ |
| $bfg$ | $2 \times 2 \times 0$ | $0$ | $+$ |
| $cdh$ | $0 \times 3 \times 1$ | $0$ | $+$ |
| $ceg$ | $0 \times (-1) \times 0$ | $0$ | $-$ |
| $bdi$ | $2 \times 3 \times 4$ | $24$ | $-$ |
| $afh$ | $1 \times 2 \times 1$ | $2$ | $-$ |

$\det = (-4) + 0 + 0 - 0 - 24 - 2 = -30$.

On peut aussi développer selon la **colonne 1** $(1, 3, 0)$, signes $+, -, +$ : $1 \times M_{11} - 3 \times M_{21} + 0 = 1 \times (-6) - 3 \times 8 = -30$ (on a calculé $M_{21} = 8$ plus haut). Toujours le même résultat.

**À retenir :** cofacteurs = coefficient × signe × mineur, pour chaque case de la ligne choisie ; Sarrus = trois produits comptés $+$, trois comptés $-$. Fais les deux pour te vérifier.

### Un exemple 4 × 4

Sarrus ne marche plus : seuls les cofacteurs fonctionnent. Avec

$$B = \begin{pmatrix} 2 & 0 & 1 & 0 \\ 1 & 3 & 0 & 0 \\ 0 & 1 & 2 & 1 \\ 0 & 0 & 1 & 2 \end{pmatrix}$$

la 1re ligne a deux zéros : seuls $a_{11} = 2$ (signe $+$) et $a_{13} = 1$ (signe $+$) comptent.

$$\det(B) = 2 \begin{vmatrix} 3 & 0 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{vmatrix} + 1 \begin{vmatrix} 1 & 3 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 2 \end{vmatrix} = 2 \times 9 + 1 \times 2 = 20$$

Les mineurs $3 \times 3$ se calculent à leur tour par cofacteurs ou par Sarrus : la méthode est **récursive**. Vérification par la 4e colonne (signes $-$ puis $+$ pour les lignes 3 et 4) : $-1 \times 6 + 2 \times 13 = 20$.

**Le détail des deux mineurs :**

1. $M_{11}$ : on barre la ligne 1 et la colonne 1. On garde les lignes 2, 3, 4 et les colonnes 2, 3, 4 : $\begin{pmatrix} 3 & 0 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{pmatrix}$. Sa 1re ligne a deux zéros : $3 \times \begin{vmatrix} 2 & 1 \\ 1 & 2 \end{vmatrix} = 3 \times (4 - 1) = 9$.
2. $M_{13}$ : on barre la ligne 1 et la colonne 3. On garde les lignes 2, 3, 4 et les colonnes **1, 2 et 4** (on saute la 3e). Ligne 2 $(1, 3, 0, 0)$ devient $(1, 3, 0)$ ; ligne 3 $(0, 1, 2, 1)$ devient $(0, 1, 1)$ ; ligne 4 $(0, 0, 1, 2)$ devient $(0, 0, 2)$. Cette matrice est triangulaire (voir plus bas) : $1 \times 1 \times 2 = 2$.
3. On assemble avec les signes : $(+2) \times 9 + (+1) \times 2 = 20$.

Attention : à l'intérieur d'un mineur, on utilise **son propre** damier de signes, qui recommence à $+$ en haut à gauche.

**À retenir :** en $4 \times 4$, choisis la ligne la plus pleine de zéros, barre soigneusement (note les colonnes gardées), et calcule chaque mineur $3 \times 3$ comme d'habitude.

## 3. Propriétés utiles

- **Matrice triangulaire ou diagonale** : le déterminant est le **produit des coefficients de la diagonale**. Exemple : $\det \begin{pmatrix} 4 & 1 & -2 \\ 0 & -1 & 7 \\ 0 & 0 & 2 \end{pmatrix} = 4 \times (-1) \times 2 = -8$.
- **Échanger deux lignes** change le signe du déterminant.
- **Ajouter à une ligne un multiple d'une autre** ne change pas le déterminant (c'est ce qu'on fait pendant le pivot de Gauss).
- $\det(AB) = \det(A) \times \det(B)$ et $\det(A^T) = \det(A)$.

Une matrice est **triangulaire** si tous les nombres d'un même côté de la diagonale sont nuls : **en dessous** (triangulaire supérieure, comme l'exemple ci-dessus) ou **au-dessus** (triangulaire inférieure). Dans les deux cas, la règle est la même.

**Exemple résolu (triangulaire inférieure) :** $\det \begin{pmatrix} 2 & 0 & 0 \\ 7 & -3 & 0 \\ 1 & 5 & 4 \end{pmatrix}$.

1. Au-dessus de la diagonale : $0, 0, 0$. La matrice est triangulaire.
2. Diagonale : $2$, $-3$, $4$.
3. $\det = 2 \times (-3) \times 4 = -24$. Les nombres sous la diagonale ($7$, $1$, $5$) ne servent à rien.

Pourquoi ? En développant selon la 1re ligne, seul le $2$ compte (les autres sont des 0), et le mineur restant est encore triangulaire : on recommence, et il ne reste que les produits de la diagonale.

**Exemple résolu (les autres propriétés) :** $A = \begin{pmatrix} 1 & 2 \\ 0 & 3 \end{pmatrix}$ et $B = \begin{pmatrix} 2 & 0 \\ 1 & 1 \end{pmatrix}$.

| Calcul | Résultat | Propriété vérifiée |
|---|---|---|
| $\det(A) = 3 - 0$ | $3$ | |
| $\det(B) = 2 - 0$ | $2$ | |
| $AB = \begin{pmatrix} 4 & 2 \\ 3 & 3 \end{pmatrix}$, $\det(AB) = 12 - 6$ | $6$ | $6 = 3 \times 2$ : produit, pas somme |
| $A^T = \begin{pmatrix} 1 & 0 \\ 2 & 3 \end{pmatrix}$, $\det(A^T) = 3 - 0$ | $3$ | même déterminant que $A$ |
| lignes de $A$ échangées : $\begin{pmatrix} 0 & 3 \\ 1 & 2 \end{pmatrix}$, $0 - 3$ | $-3$ | le signe change |

**À retenir :** triangulaire (zéros d'un côté) = produit de la diagonale ; $\det(AB)$ = **produit** des déterminants ; transposer ne change rien ; échanger deux lignes change le signe.

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

En $2 \times 2$, « colonnes liées » veut dire : une colonne est un multiple de l'autre.

**Exemple résolu :** $\begin{pmatrix} 3 & -6 \\ -2 & 4 \end{pmatrix}$ a un déterminant nul (calculé plus haut). Ses colonnes sont $(3, -2)$ et $(-6, 4)$. On cherche le nombre qui transforme la 1re en la 2e : $3 \times (-2) = -6$ et $(-2) \times (-2) = 4$. Donc $(-6, 4) = -2 \times (3, -2)$ : les colonnes sont liées, la matrice n'est pas inversible. Le fait que la matrice contienne des négatifs, des 1 ou de grands nombres ne dit rien : seul le déterminant compte.

**Exemple résolu avec un paramètre :** pour quelle valeur de $k$ la matrice $\begin{pmatrix} k & 4 \\ 1 & 2 \end{pmatrix}$ n'est-elle pas inversible ?

1. On calcule le déterminant en fonction de $k$ : $k \times 2 - 4 \times 1 = 2k - 4$.
2. Pas inversible quand il est nul : $2k - 4 = 0$, donc $2k = 4$, donc $k = 2$.
3. Vérification : avec $k = 2$, les colonnes sont $(2, 1)$ et $(4, 2) = 2 \times (2, 1)$, bien liées.

**À retenir :** pour savoir si une matrice est inversible, calcule son déterminant : $0$ = pas inversible (colonnes liées), autre chose = inversible.

> [!tip] Lien avec la data
> Des colonnes redondantes dans un jeu de données (multicolinéarité) donnent un déterminant **proche de 0** : signe classique d'instabilité numérique dans une régression.

## 5. La matrice inverse

L'**inverse** $A^{-1}$ est l'unique matrice telle que $A A^{-1} = A^{-1} A = I$. Elle existe seulement si $\det(A) \neq 0$.

Formule directe en $2 \times 2$ (admise) : on **échange** les deux coefficients de la diagonale, on **change le signe** des deux autres, et on divise par le déterminant.

$$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \quad \Longrightarrow \quad A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$

Exemple : $A = \begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix}$, $\det(A) = 5$, donc $A^{-1} = \dfrac{1}{5} \begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix}$.

**Le même exemple, pas à pas :**

1. Déterminant : $4 \times 2 - 3 \times 1 = 5$. Il n'est pas nul, l'inverse existe.
2. On échange les deux nombres de la diagonale : le $4$ et le $2$ changent de place, $\begin{pmatrix} 2 & \cdot \\ \cdot & 4 \end{pmatrix}$.
3. On change le signe des deux autres, **sans les déplacer** : $3$ devient $-3$ et $1$ devient $-1$, $\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix}$.
4. On divise **chaque** case par le déterminant 5 : $A^{-1} = \begin{pmatrix} 2/5 & -3/5 \\ -1/5 & 4/5 \end{pmatrix}$, soit `(2/5, -3/5, -1/5, 4/5)` ligne par ligne.

> [!tip] Vérifier
> Multiplie $A$ par ton $A^{-1}$ : tu dois retrouver $I$. Ici $\begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix} = \begin{pmatrix} 5 & 0 \\ 0 & 5 \end{pmatrix} = 5\, I$, donc $A \times \frac{1}{5}\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix} = I$.

Erreurs fréquentes : oublier d'échanger la diagonale, changer aussi le signe de la diagonale, ou oublier de diviser par le déterminant (sauf s'il vaut 1, où diviser ne change rien).

**À retenir :** inverse $2 \times 2$ = échanger la diagonale, changer le signe des deux autres, diviser chaque case par $\det$ ; puis vérifier que $AA^{-1} = I$.

### Résoudre un système avec l'inverse

Si $A$ est inversible, le système $A\vec x = \vec b$ a **une seule** solution : $\vec x = A^{-1}\vec b$. On l'obtient en multipliant les deux côtés **à gauche** par $A^{-1}$ : $A^{-1}A\vec x = A^{-1}\vec b$, et $A^{-1}A = I$, donc $\vec x = A^{-1}\vec b$.

**Exemple résolu :** $4x + 3y = 10$ et $x + 2y = 5$, soit $A\vec x = \vec b$ avec $A = \begin{pmatrix} 4 & 3 \\ 1 & 2 \end{pmatrix}$ et $\vec b = \begin{pmatrix} 10 \\ 5 \end{pmatrix}$.

1. $A^{-1} = \frac{1}{5}\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix}$ (calculée ci-dessus).
2. $\begin{pmatrix} 2 & -3 \\ -1 & 4 \end{pmatrix}\begin{pmatrix} 10 \\ 5 \end{pmatrix}$ : ligne 1 donne $20 - 15 = 5$, ligne 2 donne $-10 + 20 = 10$.
3. On divise par 5 : $\vec x = (1, 2)$, donc $x = 1$ et $y = 2$.
4. Vérification : $4 + 6 = 10$ et $1 + 4 = 5$.

**À retenir :** $A\vec x = \vec b$ donne $\vec x = A^{-1}\vec b$, avec $A^{-1}$ **à gauche** de $\vec b$.

## 6. Systèmes linéaires

Un système linéaire s'écrit sous forme matricielle $A\vec x = \vec b$ :

$$\begin{cases} x + 3y = 7 \\ 2x - y = 0 \end{cases} \quad \Longleftrightarrow \quad \begin{pmatrix} 1 & 3 \\ 2 & -1 \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 7 \\ 0 \end{pmatrix}$$

La matrice $A$ contient les coefficients des inconnues (une ligne par équation, une colonne par inconnue), et $\vec b$ le **second membre** (les nombres à droite du $=$).

Deux méthodes au programme : le **pivot de Gauss** et la **règle de Cramer**.

### Le pivot de Gauss

On combine les lignes ($L_2 \leftarrow L_2 - 2L_1$, etc.) pour faire apparaître des zéros sous la diagonale, jusqu'à un système **triangulaire**. Puis on résout **de bas en haut** (la remontée).

$L_2 \leftarrow L_2 - 2L_1$ veut dire : on remplace la ligne 2 par « ligne 2 moins 2 fois la ligne 1 », en faisant l'opération sur **chaque** terme, **second membre compris**. Le multiplicateur se choisit pour faire disparaître une inconnue : si $L_1$ commence par $1x$ et $L_2$ par $2x$, on retire $\frac{2}{1} = 2$ fois $L_1$.

Exemple :

$$\begin{cases} x + y + 2z = 5 \\ 2x + 3y - z = 7 \\ x - y + 3z = 2 \end{cases}$$

1. $L_2 \leftarrow L_2 - 2L_1$ et $L_3 \leftarrow L_3 - L_1$ : on obtient $y - 5z = -3$ et $-2y + z = -3$.
2. $L_3 \leftarrow L_3 + 2L_2$ : on obtient $-9z = -9$.
3. Remontée : $z = 1$, puis $y = -3 + 5z = 2$, puis $x = 5 - y - 2z = 1$.

Solution unique : $(x, y, z) = (1, 2, 1)$. On vérifie dans les trois équations de départ.

**Le même calcul, terme par terme :**

| Opération | $x$ | $y$ | $z$ | Second membre | Nouvelle ligne |
|---|---|---|---|---|---|
| $L_2 - 2L_1$ | $2 - 2 = 0$ | $3 - 2 = 1$ | $-1 - 4 = -5$ | $7 - 10 = -3$ | $y - 5z = -3$ |
| $L_3 - L_1$ | $1 - 1 = 0$ | $-1 - 1 = -2$ | $3 - 2 = 1$ | $2 - 5 = -3$ | $-2y + z = -3$ |
| $L_3 + 2L_2$ (nouvelles lignes) | $0$ | $-2 + 2 = 0$ | $1 - 10 = -9$ | $-3 - 6 = -9$ | $-9z = -9$ |

Remontée : la dernière ligne donne $z = \frac{-9}{-9} = 1$ ; on remplace dans $y - 5z = -3$ : $y - 5 = -3$, donc $y = 2$ ; on remplace dans $L_1$ : $x + 2 + 2 = 5$, donc $x = 1$. Vérification : $2 + 6 - 1 = 7$ et $1 - 2 + 3 = 2$.

**À retenir :** une opération de pivot s'applique à **tous** les termes de la ligne, second membre compris ; on fait des zéros colonne par colonne, puis on remonte de $z$ vers $x$.

### Quand une ligne disparaît

$$\begin{cases} x + y - z = 2 \\ 3x + 3y - 3z = 6 \\ x + 2y + z = 5 \end{cases}$$

$L_2 \leftarrow L_2 - 3L_1$ donne $0 = 0$ : la 2e équation était **trois fois la 1re**, elle n'apportait rien. $L_3 \leftarrow L_3 - L_1$ donne $y + 2z = 3$.

Il reste 2 équations pour 3 inconnues. On pose $z = t$ (un **paramètre libre**) : $y = 3 - 2t$ et $x = 2 - y + z = -1 + 3t$. Il y a une **infinité de solutions**, une pour chaque valeur de $t$.

**Le détail :**

1. $L_2 - 3L_1$ : $3 - 3 = 0$, $3 - 3 = 0$, $-3 - (-3) = 0$ et $6 - 3 \times 2 = 0$. Tout s'annule, même le second membre : $0 = 0$.
2. $L_3 - L_1$ : $1 - 1 = 0$, $2 - 1 = 1$, $1 - (-1) = 2$ et $5 - 2 = 3$, soit $y + 2z = 3$.
3. On pose $z = t$ ; alors $y = 3 - 2z = 3 - 2t$.
4. Dans $L_1$ : $x = 2 - y + z = 2 - (3 - 2t) + t = 2 - 3 + 2t + t = -1 + 3t$. Attention aux parenthèses : $-(3 - 2t) = -3 + 2t$.
5. Une solution par valeur de $t$ : $t = 0$ donne $(-1, 3, 0)$, $t = 1$ donne $(2, 1, 1)$. Vérification de $(2, 1, 1)$ : $2 + 1 - 1 = 2$ et $2 + 2 + 1 = 5$.

Si au contraire une ligne devient $0 = c$ avec $c \neq 0$ (par exemple $x + 2y = 3$ et $2x + 4y = 7$ donnent $0 = 1$), c'est une **contradiction** : **aucune solution**.

| Fin du pivot | Conclusion |
|---|---|
| Système triangulaire complet | Une seule solution |
| Une ligne devient $0 = 0$ | Infinité de solutions (paramètre libre) |
| Une ligne devient $0 = c$, $c \neq 0$ | Aucune solution |

**Exemple résolu, les trois cas en $2 \times 2$** (on garde $L_1 : x + 2y = 3$ et on change $L_2$) :

| $L_2$ | Opération | Résultat | Conclusion |
|---|---|---|---|
| $x - y = 0$ | $L_2 - L_1$ | $-3y = -3$, donc $y = 1$, puis $x = 1$ | une seule solution |
| $2x + 4y = 6$ | $L_2 - 2L_1$ | $0 = 6 - 6 = 0$ | infinité ($y = t$, $x = 3 - 2t$) |
| $2x + 4y = 7$ | $L_2 - 2L_1$ | $0 = 7 - 6 = 1$ | aucune solution |

Astuce : si la partie gauche de $L_2$ est un multiple de celle de $L_1$, regarde le second membre. Même multiple : $0 = 0$, une infinité. Multiple différent : $0 = c$, aucune.

**À retenir :** $0 = 0$ = une équation en trop, donc une infinité ; $0 = c$ avec $c \neq 0$ = contradiction, donc aucune.

> [!tip] Lien avec la data
> Aucune solution : des contraintes **incompatibles** (deux règles métier contradictoires). Infinité de solutions : une **redondance**, exactement une famille liée.

### Déterminant nul et systèmes

Si $\det(A) \neq 0$, le système $A\vec x = \vec b$ a toujours **une seule** solution, quel que soit $\vec b$ (c'est $A^{-1}\vec b$).

Si $\det(A) = 0$, il n'y a **jamais** une solution unique : le pivot finit forcément par une ligne $0 = \dots$, et c'est le second membre $\vec b$ qui décide.

**Exemple résolu :** $A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$, $\det(A) = 4 - 4 = 0$.

- Avec $\vec b = (3, 6)$ : $L_2 - 2L_1$ donne $0 = 6 - 6 = 0$, une infinité de solutions.
- Avec $\vec b = (3, 7)$ : $L_2 - 2L_1$ donne $0 = 7 - 6 = 1$, aucune solution.

Un système linéaire n'a **jamais exactement deux** solutions : si $\vec x_1$ et $\vec x_2$ sont deux solutions différentes, tous les points $\vec x_1 + t(\vec x_2 - \vec x_1)$ en sont aussi, car $A(\vec x_1 + t(\vec x_2 - \vec x_1)) = \vec b + t(\vec b - \vec b) = \vec b$.

**À retenir :** $\det \neq 0$ = une seule solution ; $\det = 0$ = aucune ou une infinité, selon le second membre ; jamais deux.

### La règle de Cramer (cas 2 × 2, admise)

Pour le système $\begin{cases} ax + by = e \\ cx + dy = f \end{cases}$ avec $\Delta = \begin{vmatrix} a & b \\ c & d \end{vmatrix} \neq 0$ :

$$x = \frac{\Delta_x}{\Delta} \qquad y = \frac{\Delta_y}{\Delta} \qquad \text{avec } \Delta_x = \begin{vmatrix} e & b \\ f & d \end{vmatrix},\ \Delta_y = \begin{vmatrix} a & e \\ c & f \end{vmatrix}$$

$\Delta_x$ : on remplace la **colonne de $x$** par le second membre ; $\Delta_y$ : la **colonne de $y$**.

Exemple, avec le système $x + 3y = 7$, $2x - y = 0$ :

$$\Delta = \begin{vmatrix} 1 & 3 \\ 2 & -1 \end{vmatrix} = -7 \qquad \Delta_x = \begin{vmatrix} 7 & 3 \\ 0 & -1 \end{vmatrix} = -7 \qquad \Delta_y = \begin{vmatrix} 1 & 7 \\ 2 & 0 \end{vmatrix} = -14$$

donc $x = 1$ et $y = 2$. La même idée marche en $3 \times 3$, avec des déterminants $3 \times 3$.

**Le même exemple, pas à pas :**

1. $\Delta$ : les coefficients de $x$ (colonne 1 : $1$ et $2$) et de $y$ (colonne 2 : $3$ et $-1$). $\Delta = 1 \times (-1) - 3 \times 2 = -1 - 6 = -7$. Il n'est pas nul, Cramer s'applique.
2. $\Delta_x$ : on remplace la colonne 1 (celle de $x$) par le second membre $(7, 0)$ et on garde la colonne de $y$ : $\begin{vmatrix} 7 & 3 \\ 0 & -1 \end{vmatrix} = 7 \times (-1) - 3 \times 0 = -7$.
3. $\Delta_y$ : on garde la colonne de $x$ et on remplace la colonne 2 par $(7, 0)$ : $\begin{vmatrix} 1 & 7 \\ 2 & 0 \end{vmatrix} = 1 \times 0 - 7 \times 2 = -14$.
4. $x = \frac{-7}{-7} = 1$ et $y = \frac{-14}{-7} = 2$.
5. Vérification : $1 + 3 \times 2 = 7$ et $2 \times 1 - 2 = 0$.

**À retenir :** $\Delta_x$ = colonne de $x$ remplacée par le second membre, $\Delta_y$ = colonne de $y$ remplacée ; puis on divise chacun par $\Delta$.

### Pivot ou Cramer ?

- **Cramer** : rapide pour 2 ou 3 inconnues, mais il faut calculer beaucoup de déterminants dès que le système grandit. Et il ne marche que si $\Delta \neq 0$.
- **Pivot de Gauss** : marche pour **toutes les tailles**, et c'est lui qui dit si on est dans le cas « infinité » ou « aucune solution ». C'est la méthode utilisée par les bibliothèques de calcul.

Pour $n$ inconnues, Cramer demande $n + 1$ déterminants de taille $n \times n$, et chacun, calculé par cofacteurs, demande lui-même un nombre de calculs qui explose avec $n$. Le pivot, lui, se contente de combiner des lignes.

## À retenir

- $\det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$ ; au-delà, développement par cofacteurs (Sarrus en $3 \times 3$ seulement).
- Triangulaire : produit de la diagonale ; $\det(AB) = \det(A)\det(B)$ ; $\det(A^T) = \det(A)$ ; échange de lignes = changement de signe.
- $\det(A) \neq 0 \iff A$ inversible $\iff$ colonnes libres.
- Inverse $2 \times 2$ : échanger la diagonale, changer le signe du reste, diviser par $\det$. Puis $\vec x = A^{-1}\vec b$.
- Pivot : triangulariser puis remonter ; trois issues (une, une infinité, aucune solution).
- Cramer : $x = \Delta_x / \Delta$, pratique en petite dimension.

> [!warning] Pièges
> - Les signes du damier : le cofacteur de $a_{12}$ a un signe $-$.
> - Sarrus ne s'applique **pas** aux matrices $4 \times 4$.
> - Pas d'inverse si $\det = 0$ : la formule diviserait par zéro.
> - Une ligne $0 = 0$ ne veut pas dire « aucune solution » : c'est une **infinité**. Seul $0 = c$ avec $c \neq 0$ est impossible.
