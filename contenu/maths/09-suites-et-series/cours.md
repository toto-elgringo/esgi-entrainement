# Suites et séries

Une **suite**, c'est une liste de nombres qui se suivent : $u_0, u_1, u_2, \dots$ Une **série**, c'est ce qu'on obtient en les **additionnant** au fur et à mesure. En informatique, une suite décrit ce que fait une boucle à chaque tour, et une série décrit un total qui s'accumule (un coût, un nombre de requêtes, une perte). La question centrale du chapitre : **est-ce que ça se stabilise ?**

## 1. Qu'est-ce qu'une suite ?

Une suite $(u_n)$ associe un nombre $u_n$ à chaque entier $n$ (le **rang**). Deux façons de la donner :

| Façon | Écriture | Exemple | Pour calculer $u_{10}$ |
|---|---|---|---|
| **Explicite** | $u_n = f(n)$ | $u_n = \dfrac{1}{n+1}$ | on remplace $n$ par $10$ |
| **Récurrente** | $u_{n+1} = f(u_n)$ et $u_0$ donné | $u_{n+1} = 2u_n$, $u_0 = 1$ | on calcule $u_1, u_2, \dots$ un par un |

> [!info] Une suite récurrente, c'est une boucle
> `u = u0` puis, à chaque tour, `u = f(u)`. Après $n$ tours, la variable contient $u_n$. Étudier la suite, c'est savoir ce que la boucle finit par produire.

## 2. Convergence

On dit que $(u_n)$ **converge** vers un nombre $\ell$ (la **limite**) si $u_n$ devient aussi proche qu'on veut de $\ell$ quand $n$ devient grand. On écrit $\lim\limits_{n \to +\infty} u_n = \ell$.

- Quand elle existe, la limite est **unique**.
- Si aucune limite n'existe, la suite **diverge**. Deux façons de diverger : partir vers l'infini ($u_n = 2n$) ou osciller sans se poser ($u_n = (-1)^n$, qui vaut $1, -1, 1, -1, \dots$).

| Suite | Comportement |
|---|---|
| $\dfrac{1}{n}$, $\dfrac{5}{n+2}$ | converge vers $0$ |
| $4 - \dfrac{3}{n}$ | converge vers $4$ |
| $3n - 1$ | diverge vers $+\infty$ |
| $(-1)^n$ | diverge (oscille) |

## 3. Le critère « monotone et bornée »

> [!tip] Théorème (admis)
> - Une suite **croissante** et **majorée** (elle ne dépasse jamais une certaine valeur) converge.
> - Une suite **décroissante** et **minorée** converge aussi.

L'intérêt : on peut savoir qu'une suite se stabilise **sans connaître sa limite**. Pour un algorithme itératif, il suffit de montrer que les valeurs qu'il produit montent sans jamais dépasser un plafond (ou descendent sans passer sous un plancher).

**Exemple.** $u_n = 3 - \dfrac{2}{n+1}$ : $u_0 = 1$, $u_1 = 2$, $u_2 \approx 2{,}33$. Quand $n$ augmente, on retire un nombre de plus en plus petit, donc la suite **croît**. Et comme $\dfrac{2}{n+1} > 0$, on a toujours $u_n < 3$ : elle est **majorée**. Elle converge donc (vers $3$).

> [!warning] Majorée ne veut pas dire « tend vers le majorant »
> La suite ci-dessus est aussi majorée par $100$, mais sa limite est $3$. Le critère dit seulement qu'il **existe** une limite.

## 4. Suites arithmétiques et géométriques

| | Arithmétique | Géométrique |
|---|---|---|
| Récurrence | $u_{n+1} = u_n + r$ (on **ajoute** $r$) | $u_{n+1} = q \times u_n$ (on **multiplie** par $q$) |
| Formule explicite | $u_n = u_0 + n\,r$ | $u_n = u_0 \times q^n$ |
| Comportement | diverge dès que $r \neq 0$ | converge vers $0$ si $\lvert q \rvert < 1$, diverge si $\lvert q \rvert > 1$ |

> [!info] Une quantité qui s'amortit
> Un taux d'apprentissage qu'on multiplie par $0{,}9$ à chaque itération forme une suite géométrique de raison $0{,}9$ : il diminue petit à petit et tend vers $0$.

## 5. Suites arithmético-géométriques

C'est le mélange des deux : $u_{n+1} = a\,u_n + b$ (on multiplie **puis** on ajoute). La méthode est toujours la même, en trois étapes.

1. **Point fixe.** On cherche $\ell$ tel que $\ell = a\ell + b$ (la valeur qui ne bouge plus). Si $a \neq 1$ : $\ell = \dfrac{b}{1 - a}$.
2. **Suite auxiliaire.** On pose $v_n = u_n - \ell$ (l'écart au point fixe). Alors $v_{n+1} = a\,v_n$ : $(v_n)$ est **géométrique de raison $a$**, donc $v_n = v_0\,a^n$.
3. **Retour à $u$.** $u_n = \ell + (u_0 - \ell)\,a^n$.

**Exemple.** $u_{n+1} = 0{,}8\,u_n + 2$ avec $u_0 = 0$.
1. $\ell = 0{,}8\,\ell + 2 \iff 0{,}2\,\ell = 2 \iff \ell = 10$.
2. $v_{n+1} = u_{n+1} - 10 = 0{,}8\,u_n - 8 = 0{,}8\,(u_n - 10) = 0{,}8\,v_n$, avec $v_0 = -10$.
3. $u_n = 10 - 10 \times 0{,}8^n$. Comme $0{,}8^n \to 0$, la suite converge vers $10$.

> [!tip] Le réflexe
> Si $\lvert a \rvert < 1$, l'écart au point fixe est multiplié par $a$ à chaque tour : il fond, et la suite converge vers $\ell$. Si $\lvert a \rvert > 1$, l'écart grossit et la suite diverge (sauf si on part pile sur $\ell$).

## 6. Séries : additionner les termes d'une suite

À partir d'une suite $(u_n)$, on forme les **sommes partielles** :

$$S_N = \sum_{n=0}^{N} u_n = u_0 + u_1 + \dots + u_N$$

La **série** de terme général $u_n$, c'est la suite $(S_N)$. Si $(S_N)$ converge, on dit que la série converge, et sa limite se note $\displaystyle\sum_{n=0}^{+\infty} u_n$.

> [!info] Exemples de séries en informatique
> Un coût cumulé, le nombre total de requêtes traitées depuis le démarrage, la perte additionnée sur toutes les itérations d'un entraînement : ce sont des sommes partielles.

```anim
somme-gauss
titre: Une somme partielle qui ne se stabilise pas
consigne: Les termes 1, 2, 3, … forment une suite arithmétique. Augmente n : la somme partielle grandit sans fin, la série diverge.
n: 6
```

## 7. La série géométrique

À connaître par cœur, pour $q \neq 1$ :

$$\sum_{n=0}^{N} q^n = 1 + q + q^2 + \dots + q^N = \frac{1 - q^{N+1}}{1 - q}$$

- Si $\lvert q \rvert < 1$ : $q^{N+1} \to 0$, donc la série **converge** et $\displaystyle\sum_{n=0}^{+\infty} q^n = \frac{1}{1 - q}$.
- Si $\lvert q \rvert \ge 1$ : la série **diverge**.

**Exemple.** $\displaystyle\sum_{n=0}^{+\infty} \left(\frac{1}{3}\right)^n = \frac{1}{1 - \frac{1}{3}} = \frac{3}{2}$.

> [!warning] Le premier terme compte
> La formule part de $n = 0$ (premier terme $q^0 = 1$). Si la somme commence à $n = 1$, on retire ce $1$ : $\displaystyle\sum_{n=1}^{+\infty} \left(\frac{1}{2}\right)^n = 2 - 1 = 1$.

## 8. Le critère grossier de divergence

> [!tip] Critère (admis)
> Si $u_n$ **ne tend pas vers $0$**, la série $\sum u_n$ **diverge**. Inutile de calculer la moindre somme partielle.

**Exemple.** $\displaystyle\sum \frac{2n+1}{n}$ diverge, car $\dfrac{2n+1}{n} = 2 + \dfrac{1}{n} \to 2 \neq 0$ : on ajoute à chaque fois presque $2$.

> [!warning] Le piège : la réciproque est fausse
> $u_n \to 0$ **ne suffit pas** pour que la série converge. Avec $u_n = \dfrac{1}{n}$, le terme tend vers $0$, et pourtant $1 + \dfrac12 + \dfrac13 + \dots$ grandit sans limite. Quand $u_n \to 0$, le critère grossier **ne permet pas de conclure** : il faut des outils plus fins.

## 9. Un aperçu des séries entières

Une **série entière** est une somme infinie de la forme $\displaystyle\sum_{n=0}^{+\infty} a_n x^n$ : un « polynôme avec une infinité de termes ». Elle converge pour certaines valeurs de $x$ (proches de $0$) et diverge pour d'autres ; la frontière s'appelle le **rayon de convergence** (notion admise ici).

L'exemple à connaître : l'exponentielle elle-même.

$$e^x = \sum_{n=0}^{+\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \dots$$

Elle converge pour **tout** réel $x$. Avec $x = 1$ : $1 + 1 + 0{,}5 + 0{,}1667 + 0{,}0417 \approx 2{,}708$, déjà proche de $e \approx 2{,}718$. Les termes $\dfrac{1}{n!}$ diminuent très vite, donc chaque terme ajouté rapproche encore du résultat.

## 10. Convergence d'un algorithme itératif

Beaucoup d'algorithmes de machine learning répètent une mise à jour $\theta_{n+1} = f(\theta_n)$ (descente de gradient, méthode de Newton, recherche d'un point fixe).

- Si $(\theta_n)$ **converge**, l'algorithme se stabilise sur une solution $\theta^\star$.
- Si elle **diverge** ou oscille, l'algorithme ne se stabilise jamais : il faut changer ses réglages.

**Descente de gradient simplifiée.** $\theta_{n+1} = \theta_n - \eta\,\theta_n = (1 - \eta)\,\theta_n$, où $\eta$ est le **taux d'apprentissage**. C'est une suite géométrique de raison $q = 1 - \eta$ :

| $\eta$ | Raison $1 - \eta$ | Ce qui se passe |
|---|---|---|
| $0{,}2$ | $0{,}8$ | décroît doucement vers $0$ |
| $1{,}5$ | $-0{,}5$ | change de signe à chaque pas, mais converge vers $0$ |
| $2{,}5$ | $-1{,}5$ | oscille de plus en plus fort : **diverge** |

La condition de convergence est $\lvert 1 - \eta \rvert < 1$, c'est-à-dire $0 < \eta < 2$. Un pas trop grand fait « sauter » par-dessus la solution de plus en plus loin.

### Le diagramme en escalier

Pour voir une suite $u_{n+1} = f(u_n)$, on trace la courbe $y = f(x)$ et la droite $y = x$. On part de $u_0$ sur l'axe horizontal, on monte jusqu'à la courbe (on lit $u_1$), on va horizontalement jusqu'à la droite $y = x$ (on reporte $u_1$), et on recommence. Le point où la courbe croise la droite est le **point fixe**.

- Si $f$ est une droite de pente **positive** (entre $0$ et $1$), on obtient un **escalier** qui monte (ou descend) sans jamais revenir en arrière.
- Si la pente est **négative** (entre $-1$ et $0$), les valeurs passent alternativement au-dessus et en dessous du point fixe : on obtient une **spirale** qui s'enroule vers lui.

## À retenir

> [!tip] L'essentiel
> - Une suite convergente se stabilise vers une limite **unique**.
> - Croissante + majorée (ou décroissante + minorée) $\Rightarrow$ convergente.
> - $u_{n+1} = a u_n + b$ : point fixe $\ell = \frac{b}{1-a}$, puis $u_n - \ell$ est géométrique de raison $a$.
> - $\sum_{n=0}^{N} q^n = \frac{1 - q^{N+1}}{1-q}$ ; la série converge si et seulement si $\lvert q \rvert < 1$, vers $\frac{1}{1-q}$.
> - Convergence d'une suite = stabilisation d'un algorithme itératif.

> [!warning] Les pièges
> - $u_n \to 0$ ne garantit **pas** que la série converge (exemple : $\sum \frac1n$).
> - Vérifier l'indice de départ d'une somme avant d'appliquer la formule.
> - Une raison négative ne veut pas dire divergence : c'est $\lvert q \rvert$ qui compte.
