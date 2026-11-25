# Polynômes, interpolation et développements limités

Les **polynômes** sont les fonctions les plus simples à calculer : uniquement des additions et des multiplications. C'est pour ça qu'on s'en sert partout en calcul numérique : pour **faire passer une courbe par des mesures** (interpolation), pour **remplacer une fonction compliquée** par une plus simple près d'un point (développement limité), ou pour **lisser des données bruitées** (régression).

## 1. Rappels sur les polynômes

Un polynôme de **degré** $n$ s'écrit

$$P(x) = a_n x^n + \dots + a_1 x + a_0 \qquad \text{avec } a_n \neq 0.$$

Les nombres $a_0, \dots, a_n$ sont les **coefficients**. Le **degré** est la plus grande puissance de $x$ qui apparaît (avec un coefficient non nul). Une **racine** de $P$ est un nombre $x_0$ tel que $P(x_0) = 0$ : c'est là que la courbe coupe l'axe horizontal.

> [!tip] À retenir (admis)
> Un polynôme de degré $n$ a **au plus** $n$ racines réelles.

**Exemple.** $P(x) = x^2 - 5x + 6$ est de degré $2$. Il a deux racines, $2$ et $3$ : $P(2) = 4 - 10 + 6 = 0$ et $P(3) = 9 - 15 + 6 = 0$.

### Calculer la valeur d'un polynôme

Pour calculer $P(a)$, on remplace **chaque** $x$ par $a$, **entre parenthèses**, puis on calcule dans l'ordre : puissances, multiplications, additions.

**Exemple résolu :** $P(x) = x^3 - 3x^2 + 2$ en $x = -2$.

| Morceau | Calcul | Valeur |
|---|---|---|
| $x^3$ | $(-2)^3 = (-2) \times (-2) \times (-2)$ | $-8$ |
| $-3x^2$ | $-3 \times (-2)^2 = -3 \times 4$ | $-12$ |
| $+2$ | | $+2$ |

Total : $P(-2) = -8 - 12 + 2 = -18$.

Deux pièges de signe : une puissance **impaire** d'un négatif reste négative ($(-2)^3 = -8$), une puissance **paire** devient positive ($(-2)^2 = 4$). Et $-3x^2$ veut dire $-3 \times (x^2)$ : on met au carré **avant** de multiplier.

**À retenir :** remplace $x$ par $(a)$ avec ses parenthèses, et calcule morceau par morceau.

### Un polynôme sans racine réelle

Un carré de réel n'est **jamais négatif** : $x^2 \geq 0$ pour tout réel $x$.

**Exemple résolu :** $x^2 + 9$ a-t-il une racine réelle ?

1. Pour tout réel $x$ : $x^2 \geq 0$.
2. On ajoute $9$ : $x^2 + 9 \geq 9$.
3. Il vaut donc toujours au moins $9$ : il ne vaut jamais $0$. **Aucune** racine réelle.

Le « au plus $n$ » est donc bien un maximum : ce polynôme de degré $2$ a $0$ racine réelle.

**À retenir :** « un carré + un nombre strictement positif » ne s'annule jamais sur les réels.

> [!info] Un peu d'histoire
> Au XIXᵉ siècle, Évariste Galois s'est demandé quelles équations polynomiales peuvent se résoudre avec des racines carrées, cubiques, etc. Ses travaux ont donné naissance à toute une branche des maths (la théorie de Galois), bien au-delà de ce cours.

## 2. Racines réelles et racines complexes

Pour $ax^2 + bx + c = 0$, on calcule le **discriminant** $\Delta = b^2 - 4ac$.

| Signe de $\Delta$ | Solutions |
|---|---|
| $\Delta > 0$ | deux racines réelles $x = \dfrac{-b \pm \sqrt{\Delta}}{2a}$ |
| $\Delta = 0$ | une racine double $x = -\dfrac{b}{2a}$ |
| $\Delta < 0$ | aucune racine **réelle**, mais deux racines **complexes** |

**Exemple résolu ($\Delta > 0$) :** $x^2 + x - 6 = 0$.

1. $a = 1$, $b = 1$, $c = -6$.
2. $\Delta = 1^2 - 4 \times 1 \times (-6) = 1 + 24 = 25$, et $\sqrt{25} = 5$.
3. $x = \dfrac{-1 + 5}{2} = 2$ et $x = \dfrac{-1 - 5}{2} = -3$.
4. Contrôle : $4 + 2 - 6 = 0$ et $9 - 3 - 6 = 0$.

**Exemple résolu ($\Delta = 0$) :** $x^2 - 6x + 9 = 0$ : $\Delta = 36 - 36 = 0$, une seule racine $x = -\dfrac{-6}{2} = 3$. En effet $x^2 - 6x + 9 = (x - 3)^2$ : la racine $3$ est **double** (elle apparaît deux fois dans la factorisation).

**À retenir :** calcule $b^2$ et $4ac$ séparément, attention aux signes de $b$ et $c$, puis regarde le signe de $\Delta$.

### Quand $\Delta < 0$ : les nombres complexes

Quand $\Delta < 0$, on ne peut pas prendre $\sqrt{\Delta}$ dans les réels. On introduit un nombre $i$ tel que $i^2 = -1$, et les deux solutions s'écrivent

$$x = \frac{-b \pm i\sqrt{-\Delta}}{2a}.$$

Elles sont **conjuguées** : même partie $\alpha = -\dfrac{b}{2a}$, et $\pm\beta$ avec $\beta = \dfrac{\sqrt{-\Delta}}{2a}$. On les note $x = \alpha \pm i\beta$.

Le nombre $i$ permet d'écrire la racine d'un négatif : $\sqrt{-25} = 5i$, car $(5i)^2 = 25 \times i^2 = 25 \times (-1) = -25$.

**Exemple résolu :** $x^2 - 2x + 10 = 0$.

1. $a = 1$, $b = -2$, $c = 10$.
2. $\Delta = (-2)^2 - 4 \times 1 \times 10 = 4 - 40 = -36$. C'est négatif : pas de racine réelle.
3. $-\Delta = 36$, donc $\sqrt{-\Delta} = 6$.
4. $x = \dfrac{-(-2) \pm 6i}{2} = \dfrac{2 \pm 6i}{2}$.
5. On divise chaque morceau par $2$ : $x = 1 \pm 3i$.
6. Donc $\alpha = -\dfrac{b}{2a} = \dfrac{2}{2} = 1$ et $\beta = \dfrac{6}{2} = 3$.
7. Contrôle avec $x = 1 + 3i$ : $x^2 = 1 + 6i + 9i^2 = 1 + 6i - 9 = -8 + 6i$, puis $-2x = -2 - 6i$, et $-8 + 6i - 2 - 6i + 10 = 0$.

Pièges : $\alpha = -\dfrac{b}{2a}$ a un signe **moins** ; $\beta$ se divise **aussi** par $2a$ (ici $3$ et non $6$) ; on prend $\beta$ positif, le $\pm$ donne les deux racines.

**À retenir :** $\Delta < 0$ → $x = \alpha \pm i\beta$ avec $\alpha = -\dfrac{b}{2a}$ et $\beta = \dfrac{\sqrt{-\Delta}}{2a}$.

> [!info] Ce qu'il faut en retenir
> « Pas de racine réelle » ne veut pas dire « pas de racine du tout » : les racines sont simplement sorties des réels. En comptant les racines complexes, un polynôme de degré $n$ a **toujours exactement** $n$ racines (admis). On ne manipulera pas les complexes plus loin dans ce cours.

### Compter les racines : réelles, complexes, multiples

Dans le « exactement $n$ », une racine **double** compte pour deux, une racine triple pour trois, etc.

**Exemple résolu :** combien de racines pour $P(x) = (x - 2)^2(x^2 + 4)$, de degré $4$ ?

| Facteur | Racines | Réelles ? | Compte |
|---|---|---|---|
| $(x - 2)^2$ | $2$, double | oui | $2$ |
| $x^2 + 4$ | $2i$ et $-2i$ (car $(2i)^2 = -4$) | non | $2$ |

- Racines réelles **différentes** : une seule ($2$). C'est bien au plus $4$.
- En comptant tout (complexes et multiplicité) : $2 + 2 = 4$, exactement le degré.

**À retenir :** réelles : **au plus** $n$ ; en comptant complexes et racines multiples : **exactement** $n$.

## 3. Factoriser à partir d'une racine connue

> [!tip] Propriété (admise)
> Si $x_0$ est une racine de $P$, alors on peut écrire $P(x) = (x - x_0)\,Q(x)$, où $Q$ est un polynôme de degré $\deg(P) - 1$.

Attention au signe : la racine $x_0 = 4$ donne le facteur $(x - 4)$, la racine $x_0 = -4$ donne $(x + 4)$. On vérifie en remplaçant : $(x - x_0)$ vaut bien $0$ en $x = x_0$.

On obtient $Q$ par **division euclidienne** de $P$ par $(x - x_0)$, comme on divise deux entiers. En pratique, le plus simple est souvent d'**identifier les coefficients** : on écrit $Q$ avec des coefficients inconnus, on développe $(x - x_0)\,Q(x)$, et on compare avec $P$ terme par terme.

**Exemple.** $P(x) = x^3 - 2x^2 - 5x + 6$.

1. On essaie des petites valeurs ($1$, $-1$, $2$, $-2$…) : $P(1) = 1 - 2 - 5 + 6 = 0$. Donc $1$ est racine.
2. $P$ est de degré $3$, donc $Q$ est de degré $2$ : on cherche $Q(x) = ax^2 + bx + c$ tel que $(x - 1)(ax^2 + bx + c) = x^3 - 2x^2 - 5x + 6$.
3. On développe : $(x - 1)(ax^2 + bx + c) = ax^3 + bx^2 + cx - ax^2 - bx - c = ax^3 + (b - a)x^2 + (c - b)x - c$.
4. On identifie, du plus haut degré au terme constant :

| Terme | Développement | Dans $P$ | Conclusion |
|---|---|---|---|
| $x^3$ | $a$ | $1$ | $a = 1$ |
| $x^2$ | $b - a$ | $-2$ | $b = -2 + 1 = -1$ |
| constant | $-c$ | $6$ | $c = -6$ |
| $x$ (contrôle) | $c - b = -6 + 1$ | $-5$ | ça colle |

5. $Q(x) = x^2 - x - 6$ : $\Delta = 1 + 24 = 25$, racines $\dfrac{1 + 5}{2} = 3$ et $\dfrac{1 - 5}{2} = -2$.

Conclusion : $P(x) = (x - 1)(x - 3)(x + 2)$. Ses racines sont la racine connue $1$ **plus** celles de $Q$ : $\{-2, 1, 3\}$. Degré $3$, trois racines : le compte est bon.

**À retenir :** trouve une racine en essayant, développe $(x - x_0)(ax^2 + bx + c)$, identifie les coefficients, et n'oublie pas $x_0$ dans la liste finale des racines.

> [!tip] Pourquoi c'est utile
> Une racine trouvée (en essayant, ou par un calcul numérique) fait **baisser le degré** du problème. Un degré 3 devient un degré 2, qu'on sait résoudre.

## 4. Le problème de l'interpolation

On a $n + 1$ points $(x_0, y_0), \dots, (x_n, y_n)$, avec des $x_i$ **tous différents**. Existe-t-il un polynôme $P$ de degré au plus $n$ qui passe par tous ces points, c'est-à-dire $P(x_i) = y_i$ pour chaque $i$ ?

> [!tip] Réponse (admise)
> **Oui, et il est unique.** Deux points donnent une droite, trois points une parabole (degré au plus 2), etc.

C'est ce qu'on fait pour **reconstituer une courbe** à partir de quelques mesures : relevés d'un capteur, valeur manquante entre deux mesures.

**Exemple résolu :** par $(0, 1)$ et $(2, 5)$, quel polynôme de degré au plus $1$ ?

1. $2$ points, donc $n + 1 = 2$ et $n = 1$ : on cherche une droite $P(x) = mx + p$, et il y en a exactement une.
2. $P(0) = 1$ donne $p = 1$.
3. $P(2) = 5$ donne $2m + 1 = 5$, donc $m = 2$.
4. $P(x) = 2x + 1$.

On peut alors **estimer** une valeur : $P(1) = 3$. Comme $1$ est **entre** les mesures ($0$ et $2$), c'est une **interpolation**. Calculer $P(10) = 21$, **en dehors** des mesures, s'appelle une **extrapolation** : le calcul est le même, mais la valeur est bien moins fiable.

**À retenir :** $n + 1$ points d'abscisses différentes → un seul polynôme de degré au plus $n$ ; entre les mesures on interpole, en dehors on extrapole (avec prudence).

## 5. La méthode de Lagrange

L'idée : construire un petit polynôme $L_i$ pour chaque point, qui vaut $1$ en $x_i$ et $0$ en tous les autres $x_j$. Il « allume » le point $i$ et « éteint » les autres.

$$L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j} \qquad\qquad P(x) = \sum_{i=0}^{n} y_i\,L_i(x)$$

Le $\prod$ veut dire qu'on multiplie les fractions pour tous les $j$ différents de $i$. En clair :

- **numérateur** : le produit des $(x - x_j)$ pour tous les **autres** points (il s'annule en chacun d'eux) ;
- **dénominateur** : ce même produit, calculé en $x = x_i$ (pour que $L_i(x_i) = 1$).

**Exemple sur 2 points :** $(1, 2)$ et $(3, 8)$.

- $L_0(x) = \dfrac{x - 3}{1 - 3} = -\dfrac{x - 3}{2}$ : il vaut $1$ en $x = 1$ et $0$ en $x = 3$.
- $L_1(x) = \dfrac{x - 1}{3 - 1} = \dfrac{x - 1}{2}$ : il vaut $0$ en $x = 1$ et $1$ en $x = 3$.
- $P(x) = 2\,L_0(x) + 8\,L_1(x) = -(x - 3) + 4(x - 1) = -x + 3 + 4x - 4 = 3x - 1$.

Vérification : $P(1) = 2$ et $P(3) = 8$. Avec deux points, on retrouve la droite qui les relie (l'**interpolation linéaire**).

**Exemple résolu sur 3 points :** $(-1, 4)$, $(0, 1)$, $(1, 2)$.

1. $L_0$ (point $x_0 = -1$) : les autres points sont $0$ et $1$, numérateur $x(x - 1)$. En $x = -1$ : $(-1) \times (-2) = 2$. Donc $L_0(x) = \dfrac{x(x - 1)}{2}$.
2. $L_1$ (point $x_1 = 0$) : autres points $-1$ et $1$, numérateur $(x + 1)(x - 1)$. En $x = 0$ : $1 \times (-1) = -1$. Donc $L_1(x) = -(x + 1)(x - 1) = 1 - x^2$.
3. $L_2$ (point $x_2 = 1$) : autres points $-1$ et $0$, numérateur $(x + 1)x$. En $x = 1$ : $2 \times 1 = 2$. Donc $L_2(x) = \dfrac{x(x + 1)}{2}$.
4. On multiplie chacun par son $y_i$, on développe, et on range par puissance :

| Morceau | Développé | $x^2$ | $x$ | constante |
|---|---|---|---|---|
| $4\,L_0 = 2x(x - 1)$ | $2x^2 - 2x$ | $2$ | $-2$ | $0$ |
| $1\,L_1 = 1 - x^2$ | $-x^2 + 1$ | $-1$ | $0$ | $1$ |
| $2\,L_2 = x(x + 1)$ | $x^2 + x$ | $1$ | $1$ | $0$ |
| **Somme** | | $2$ | $-1$ | $1$ |

5. $P(x) = 2x^2 - x + 1$. Vérification : $P(-1) = 2 + 1 + 1 = 4$, $P(0) = 1$, $P(1) = 2 - 1 + 1 = 2$.

**À retenir :** pour chaque $L_i$, numérateur = « s'annule aux autres points », dénominateur = sa valeur au point qu'on allume (avec son signe) ; puis range les coefficients dans un tableau et vérifie chaque point.

> [!warning] Le piège
> Dans $L_i$, le dénominateur contient $x_i - x_j$ : c'est le $x$ **du point qu'on allume** moins les autres. Une erreur de signe ici fausse tout. Vérifie toujours $P(x_i) = y_i$ à la fin.

## 6. La méthode de Newton : les différences divisées

Newton donne **le même polynôme** que Lagrange, mais se calcule petit à petit.

- **Ordre 1** : la pente entre deux points voisins, $f[x_i, x_{i+1}] = \dfrac{y_{i+1} - y_i}{x_{i+1} - x_i}$.
- **Ordre 2** : la « pente des pentes », $f[x_i, x_{i+1}, x_{i+2}] = \dfrac{f[x_{i+1}, x_{i+2}] - f[x_i, x_{i+1}]}{x_{i+2} - x_i}$.
- Et ainsi de suite pour les ordres supérieurs.

Au dénominateur, on met toujours l'écart entre le **premier et le dernier** $x$ utilisés : $x_{i+1} - x_i$ à l'ordre 1, $x_{i+2} - x_i$ à l'ordre 2, $x_{i+3} - x_i$ à l'ordre 3.

On range ces valeurs en colonnes. La **première valeur de chaque colonne** donne un coefficient :

$$P(x) = y_0 + f[x_0, x_1]\,(x - x_0) + f[x_0, x_1, x_2]\,(x - x_0)(x - x_1) + \dots$$

Chaque coefficient multiplie le produit des $(x - x_j)$ de **tous les points précédents**.

**Exemple :** $(0, 2)$, $(1, 3)$, $(2, 6)$.

| $x_i$ | $y_i$ | ordre 1 | ordre 2 |
|---|---|---|---|
| $0$ | $\mathbf{2}$ | | |
| | | $\dfrac{3 - 2}{1 - 0} = \mathbf{1}$ | |
| $1$ | $3$ | | $\dfrac{3 - 1}{2 - 0} = \mathbf{1}$ |
| | | $\dfrac{6 - 3}{2 - 1} = 3$ | |
| $2$ | $6$ | | |

D'où $P(x) = 2 + 1 \cdot x + 1 \cdot x(x - 1)$. On développe : $x(x - 1) = x^2 - x$, donc $P(x) = 2 + x + x^2 - x = x^2 + 2$. Vérification : $P(0) = 2$, $P(1) = 3$, $P(2) = 6$.

Pièges : à l'ordre 2 on divise par $2 - 0$, pas par $2 - 1$ ; et $x(x - 1)$ n'est pas $x^2$ (il ne faut pas oublier le $-x$).

### L'avantage : ajouter un point sans tout refaire

Une nouvelle mesure arrive : $(3, 11)$. On ajoute **une ligne** au tableau :

- nouvelle pente : $\dfrac{11 - 6}{3 - 2} = 5$ ;
- nouvel ordre 2 : $\dfrac{5 - 3}{3 - 1} = 1$ ;
- nouvel ordre 3 : $\dfrac{1 - 1}{3 - 0} = 0$.

Le nouveau coefficient est $0$ : le terme $0 \cdot x(x-1)(x-2)$ n'ajoute rien, et $P(x) = x^2 + 2$ reste valable (en effet $3^2 + 2 = 11$).

**Exemple résolu : et si la mesure avait été $(3, 14)$ ?**

1. Nouvelle pente : $\dfrac{14 - 6}{3 - 2} = 8$.
2. Nouvel ordre 2 : $\dfrac{8 - 3}{3 - 1} = \dfrac{5}{2} = 2{,}5$.
3. Ordre 3 : $\dfrac{2{,}5 - 1}{3 - 0} = \dfrac{1{,}5}{3} = 0{,}5$.
4. On **ajoute un terme**, sans toucher au reste : $P(x) = x^2 + 2 + 0{,}5\,x(x - 1)(x - 2)$.
5. Vérification : $P(3) = 11 + 0{,}5 \times 3 \times 2 \times 1 = 11 + 3 = 14$.

**À retenir :** une nouvelle mesure = une nouvelle ligne de calcul et un terme de plus ; un coefficient nul veut dire que le point était déjà sur la courbe.

> [!info] Données qui arrivent au fil de l'eau
> Avec Lagrange, un nouveau point oblige à tout recalculer. Avec Newton, chaque mesure ajoute seulement une ligne de calcul : pratique sur un flux de données.

## 7. Développements limités

Près d'un point, on peut **approcher une fonction par un polynôme**. Plus on garde de termes, plus l'approximation est bonne. La formule de Taylor (admise) au voisinage de $0$, à l'ordre 2 :

$$f(x) \approx f(0) + f'(0)\,x + \frac{f''(0)}{2}\,x^2$$

À l'**ordre 1**, on ne garde que $f(0) + f'(0)\,x$ : c'est exactement l'équation de la **tangente** en $0$ (la tangente en $a$ a pour équation $y = f(a) + f'(a)(x - a)$, et ici $a = 0$). Le terme en $x^2$ corrige ensuite la courbure.

```anim
tangente
fonction: exp
titre: Le développement limité d'ordre 1, c'est la tangente
consigne: Place le point en x = 0 : la tangente à la courbe de exp est la droite y = 1 + x. Tout près de 0, elle colle à la courbe ; plus loin, elle s'en écarte.
```

### Les trois DL à connaître (ordre 2, en 0)

$$e^x \approx 1 + x + \frac{x^2}{2} \qquad \ln(1 + x) \approx x - \frac{x^2}{2} \qquad \frac{1}{1 - x} \approx 1 + x + x^2$$

Ils viennent tous de la formule de Taylor :

| Fonction | $f(0)$ | $f'(0)$ | $f''(0)$ | $\dfrac{f''(0)}{2}$ |
|---|---|---|---|---|
| $e^x$ (ses dérivées sont toutes $e^x$) | $1$ | $1$ | $1$ | $\dfrac{1}{2}$ |
| $\ln(1 + x)$, $f' = \dfrac{1}{1 + x}$, $f'' = -\dfrac{1}{(1 + x)^2}$ | $\ln 1 = 0$ | $1$ | $-1$ | $-\dfrac{1}{2}$ |
| $\dfrac{1}{1 - x}$, $f' = \dfrac{1}{(1 - x)^2}$, $f'' = \dfrac{2}{(1 - x)^3}$ | $1$ | $1$ | $2$ | $1$ |

Pour s'en souvenir : $\ln(1 + x)$ n'a **pas de constante** et un **moins** devant $x^2$ ; $\dfrac{1}{1 - x}$ n'a **aucun** $\dfrac{1}{2}$.

**Exemple.** $e^{0{,}1} \approx 1 + 0{,}1 + \dfrac{0{,}01}{2} = 1{,}105$, alors que la vraie valeur est $1{,}10517\dots$ : erreur inférieure à $0{,}0002$.

**Exemple résolu : $\ln(0{,}9)$ et $\dfrac{1}{0{,}9}$.**

1. On écrit le nombre sous la forme du DL : $0{,}9 = 1 + (-0{,}1)$, donc pour le logarithme $x = -0{,}1$.
2. $\ln(0{,}9) \approx x - \dfrac{x^2}{2} = -0{,}1 - \dfrac{0{,}01}{2} = -0{,}1 - 0{,}005 = -0{,}105$ (vraie valeur : $-0{,}10536\dots$).
3. Pour l'inverse : $0{,}9 = 1 - 0{,}1$, donc $\dfrac{1}{0{,}9} = \dfrac{1}{1 - 0{,}1}$ avec $x = 0{,}1$.
4. $\dfrac{1}{1 - 0{,}1} \approx 1 + 0{,}1 + 0{,}01 = 1{,}11$ (vraie valeur : $1{,}111\dots$).

Le piège : pour $\ln(a)$, c'est $x = a - 1$ qui doit être proche de $0$, pas $a$ lui-même.

**À retenir :** mets le nombre sous la forme $e^x$, $\ln(1 + x)$ ou $\dfrac{1}{1 - x}$, repère $x$ (petit), puis remplace dans la formule.

### Construire un DL avec la formule de Taylor

Pour une autre fonction, on calcule $f(0)$, $f'(0)$ et $f''(0)$, puis on remplace. Deux dérivées utiles :

- $(e^{kx})' = k\,e^{kx}$ (règle de la chaîne : un facteur $k$ sort à chaque dérivation) ;
- $\left((1 + x)^{p}\right)' = p\,(1 + x)^{p - 1}$, pour n'importe quel exposant $p$ (même négatif ou fractionnaire).

**Exemple résolu :** DL d'ordre 2 en $0$ de $f(x) = \sqrt{1 + x} = (1 + x)^{1/2}$.

| Quantité | Calcul | Valeur en $0$ |
|---|---|---|
| $f(x)$ | $(1 + x)^{1/2}$ | $1$ |
| $f'(x)$ | $\dfrac{1}{2}(1 + x)^{-1/2}$ | $\dfrac{1}{2}$ |
| $f''(x)$ | $\dfrac{1}{2} \times \left(-\dfrac{1}{2}\right)(1 + x)^{-3/2}$ | $-\dfrac{1}{4}$ |

Taylor : $1 + \dfrac{1}{2}x + \dfrac{-1/4}{2}x^2 = 1 + \dfrac{x}{2} - \dfrac{x^2}{8}$. Contrôle : $\sqrt{1{,}1} \approx 1 + 0{,}05 - 0{,}00125 = 1{,}04875$, et la vraie valeur est $1{,}04881\dots$

**Raccourci par substitution :** on peut aussi remplacer $x$ par une expression dans un DL connu. Par exemple $e^{-x}$ : dans $e^u \approx 1 + u + \dfrac{u^2}{2}$, on pose $u = -x$, d'où $e^{-x} \approx 1 - x + \dfrac{(-x)^2}{2} = 1 - x + \dfrac{x^2}{2}$. Attention aux carrés : $(kx)^2 = k^2 x^2$.

**À retenir :** calcule $f(0)$, $f'(0)$, $f''(0)$ dans un tableau, **divise $f''(0)$ par $2$**, et contrôle si possible par substitution.

> [!info] Un air de déjà-vu
> Ces formules sont les débuts de séries vues à la séance précédente : $e^x = \sum \frac{x^n}{n!}$ et $\frac{1}{1-x} = \sum x^n$ (série géométrique, pour $\lvert x \rvert < 1$). Un DL, c'est une série entière qu'on coupe après quelques termes.

> [!warning] Valable seulement près de 0
> En $x = 3$ : $1 + 3 + \dfrac{9}{2} = 8{,}5$, alors que $e^3 \approx 20{,}1$. Loin du point de développement, l'approximation ne vaut plus rien.

## 8. Mesurer l'erreur : le reste de Taylor

On peut écrire l'égalité exacte (admise) :

$$f(x) = \underbrace{f(0) + f'(0)\,x + \frac{f''(0)}{2}\,x^2}_{\text{DL d'ordre 2}} + \underbrace{R_2(x)}_{\text{reste}}$$

Le **reste** $R_2(x)$ est de l'ordre de $x^3$ quand $x$ est proche de $0$ : on note $R_2(x) = O(x^3)$.

- Quand $x$ est petit, $x^3$ est **beaucoup** plus petit que $x$ et $x^2$ : pour $x = 0{,}1$, $x^3 = 0{,}001$. L'erreur est minuscule.
- Quand $x$ grandit, $x^3$ explose : l'approximation se dégrade. C'est ce qu'on voit sur le graphique quand la courbe et son approximation s'écartent.

Le premier terme oublié donne une idée du reste : $\dfrac{x^3}{6}$ pour $e^x$, $\dfrac{x^3}{3}$ pour $\ln(1 + x)$, $x^3$ pour $\dfrac{1}{1 - x}$.

**Exemple.** Pour $\ln(1 + x)$, le reste à l'ordre 2 est de l'ordre de $\dfrac{x^3}{3}$. Avec $x = 0{,}1$ : $\dfrac{0{,}001}{3} \approx 0{,}0003$. Le DL donne $0{,}1 - 0{,}005 = 0{,}095$, et la vraie valeur est $\ln(1{,}1) \approx 0{,}0953$ : l'écart réel ($0{,}0003$) a bien cet ordre de grandeur.

### Écart, erreur relative, ordre de grandeur

- **Écart** (erreur) : $\lvert \text{vraie valeur} - \text{approximation} \rvert$.
- **Erreur relative** : l'écart divisé par la vraie valeur, souvent en pourcentage.
- **Même ordre de grandeur** : deux nombres ont à peu près la même taille (même nombre de zéros après la virgule), par exemple $0{,}0003$ et $0{,}0005$. Le reste ne donne pas l'erreur exacte, seulement son ordre de grandeur.

**Exemple résolu : avec $x = 0{,}1$, quelle approximation est la moins précise ?**

| Nombre | Vraie valeur | DL | Écart | Terme oublié |
|---|---|---|---|---|
| $e^{0{,}1}$ | $1{,}10517$ | $1{,}105$ | $0{,}00017$ | $\dfrac{x^3}{6} \approx 0{,}00017$ |
| $\dfrac{1}{1 - 0{,}1}$ | $1{,}11111$ | $1{,}11$ | $0{,}00111$ | $x^3 = 0{,}001$ |

1. On calcule chaque écart (vraie valeur moins DL).
2. Le plus grand écart est $0{,}00111$ : c'est $\dfrac{1}{1 - 0{,}1}$ la moins précise.
3. Explication : son terme oublié $x^3$ n'est divisé par rien, alors que celui de $e^x$ est divisé par $6$.
4. Chaque écart est du même ordre que le terme oublié : c'est cohérent.

Et pour l'exemple de $e^3$ : écart $\approx 20{,}1 - 8{,}5 = 11{,}6$, soit une erreur relative de $\dfrac{11{,}6}{20{,}1} \approx 58\,\%$. Inutilisable.

Le signe de l'écart dit aussi dans quel sens le DL se trompe : si la vraie valeur est plus grande que le DL, le DL est **trop bas** (le terme oublié était positif).

**À retenir :** écart = vraie valeur moins approximation ; pour comparer des approximations, calcule tous les écarts et prends le plus grand ; le reste donne l'ordre de grandeur attendu.

> [!tip] À quoi ça sert
> Remplacer une fonction coûteuse (exponentielle, logarithme, fonction d'activation) par un polynôme accélère les calculs. Le reste dit **jusqu'où on peut faire confiance** à cette approximation.

## 9. Régression et sur-ajustement

| | Interpolation | Régression (lissage) |
|---|---|---|
| Nombre de points | peu | beaucoup |
| Données | fiables, sans bruit | bruitées |
| Le polynôme… | passe **exactement** par chaque point | passe **au plus près** des points, sans forcément les toucher |
| But | reconstituer une courbe | dégager la tendance sans coller au bruit |

Le **bruit**, ce sont les petites erreurs au hasard contenues dans chaque mesure (capteur imprécis, arrondi, perturbation).

> [!warning] Le sur-ajustement
> Un polynôme de degré très élevé peut passer **exactement** par tous les points connus, mais il **oscille violemment** entre eux. Il « apprend par cœur » le bruit des mesures au lieu de la tendance, et prédit très mal les nouveaux points. En machine learning, c'est l'**overfitting**. Remède : un degré plus faible et une régression plutôt qu'une interpolation exacte.

**Exemple résolu : quelle méthode choisir ?**

| Situation | Combien de points ? | Fiables ou bruités ? | Choix |
|---|---|---|---|
| $4$ relevés d'un appareil de précision, on veut une valeur entre deux relevés | peu | fiables | interpolation (degré au plus $3$) |
| $1000$ chiffres de ventes journalières, très irréguliers | beaucoup | bruités | régression de petit degré ($1$ ou $2$) |

Pour la deuxième ligne, un polynôme de degré $999$ passerait par les $1000$ points (c'est possible), mais il oscillerait entre eux : sur-ajustement. Proposer un degré encore plus grand aggraverait le problème, et changer de méthode d'interpolation (Lagrange ou Newton) ne sert à rien, puisqu'elles donnent le même polynôme.

**À retenir :** peu de points fiables → interpolation ; beaucoup de points bruités → régression de petit degré, pour suivre la tendance et pas le bruit.

## À retenir

> [!tip] L'essentiel
> - Degré $n$ : au plus $n$ racines réelles, exactement $n$ en comptant les complexes.
> - $\Delta < 0$ : deux racines complexes conjuguées $\alpha \pm i\beta$, avec $i^2 = -1$.
> - $x_0$ racine $\Rightarrow P(x) = (x - x_0)\,Q(x)$, avec $\deg Q = \deg P - 1$.
> - $n + 1$ points (abscisses distinctes) : un **unique** polynôme de degré au plus $n$ passe par eux. Lagrange le donne d'un coup, Newton point par point.
> - DL en $0$ : $e^x \approx 1 + x + \frac{x^2}{2}$, $\ln(1+x) \approx x - \frac{x^2}{2}$, $\frac{1}{1-x} \approx 1 + x + x^2$, avec une erreur en $O(x^3)$.

> [!warning] Les pièges
> - Un DL n'est bon **que près du point** de développement.
> - Le $\frac{f''(0)}{2}$ : ne pas oublier de diviser par $2$.
> - Interpoler beaucoup de points bruités avec un polynôme de grand degré, c'est du sur-ajustement.
