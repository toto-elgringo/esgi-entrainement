# Espaces vectoriels

> [!info] Pourquoi ce chapitre ?
> Une ligne d'un jeu de données à $n$ colonnes numériques, c'est un **vecteur** de $\mathbb{R}^n$. Ce chapitre donne le vocabulaire de l'algèbre linéaire (combinaison linéaire, famille libre, base, dimension) qui sert ensuite pour la régression et la **PCA** (réduction de dimension).

## 1. Les vecteurs de $\mathbb{R}^n$

Un **vecteur** de $\mathbb{R}^n$ est une liste ordonnée de $n$ nombres réels :

$$u = (u_1, u_2, \dots, u_n)$$

L'ordre compte : $(1, 2) \neq (2, 1)$.

Deux opérations de base, faites **coordonnée par coordonnée** :

- **Addition** : $u + v = (u_1 + v_1, \dots, u_n + v_n)$
- **Multiplication par un scalaire** (un nombre réel $\lambda$) : $\lambda u = (\lambda u_1, \dots, \lambda u_n)$

Exemple avec $u = (1, 2, -1)$ et $v = (0, 1, 3)$ :

$$2u - v = (2, 4, -2) - (0, 1, 3) = (2, 3, -5)$$

Le **vecteur nul** est $0 = (0, 0, \dots, 0)$.

> [!tip] Lien avec la data
> Un client décrit par (âge, revenu, nombre d'achats) = un vecteur de $\mathbb{R}^3$. Un tableau de 1 000 lignes = 1 000 vecteurs.

### Espace vectoriel

Un **espace vectoriel** est un ensemble dans lequel on peut additionner des éléments et les multiplier par un nombre, en respectant des règles naturelles (il y a un vecteur nul, $u + v = v + u$, etc.). Exemples : $\mathbb{R}^n$, l'ensemble des polynômes, l'ensemble des fonctions continues sur $[0, 1]$. Ici, on travaille surtout dans $\mathbb{R}^n$.

## 2. Combinaison linéaire

Une **combinaison linéaire** des vecteurs $v_1, \dots, v_k$ est une **somme pondérée** :

$$\lambda_1 v_1 + \lambda_2 v_2 + \dots + \lambda_k v_k \qquad \text{avec } \lambda_i \in \mathbb{R}$$

Les $\lambda_i$ sont les **coefficients**.

Exemple : $3(1, 0) - 2(0, 1) = (3, -2)$.

### Savoir si un vecteur est une combinaison linéaire

On cherche $\lambda$ et $\mu$ tels que $\lambda u + \mu v = w$. On écrit l'égalité **coordonnée par coordonnée** : on obtient un **système d'équations**.

Exemple : $u = (1, 2, -1)$, $v = (0, 1, 3)$ et $w = (2, 5, 5)$.

- 1re coordonnée : $\lambda = 2$
- 2e coordonnée : $2\lambda + \mu = 5$, donc $\mu = 1$
- 3e coordonnée : $-\lambda + 3\mu = -2 + 3 = 1 \neq 5$

Le système n'a **pas de solution** : $w$ n'est pas une combinaison linéaire de $u$ et $v$.

> [!tip] Lien avec la data
> Une prédiction de régression linéaire $\hat{y} = w_1 x_1 + w_2 x_2 + \dots + w_n x_n$ est une combinaison linéaire des variables $x_i$, avec les poids $w_i$ comme coefficients.

## 3. Famille libre, famille liée

Une **famille** est une liste de vecteurs $(v_1, \dots, v_k)$.

- Elle est **libre** si la **seule** combinaison linéaire égale au vecteur nul est celle où tous les coefficients sont nuls :

$$\lambda_1 v_1 + \dots + \lambda_k v_k = 0 \ \Longrightarrow\ \lambda_1 = \dots = \lambda_k = 0$$

- Sinon, elle est **liée** : au moins un vecteur s'écrit avec les autres (il est **redondant**).

Exemples :

| Famille | Libre ou liée ? | Pourquoi |
|---|---|---|
| $(1, 0), (0, 1)$ | libre | aucun n'est un multiple de l'autre |
| $(1, 2), (2, 4)$ | liée | $(2, 4) = 2(1, 2)$ |
| $(1, 0, 0), (0, 1, 0), (1, 1, 0)$ | liée | le 3e est la somme des deux premiers |

> [!tip] Méthode : tester si une famille est libre
> 1. Poser $\lambda_1 v_1 + \dots + \lambda_k v_k = 0$.
> 2. Écrire le système coordonnée par coordonnée.
> 3. Si la seule solution est $\lambda_1 = \dots = \lambda_k = 0$ : **libre**. Sinon : **liée**.

Raccourcis utiles :

- **Deux vecteurs** sont liés si et seulement si l'un est un multiple de l'autre.
- Une famille qui contient le **vecteur nul** est toujours liée ($1 \times 0 = 0$ avec un coefficient non nul).

> [!tip] Lien avec la data : la multicolinéarité
> Si une colonne est une combinaison linéaire des autres (ex. `tva_montant = prix_ttc - prix_ht`), la famille des colonnes est liée. C'est la **multicolinéarité** : les coefficients d'une régression deviennent instables. On supprime la colonne redondante.

## 4. Famille génératrice, base, dimension

- Une famille est **génératrice** de $E$ si **tout** vecteur de $E$ est une combinaison linéaire de cette famille. Exemple : $(1, 0), (0, 1)$ engendrent $\mathbb{R}^2$, car $(a, b) = a(1, 0) + b(0, 1)$.
- Une **base** est une famille **libre et génératrice**. Tout vecteur s'écrit alors de façon **unique** dans la base : les coefficients sont ses **coordonnées** dans cette base.
- La **dimension** d'un espace est le nombre de vecteurs d'une base (toutes les bases ont le même nombre de vecteurs).

$$\dim \mathbb{R}^n = n$$

La **base canonique** de $\mathbb{R}^n$ est $e_1 = (1, 0, \dots, 0)$, ..., $e_n = (0, \dots, 0, 1)$.

> [!tip] Raccourci (admis)
> En dimension $n$, une famille **libre** de $n$ vecteurs est automatiquement une **base**. Il suffit donc de vérifier qu'elle est libre.

Exemple : $u = (1, 1)$ et $v = (1, -1)$. Si $\lambda u + \mu v = 0$, alors $\lambda + \mu = 0$ et $\lambda - \mu = 0$, donc $\lambda = \mu = 0$ : la famille est libre. Deux vecteurs libres dans $\mathbb{R}^2$ : c'est une base. Les coordonnées de $(4, 2)$ s'obtiennent avec le système $a + b = 4$, $a - b = 2$ : $a = 3$, $b = 1$.

> [!warning] Combien de vecteurs ?
> Dans $\mathbb{R}^n$ :
> - **plus de $n$ vecteurs** : la famille est forcément **liée** ;
> - **moins de $n$ vecteurs** : la famille ne peut pas être **génératrice** ;
> - **exactement $n$ vecteurs** : libre $\Leftrightarrow$ base.

## 5. Sous-espace vectoriel

Une partie $F$ de $E$ est un **sous-espace vectoriel** si :

1. elle contient le **vecteur nul** ;
2. elle est **stable par combinaison linéaire** : si $u, v \in F$, alors $\lambda u + \mu v \in F$ pour tous $\lambda, \mu$.

Dans $\mathbb{R}^2$ et $\mathbb{R}^3$, ce sont les droites et les plans **qui passent par l'origine**.

| Ensemble | Sous-espace ? |
|---|---|
| $\{(x, y) \mid y = 2x\}$ | oui (droite par l'origine) |
| $\{(x, y) \mid y = 2x + 1\}$ | non : ne contient pas $(0, 0)$ |
| $\{(x, y) \mid x \geq 0\}$ | non : $(1, 0)$ y est, mais pas $-1 \times (1, 0)$ |

Un **hyperplan** de $\mathbb{R}^n$, d'équation $a_1 x_1 + \dots + a_n x_n = 0$, est un sous-espace de dimension $n - 1$.

Exemple : le plan $F : x + y + z = 0$ dans $\mathbb{R}^3$. Les vecteurs $(1, -1, 0)$ et $(1, 0, -1)$ sont dans $F$, ils sont libres et ils engendrent $F$ : $\dim F = 2 = 3 - 1$.

> [!tip] Lien avec la data : la PCA
> Si les données à 5 colonnes vivent en réalité dans un sous-espace de dimension 2, alors 2 vecteurs suffisent pour tout décrire. La **PCA** cherche justement une petite base qui garde l'essentiel de l'information.

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
