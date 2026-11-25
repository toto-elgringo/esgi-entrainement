# Espaces vectoriels

> [!info] Pourquoi ce chapitre ?
> Une ligne d'un jeu de données à $n$ colonnes numériques, c'est un **vecteur** de $\mathbb{R}^n$. Ce chapitre donne le vocabulaire de l'algèbre linéaire (combinaison linéaire, famille libre, base, dimension) qui sert ensuite pour la régression et la **PCA** (réduction de dimension).

## 1. Les vecteurs de $\mathbb{R}^n$

Un **vecteur** de $\mathbb{R}^n$ est une liste ordonnée de $n$ nombres réels :

$$u = (u_1, u_2, \dots, u_n)$$

Les nombres $u_1, \dots, u_n$ sont les **coordonnées** du vecteur. L'ordre compte : $(1, 2) \neq (2, 1)$.

Deux opérations de base, faites **coordonnée par coordonnée** :

- **Addition** : $u + v = (u_1 + v_1, \dots, u_n + v_n)$
- **Multiplication par un scalaire** (un nombre réel $\lambda$, lu « lambda ») : $\lambda u = (\lambda u_1, \dots, \lambda u_n)$

On n'additionne que deux vecteurs qui ont le **même nombre** de coordonnées, et le résultat garde ce nombre de coordonnées : la somme de deux vecteurs de $\mathbb{R}^3$ est encore un vecteur de $\mathbb{R}^3$.

Exemple avec $u = (1, 2, -1)$ et $v = (0, 1, 3)$ :

$$2u - v = (2, 4, -2) - (0, 1, 3) = (2, 3, -5)$$

**Le même exemple, pas à pas.** On traite chaque coordonnée à part, dans une ligne du tableau :

| Coordonnée | Calcul de $2u$ | On retire $v$ | Résultat |
|---|---|---|---|
| 1re | $2 \times 1 = 2$ | $2 - 0 = 2$ | $2$ |
| 2e | $2 \times 2 = 4$ | $4 - 1 = 3$ | $3$ |
| 3e | $2 \times (-1) = -2$ | $-2 - 3 = -5$ | $-5$ |

Donc $2u - v = (2, 3, -5)$. On fait d'abord la multiplication ($2u$), **puis** la soustraction, comme avec des nombres.

Erreurs classiques :

- **ajouter** 2 au lieu de **multiplier** par 2 : $2u$ n'est pas $(1 + 2, 2 + 2, -1 + 2)$ ;
- perdre un signe : $2 \times (-1) = -2$, et retirer un nombre négatif revient à l'ajouter ($5 - (-3) = 5 + 3 = 8$) ;
- oublier une coordonnée : le résultat a autant de coordonnées que $u$ et $v$.

**À retenir :** une ligne par coordonnée, on multiplie d'abord, on additionne ou soustrait ensuite, en surveillant les signes.

Le **vecteur nul** est $0 = (0, 0, \dots, 0)$. L'ajouter ne change rien : $u + 0 = u$.

> [!tip] Lien avec la data
> Un client décrit par (âge, revenu, nombre d'achats) = un vecteur de $\mathbb{R}^3$. Un tableau de 1 000 lignes = 1 000 vecteurs.

### Espace vectoriel

Un **espace vectoriel** est un ensemble dans lequel on peut additionner des éléments et les multiplier par un nombre, en respectant des règles naturelles (il y a un vecteur nul, $u + v = v + u$, etc.). Exemples : $\mathbb{R}^n$, l'ensemble des polynômes, l'ensemble des fonctions continues sur $[0, 1]$. Ici, on travaille surtout dans $\mathbb{R}^n$.

## 2. Combinaison linéaire

Une **combinaison linéaire** des vecteurs $v_1, \dots, v_k$ est une **somme pondérée** : on multiplie chaque vecteur par un nombre, puis on additionne tout.

$$\lambda_1 v_1 + \lambda_2 v_2 + \dots + \lambda_k v_k \qquad \text{avec } \lambda_i \in \mathbb{R}$$

Les $\lambda_i$ sont les **coefficients** (ou **poids**). Ce sont des nombres **fixes** : ils peuvent être négatifs, nuls ou à virgule.

Exemple : $3(1, 0) - 2(0, 1) = (3, 0) + (0, -2) = (3, -2)$. Les coefficients sont $3$ et $-2$.

Ce qui n'est **pas** une combinaison linéaire : multiplier deux vecteurs (ou deux variables) entre eux, ou mettre une variable au carré. Seules les multiplications « nombre fixe $\times$ vecteur » sont permises.

### Une somme pondérée de nombres

La même idée marche avec de simples nombres : on multiplie chaque valeur par son poids et on additionne.

**Exemple résolu :** un score se calcule par $s = 3x_1 - 2x_2 + 0{,}5\,x_3$, soit les poids $(3,\ -2,\ 0{,}5)$. Que vaut $s$ pour $x = (2, 1, 4)$ ?

| Variable | Valeur | Poids | Produit |
|---|---|---|---|
| $x_1$ | $2$ | $3$ | $3 \times 2 = 6$ |
| $x_2$ | $1$ | $-2$ | $-2 \times 1 = -2$ |
| $x_3$ | $4$ | $0{,}5$ | $0{,}5 \times 4 = 2$ |

On additionne la dernière colonne : $s = 6 - 2 + 2 = 6$. Le poids $-2$ est négatif : son produit **retire** quelque chose. L'oublier donnerait $6 + 2 + 2 = 10$.

**À retenir :** une somme pondérée = chaque valeur fois son poids (avec son signe), puis on additionne les produits.

> [!tip] Lien avec la data
> Une prédiction de régression linéaire $\hat{y} = w_1 x_1 + w_2 x_2 + \dots + w_n x_n$ est une combinaison linéaire des variables $x_i$, avec les poids $w_i$ comme coefficients. $\hat{y}$ (lu « y chapeau ») est un **nombre** : la valeur prédite.

### Savoir si un vecteur est une combinaison linéaire

On cherche $\lambda$ et $\mu$ (lu « mu ») tels que $\lambda u + \mu v = w$. On écrit l'égalité **coordonnée par coordonnée** : on obtient un **système d'équations**, une équation par coordonnée.

- Si on trouve des valeurs qui vérifient **toutes** les équations : $w$ est une combinaison linéaire de $u$ et $v$.
- Si les équations se contredisent : il n'y a **pas de solution**, $w$ n'en est pas une.

**Exemple résolu (impossible) :** $u = (1, 2, -1)$, $v = (0, 1, 3)$ et $w = (2, 5, 5)$.

1. On calcule $\lambda u + \mu v = (\lambda,\ 2\lambda + \mu,\ -\lambda + 3\mu)$.
2. 1re coordonnée : $\lambda = 2$.
3. 2e coordonnée : $2\lambda + \mu = 5$, soit $4 + \mu = 5$, donc $\mu = 1$.
4. 3e coordonnée, on **vérifie** avec ces valeurs : $-\lambda + 3\mu = -2 + 3 = 1$. Or la 3e coordonnée de $w$ vaut $5$, et $1 \neq 5$.

Les deux premières équations imposent $\lambda = 2$ et $\mu = 1$, et la troisième n'est pas d'accord : le système n'a **pas de solution**, $w$ n'est pas une combinaison linéaire de $u$ et $v$.

Avec 3 équations et seulement 2 inconnues, il y a une équation « de trop » : elle sert de contrôle. S'arrêter après deux équations sans vérifier la troisième est l'erreur classique.

**À retenir :** une équation par coordonnée ; on trouve les coefficients avec les plus simples, puis on vérifie **toutes** les autres.

### Résoudre un système de deux équations

Deux méthodes suffisent.

**Par substitution** : on isole une inconnue dans une équation, puis on la remplace dans l'autre.

**Exemple résolu :** on cherche $\lambda$ et $\mu$ tels que $\lambda (2, 1) + \mu (1, 3) = (5, 5)$.

1. Coordonnée par coordonnée : $2\lambda + \mu = 5$ et $\lambda + 3\mu = 5$.
2. On isole $\mu$ dans la 1re : $\mu = 5 - 2\lambda$.
3. On remplace dans la 2e : $\lambda + 3(5 - 2\lambda) = 5$, soit $\lambda + 15 - 6\lambda = 5$, soit $-5\lambda = -10$, donc $\lambda = 2$.
4. On revient à l'étape 2 : $\mu = 5 - 2 \times 2 = 1$.
5. **Vérification** : $2(2, 1) + 1(1, 3) = (4, 1) + (1, 3) = (5, 5)$. C'est juste.

**Par addition** : quand une inconnue a des coefficients opposés dans les deux équations ($+\mu$ et $-\mu$), on additionne les équations membre à membre pour la faire disparaître.

**Exemple résolu :** $a + b = 4$ et $a - b = 2$.

1. On additionne : $(a + b) + (a - b) = 4 + 2$, soit $2a = 6$, donc $a = 3$.
2. On remplace dans la 1re : $3 + b = 4$, donc $b = 1$.
3. Vérification dans la 2e : $3 - 1 = 2$. C'est juste.

**À retenir :** isole une inconnue et remplace-la (substitution), ou additionne les équations pour en faire disparaître une (addition) ; vérifie toujours dans l'énoncé de départ.

## 3. Famille libre, famille liée

Une **famille** est une liste de vecteurs $(v_1, \dots, v_k)$.

- Elle est **libre** si la **seule** combinaison linéaire égale au vecteur nul est celle où tous les coefficients sont nuls :

$$\lambda_1 v_1 + \dots + \lambda_k v_k = 0 \ \Longrightarrow\ \lambda_1 = \dots = \lambda_k = 0$$

- Sinon, elle est **liée** : au moins un vecteur s'écrit avec les autres (il est **redondant**).

Avec des coefficients tous nuls, on obtient **toujours** le vecteur nul, quelle que soit la famille ($0 \times v_1 + 0 \times v_2 = 0$). Cette combinaison-là ne prouve rien : on l'appelle la combinaison **triviale**. La question est : existe-t-il une **autre** façon d'obtenir 0 ?

Exemples :

| Famille | Libre ou liée ? | Pourquoi |
|---|---|---|
| $(1, 0), (0, 1)$ | libre | aucun n'est un multiple de l'autre |
| $(1, 2), (2, 4)$ | liée | $(2, 4) = 2(1, 2)$ |
| $(1, 0, 0), (0, 1, 0), (1, 1, 0)$ | liée | le 3e est la somme des deux premiers |

Attention : des vecteurs tous non nuls et tous différents peuvent quand même être liés, comme $(1, 2)$ et $(2, 4)$.

> [!tip] Méthode : tester si une famille est libre
> 1. Poser $\lambda_1 v_1 + \dots + \lambda_k v_k = 0$.
> 2. Écrire le système coordonnée par coordonnée.
> 3. Si la seule solution est $\lambda_1 = \dots = \lambda_k = 0$ : **libre**. Sinon : **liée**.

Raccourcis utiles :

- **Deux vecteurs** sont liés si et seulement si l'un est un multiple de l'autre.
- Une famille qui contient le **vecteur nul** est toujours liée ($1 \times 0 = 0$ avec un coefficient non nul).

### Deux vecteurs : chercher un multiple

Pour savoir si $v$ est un multiple de $u$, on divise chaque coordonnée de $v$ par celle de $u$ : si on trouve **le même nombre** partout, $v = k \times u$ et la famille est liée. Sinon, elle est libre.

**Exemple résolu :** $(2, -4)$ et $(-1, 2)$, puis $(2, 5)$ et $(4, 9)$.

| Famille | 1re coordonnée | 2e coordonnée | Même nombre ? | Conclusion |
|---|---|---|---|---|
| $(2, -4)$ et $(-1, 2)$ | $-1 \div 2 = -0{,}5$ | $2 \div (-4) = -0{,}5$ | oui | liée : $(-1, 2) = -0{,}5 \times (2, -4)$ |
| $(2, 5)$ et $(4, 9)$ | $4 \div 2 = 2$ | $9 \div 5 = 1{,}8$ | non | libre |

- Un coefficient **négatif** compte aussi : $(-1, 2)$ est bien un multiple de $(2, -4)$.
- Si une coordonnée vaut 0 chez l'un et pas chez l'autre, ce ne sont pas des multiples : $(0, 3)$ et $(2, 6)$ sont libres (aucun nombre $k$ ne fait $k \times 0 = 2$).
- Si l'un des deux est le vecteur nul, la famille est liée : $(0, 0) = 0 \times (7, 1)$, ou, écrit comme une combinaison nulle, $1 \times (0, 0) + 0 \times (7, 1) = (0, 0)$ avec le coefficient $1 \neq 0$.

**À retenir :** deux vecteurs sont liés quand on passe de l'un à l'autre en multipliant **toutes** les coordonnées par le **même** nombre.

### Trois vecteurs ou plus : le système

**Exemple résolu (libre) :** $(1, 1, 0)$, $(0, 1, 1)$ et $(1, 0, 1)$.

1. On pose $a(1, 1, 0) + b(0, 1, 1) + c(1, 0, 1) = (0, 0, 0)$, soit $(a + c,\ a + b,\ b + c) = (0, 0, 0)$.
2. 1re équation : $a + c = 0$, donc $a = -c$.
3. 2e équation : $a + b = 0$, donc $b = -a = c$.
4. 3e équation : $b + c = 0$, soit $c + c = 2c = 0$, donc $c = 0$. Puis $a = 0$ et $b = 0$.

La seule solution est $a = b = c = 0$ : la famille est **libre**.

**Exemple résolu (liée) :** $(1, 0, 1)$, $(0, 1, 1)$ et $(1, 1, 2)$.

1. $a(1, 0, 1) + b(0, 1, 1) + c(1, 1, 2) = (a + c,\ b + c,\ a + b + 2c) = (0, 0, 0)$.
2. 1re équation : $a = -c$. 2e équation : $b = -c$.
3. 3e équation : $-c - c + 2c = 0$, soit $0 = 0$ : toujours vrai, quel que soit $c$.

On peut donc choisir $c = 1$, ce qui donne $a = -1$, $b = -1$ : $-1(1, 0, 1) - 1(0, 1, 1) + 1(1, 1, 2) = (0, 0, 0)$. Les coefficients ne sont pas tous nuls : la famille est **liée** (le 3e vecteur est la somme des deux premiers).

**À retenir :** si le système oblige tous les coefficients à valoir 0, c'est libre ; s'il laisse une inconnue libre de prendre une valeur non nulle, c'est lié.

### D'une relation à une combinaison nulle

Si on sait déjà qu'un vecteur s'écrit avec les autres, on obtient une combinaison nulle en **passant tout du même côté** du signe $=$ (ce qui passe de l'autre côté change de signe).

**Exemple résolu :** on sait que $w = 2u - v$. Quels coefficients $(\alpha, \beta, \gamma)$ donnent $\alpha u + \beta v + \gamma w = 0$ ?

1. On part de $w = 2u - v$.
2. On passe $w$ à droite : $0 = 2u - v - w$.
3. On lit les coefficients dans l'ordre $u$, $v$, $w$ : $(\alpha, \beta, \gamma) = (2, -1, -1)$.
4. Vérification : $2u - v - w = 2u - v - (2u - v) = 0$. C'est juste.

On peut multiplier tous les coefficients par un même nombre : $(-2, 1, 1)$ marche aussi. C'est pourquoi un énoncé fixe souvent un coefficient (« avec $\gamma = -1$ ») pour n'avoir qu'une seule bonne réponse. En revanche $(0, 0, 0)$ ne compte pas : c'est la combinaison triviale.

**À retenir :** pour transformer « $w = \dots$ » en combinaison nulle, passe tout du même côté en changeant les signes, puis lis les coefficients dans l'ordre des vecteurs.

> [!tip] Lien avec la data : la multicolinéarité
> Si une colonne est une combinaison linéaire des autres (ex. `tva_montant = prix_ttc - prix_ht`), la famille des colonnes est liée. C'est la **multicolinéarité** : les coefficients d'une régression deviennent instables. On supprime la colonne redondante.

### La multicolinéarité, pas à pas

On voit chaque **colonne** d'un tableau comme un vecteur, avec une coordonnée par ligne.

**Exemple résolu :** un fichier d'élèves a les colonnes `maths`, `info` et `score`, avec toujours $\text{score} = 3 \times \text{maths} - \text{info}$.

1. `score` s'écrit avec `maths` et `info` : la famille de colonnes est **liée**, la colonne `score` est redondante.
2. Combinaison nulle : $3 \cdot \text{maths} - 1 \cdot \text{info} - 1 \cdot \text{score} = 0$, soit les coefficients $(3, -1, -1)$.
3. Pourquoi c'est gênant : une régression qui utilise les trois colonnes peut écrire la **même** prédiction de plusieurs façons. Par exemple $\hat{y} = 3 \cdot \text{maths} - \text{info}$ et $\hat{y} = \text{score}$ donnent exactement les mêmes valeurs sur toutes les lignes. Le modèle ne sait pas quels poids choisir : ils deviennent **instables** (ils changent beaucoup pour un petit changement des données) et on ne peut plus dire quelle colonne compte vraiment.
4. Remède : on supprime la colonne redondante (`score`). On ne perd **aucune** information, puisqu'elle se recalcule.

**À retenir :** une colonne qui est une combinaison linéaire des autres n'apporte rien de nouveau et rend les poids instables : on la retire.

### Linéaire ou pas linéaire ?

Une relation entre colonnes est **linéaire** si chaque colonne y est multipliée par un **nombre fixe** (le même sur toutes les lignes). Si on multiplie deux colonnes entre elles, ce n'est plus linéaire.

**Exemple résolu :** `ttc = ht × (1 + taux)`.

- Si le taux **change** d'un produit à l'autre, on multiplie la colonne `ht` par la colonne `taux` : c'est un **produit de colonnes**, la relation n'est pas linéaire.
- Si le taux vaut **toujours** 5,5 %, on convertit le pourcentage en nombre : $5{,}5\,\% = \frac{5{,}5}{100} = 0{,}055$. Alors $\text{ttc} = \text{ht} \times (1 + 0{,}055) = 1{,}055 \times \text{ht}$ : `ttc` est un multiple fixe de `ht`, la relation est linéaire (et les deux colonnes sont liées).

Pièges : répondre $0{,}055$ (le taux seul, sans le $1 +$) ou $5{,}5$ (le pourcentage non converti).

**À retenir :** linéaire = chaque colonne fois un nombre constant ; une colonne fois une autre colonne n'est pas linéaire.

## 4. Famille génératrice, base, dimension

- Une famille est **génératrice** de $E$ si **tout** vecteur de $E$ est une combinaison linéaire de cette famille. Exemple : $(1, 0), (0, 1)$ engendrent $\mathbb{R}^2$, car $(a, b) = a(1, 0) + b(0, 1)$.
- Une **base** est une famille **libre et génératrice**. Tout vecteur s'écrit alors de façon **unique** dans la base : les coefficients sont ses **coordonnées** dans cette base.
- La **dimension** d'un espace est le nombre de vecteurs d'une base (toutes les bases ont le même nombre de vecteurs).

$$\dim \mathbb{R}^n = n$$

En résumé : libre = **pas de vecteur en trop** ; génératrice = **pas de vecteur qui manque** ; base = les deux à la fois.

La **base canonique** de $\mathbb{R}^n$ est $e_1 = (1, 0, \dots, 0)$, ..., $e_n = (0, \dots, 0, 1)$. Elle a $n$ vecteurs : c'est pour cela que $\dim \mathbb{R}^n = n$ (donc $\dim \mathbb{R}^2 = 2$, $\dim \mathbb{R}^3 = 3$, et non $n^2$).

### Coordonnées dans la base canonique

**Exemple résolu :** écrire $(-3, 8)$ avec $e_1 = (1, 0)$ et $e_2 = (0, 1)$, puis $(0, 6, -1)$ avec la base canonique de $\mathbb{R}^3$.

1. $a\,e_1 + b\,e_2 = (a, 0) + (0, b) = (a, b)$. Pour obtenir $(-3, 8)$, il faut $a = -3$ et $b = 8$.
2. Dans $\mathbb{R}^3$ : $a(1, 0, 0) + b(0, 1, 0) + c(0, 0, 1) = (a, b, c)$. Pour $(0, 6, -1)$ : $(a, b, c) = (0, 6, -1)$.

Dans la base canonique, les coefficients sont **les coordonnées elles-mêmes**, dans le même ordre, signes compris. Le $0$ se garde : il dit que $e_1$ n'est pas utilisé, et sans lui on ne saurait plus quel nombre va avec quel vecteur.

**À retenir :** dans la base canonique, les coordonnées se lisent directement ; dans une autre base, il faut résoudre un système.

> [!tip] Raccourci (admis)
> En dimension $n$, une famille **libre** de $n$ vecteurs est automatiquement une **base**. Il suffit donc de vérifier qu'elle est libre.

Exemple : $u = (1, 1)$ et $v = (1, -1)$. Si $\lambda u + \mu v = 0$, alors $\lambda + \mu = 0$ et $\lambda - \mu = 0$, donc $\lambda = \mu = 0$ : la famille est libre. Deux vecteurs libres dans $\mathbb{R}^2$ : c'est une base. Les coordonnées de $(4, 2)$ s'obtiennent avec le système $a + b = 4$, $a - b = 2$ : $a = 3$, $b = 1$.

### Vérifier une base et trouver des coordonnées, pas à pas

**Le même exemple, en détail.** $u = (1, 1)$, $v = (1, -1)$ dans $\mathbb{R}^2$.

1. **Libre ?** $\lambda(1, 1) + \mu(1, -1) = (\lambda + \mu,\ \lambda - \mu) = (0, 0)$. En additionnant les deux équations : $2\lambda = 0$, donc $\lambda = 0$, puis $\mu = 0$. Seule la combinaison triviale : **libre**.
2. **Base ?** Il y a 2 vecteurs libres et $\dim \mathbb{R}^2 = 2$ : d'après le raccourci, c'est une **base**. Ce n'est **pas** parce que les vecteurs sont non nuls ou différents (ça ne suffit jamais).
3. **Coordonnées de $(4, 2)$** : on cherche $a$ et $b$ avec $a(1, 1) + b(1, -1) = (4, 2)$, soit $a + b = 4$ et $a - b = 2$. Par addition : $2a = 6$, $a = 3$, puis $b = 4 - 3 = 1$.
4. **Vérification** : $3(1, 1) + 1(1, -1) = (3, 3) + (1, -1) = (4, 2)$. C'est juste.

Les coordonnées de $(4, 2)$ dans la base $(u, v)$ sont donc $(3, 1)$ : le premier nombre va avec $u$, le second avec $v$. Ce ne sont pas les mêmes que dans la base canonique, où c'était $(4, 2)$.

**À retenir :** libre (système) + bon nombre de vecteurs = base ; pour les coordonnées, on résout $a\,u + b\,v = X$ et on vérifie.

### Une base « en escalier » : résoudre de bas en haut

Quand les vecteurs de la base ont de plus en plus de zéros, le système se résout une inconnue à la fois.

**Exemple résolu :** $p = (1, 1, 1)$, $q = (0, 1, 1)$, $r = (0, 0, 1)$ (on admet que c'est une base de $\mathbb{R}^3$). Coordonnées de $X = (2, 5, 4)$ ?

1. On calcule $a\,p + b\,q + c\,r = (a,\ a + b,\ a + b + c)$.
2. 1re coordonnée, une seule inconnue : $a = 2$.
3. 2e : $a + b = 5$, donc $b = 5 - 2 = 3$.
4. 3e : $a + b + c = 4$, donc $c = 4 - 2 - 3 = -1$.
5. Vérification : $2(1, 1, 1) + 3(0, 1, 1) - 1(0, 0, 1) = (2, 2, 2) + (0, 3, 3) + (0, 0, -1) = (2, 5, 4)$.

Les coordonnées de $X$ dans $(p, q, r)$ sont $(2, 3, -1)$. Ici on commence par le **haut** (la 1re équation n'a qu'une inconnue) ; avec d'autres vecteurs, c'est parfois la dernière qui n'a qu'une inconnue, et on remonte. On cherche toujours l'équation à **une seule** inconnue.

**À retenir :** écris la combinaison en fonction des coefficients, commence par l'équation qui n'a qu'une inconnue, puis remplace de proche en proche.

> [!warning] Combien de vecteurs ?
> Dans $\mathbb{R}^n$ :
> - **plus de $n$ vecteurs** : la famille est forcément **liée** ;
> - **moins de $n$ vecteurs** : la famille ne peut pas être **génératrice** ;
> - **exactement $n$ vecteurs** : libre $\Leftrightarrow$ base.

### Compter les vecteurs, pas à pas

**Exemple résolu :** que dire de chaque famille de $\mathbb{R}^3$ ($n = 3$) ?

| Famille | Nombre de vecteurs | Ce qu'on peut dire sans calcul |
|---|---|---|
| $(1, 0, 0), (2, 0, 0), (0, 1, 0), (0, 2, 0)$ | 4, plus que 3 | forcément **liée** ; et ici pas génératrice non plus (la 3e coordonnée vaut toujours 0) |
| $(1, 0, 2), (0, 1, 5)$ | 2, moins que 3 | **jamais génératrice** : même libres, deux vecteurs n'engendrent qu'un plan |
| $(1, 1, 0), (0, 1, 1), (1, 0, 1)$ | 3, exactement 3 | base si et seulement si elle est libre (c'est le cas, vu plus haut) |

- Trop de vecteurs donne « liée », mais **pas forcément** génératrice : la première ligne le montre.
- Trop peu de vecteurs donne « pas génératrice », mais la famille peut être libre ou liée.
- Une famille libre a donc **au plus** $n$ vecteurs, et une base en a **exactement** $n$.

**À retenir :** compare le nombre de vecteurs à la dimension $n$ : plus de $n$ = liée, moins de $n$ = pas génératrice, exactement $n$ = il suffit de tester « libre ».

```anim
vecteurs
```

## 5. Sous-espace vectoriel

Une partie $F$ de $E$ est un **sous-espace vectoriel** si :

1. elle contient le **vecteur nul** ;
2. elle est **stable par combinaison linéaire** : si $u, v \in F$, alors $\lambda u + \mu v \in F$ pour tous $\lambda, \mu$.

« Stable » veut dire qu'en combinant des éléments de $F$, on ne sort jamais de $F$.

Dans $\mathbb{R}^2$ et $\mathbb{R}^3$, ce sont les droites et les plans **qui passent par l'origine**.

| Ensemble | Sous-espace ? |
|---|---|
| $\{(x, y) \mid y = 2x\}$ | oui (droite par l'origine) |
| $\{(x, y) \mid y = 2x + 1\}$ | non : ne contient pas $(0, 0)$ |
| $\{(x, y) \mid x \geq 0\}$ | non : $(1, 0)$ y est, mais pas $-1 \times (1, 0)$ |

### Tester un sous-espace, pas à pas

On teste dans cet ordre :

1. **Le vecteur nul est-il dedans ?** On remplace toutes les coordonnées par 0 dans la condition. Si elle est fausse, c'est fini : **pas** un sous-espace.
2. **Stable ?** Soit on le montre pour des éléments **quelconques**, soit on trouve **un** contre-exemple : deux éléments dont la somme sort de l'ensemble, ou un élément dont un multiple en sort.

**Exemple résolu (oui) :** $F = \{(x, y) \mid y = 2x\}$.

1. $(0, 0)$ : $0 = 2 \times 0$ est vrai. Le vecteur nul est dans $F$.
2. On prend deux éléments quelconques de $F$ : $u = (a, 2a)$ et $v = (b, 2b)$. Alors $\lambda u + \mu v = (\lambda a + \mu b,\ 2\lambda a + 2\mu b) = (X,\ 2X)$ avec $X = \lambda a + \mu b$. La 2e coordonnée vaut bien 2 fois la 1re : le résultat est dans $F$.

$F$ est un sous-espace. Les équations de la forme « $y = k x$ », ou « une somme de coordonnées multipliées par des nombres $= 0$ », sans terme constant, marchent toujours de cette façon.

**Exemple résolu (non, par le vecteur nul) :** $\{(x, y) \mid y = 2x + 1\}$. Pour $(0, 0)$ : $0 = 2 \times 0 + 1 = 1$ est faux. Le « $+ 1$ » (un **terme constant**) empêche la droite de passer par l'origine : pas un sous-espace.

**Exemple résolu (non, par la multiplication) :** $\{(x, y) \mid x \geq 0\}$. Le vecteur nul y est ($0 \geq 0$). Mais $(1, 0)$ y est, et $-1 \times (1, 0) = (-1, 0)$ n'y est pas ($-1 \geq 0$ est faux). Contenir 0 ne suffit pas.

**Exemple résolu (non, par la somme) :** $A = \{(x, y) \mid xy = 0\}$ (les deux axes). Le vecteur nul y est ($0 \times 0 = 0$). $(1, 0)$ y est ($1 \times 0 = 0$), $(0, 1)$ aussi. Mais leur somme $(1, 1)$ donne $1 \times 1 = 1 \neq 0$ : elle sort de $A$. Une condition avec un **produit** de coordonnées ou un **carré** ne donne en général pas un sous-espace.

**À retenir :** d'abord le test du vecteur nul ; s'il passe, cherche une somme ou un multiple qui sort de l'ensemble ; une équation linéaire sans terme constant donne toujours un sous-espace.

### Appartenir à un plan

Un vecteur appartient au plan d'équation $a x + b y + c z = 0$ si, en **remplaçant** $x$, $y$, $z$ par ses coordonnées, on trouve bien 0.

**Exemple résolu :** le plan $P : 2x + y - z = 0$ dans $\mathbb{R}^3$.

| Vecteur | Calcul de $2x + y - z$ | Vaut 0 ? | Dans $P$ ? |
|---|---|---|---|
| $(1, 1, 3)$ | $2 \times 1 + 1 - 3 = 0$ | oui | oui |
| $(1, 2, 3)$ | $2 \times 1 + 2 - 3 = 1$ | non | non |

Pour trouver la coordonnée qui manque dans $(2, -1, c)$ : $2 \times 2 + (-1) - c = 0$, soit $3 - c = 0$, donc $c = 3$. Attention au signe moins devant $z$ : en l'oubliant ($3 + c = 0$), on trouverait $-3$.

**À retenir :** pour tester l'appartenance, remplace et calcule ; pour une coordonnée inconnue, remplace les autres et résous l'équation.

### Base et dimension d'un plan

Un **hyperplan** de $\mathbb{R}^n$, d'équation $a_1 x_1 + \dots + a_n x_n = 0$, est un sous-espace de dimension $n - 1$.

Une seule équation « enlève » une dimension : dans $\mathbb{R}^3$, une équation donne un plan (dimension 2) ; dans $\mathbb{R}^{10}$, un hyperplan est de dimension $10 - 1 = 9$.

Exemple : le plan $F : x + y + z = 0$ dans $\mathbb{R}^3$. Les vecteurs $(1, -1, 0)$ et $(1, 0, -1)$ sont dans $F$, ils sont libres et ils engendrent $F$ : $\dim F = 2 = 3 - 1$.

**Exemple résolu : trouver une base du plan $P : 2x + y - z = 0$.**

1. On isole une coordonnée : $z = 2x + y$. On peut choisir $x$ et $y$ librement, $z$ s'en déduit.
2. On prend $x = 1$, $y = 0$ : $z = 2$, d'où $(1, 0, 2)$. Puis $x = 0$, $y = 1$ : $z = 1$, d'où $(0, 1, 1)$.
3. Ils sont dans $P$ : $2 + 0 - 2 = 0$ et $0 + 1 - 1 = 0$.
4. Libres : $(1, 0, 2)$ a un 0 en 2e place et $(0, 1, 1)$ non, aucun n'est multiple de l'autre.
5. Générateurs : tout $(x, y, z)$ de $P$ vaut $(x,\ y,\ 2x + y) = x(1, 0, 2) + y(0, 1, 1)$.

C'est une base de 2 vecteurs : $\dim P = 2$, ce qui colle avec la règle $3 - 1 = 2$.

**À retenir :** dimension d'un sous-espace = nombre de vecteurs d'une base ; pour un hyperplan de $\mathbb{R}^n$, c'est $n - 1$.

> [!tip] Lien avec la data : la PCA
> Si les données à 5 colonnes vivent en réalité dans un sous-espace de dimension 2, alors 2 vecteurs suffisent pour tout décrire. La **PCA** cherche justement une petite base qui garde l'essentiel de l'information.

### La vraie dimension d'un jeu de données

Le nombre de colonnes n'est pas forcément la vraie dimension des données : si certaines colonnes se calculent avec d'autres, elles ne comptent pas.

**Exemple résolu :** trois colonnes $a$, $b$, $c$ avec $c = a - b$ sur toutes les lignes, et $a$, $b$ non proportionnelles.

1. $c$ s'écrit avec $a$ et $b$ : la famille $(a, b, c)$ est **liée**, $c$ est redondante.
2. $a$ et $b$ ne sont pas proportionnelles : la famille $(a, b)$ est **libre**.
3. Toutes les colonnes se fabriquent avec $a$ et $b$ ($a = 1 \cdot a + 0 \cdot b$, $b = 0 \cdot a + 1 \cdot b$, $c = 1 \cdot a - 1 \cdot b$) : $(a, b)$ est **génératrice**.
4. Donc $(a, b)$ est une base, et les données vivent dans un espace de **dimension 2** : au plus 2 colonnes sont linéairement indépendantes. La famille $(a, b, c)$, avec 3 vecteurs dans un espace de dimension 2, est forcément liée.
5. Sur une ligne où $a = 4$ et $b = -2$ : $c = 4 - (-2) = 6$. On retrouve $c$ sans le stocker.

Garder seulement $a$ et $b$ ne perd **rien** : moins de mémoire, moins de calcul, et plus de multicolinéarité. La PCA fait la même chose sur de vraies données, où les relations ne sont qu'approximatives.

**À retenir :** vraie dimension = nombre de colonnes qui restent une fois retirées toutes celles qui se calculent avec les autres.

## À retenir

- Combinaison linéaire = **somme pondérée** de vecteurs.
- Libre = **aucune redondance**. Liée = un vecteur s'écrit avec les autres.
- Génératrice = on peut **tout** fabriquer. Base = **libre + génératrice**.
- Dimension = **nombre de vecteurs d'une base** ; $\dim \mathbb{R}^n = n$.
- Sous-espace = contient 0 et stable par combinaison linéaire.

> [!warning] Pièges
> - Plus de $n$ vecteurs dans $\mathbb{R}^n$ : forcément liée.
> - Un produit de colonnes (`prix_ht × taux`) n'est **pas** une relation linéaire.
> - Un plan qui ne passe pas par l'origine n'est **pas** un sous-espace.
> - Une famille qui contient le vecteur nul est toujours liée.
