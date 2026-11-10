# Polynômes, interpolation et développements limités

Les **polynômes** sont les fonctions les plus simples à calculer : uniquement des additions et des multiplications. C'est pour ça qu'on s'en sert partout en calcul numérique : pour **faire passer une courbe par des mesures** (interpolation), pour **remplacer une fonction compliquée** par une plus simple près d'un point (développement limité), ou pour **lisser des données bruitées** (régression).

## 1. Rappels sur les polynômes

Un polynôme de **degré** $n$ s'écrit

$$P(x) = a_n x^n + \dots + a_1 x + a_0 \qquad \text{avec } a_n \neq 0.$$

Les nombres $a_0, \dots, a_n$ sont les **coefficients**. Une **racine** de $P$ est un nombre $x_0$ tel que $P(x_0) = 0$ : c'est là que la courbe coupe l'axe horizontal.

> [!tip] À retenir (admis)
> Un polynôme de degré $n$ a **au plus** $n$ racines réelles.

**Exemple.** $P(x) = x^2 - 5x + 6$ est de degré $2$. Il a deux racines, $2$ et $3$ : $P(2) = 4 - 10 + 6 = 0$ et $P(3) = 9 - 15 + 6 = 0$.

> [!info] Un peu d'histoire
> Au XIXᵉ siècle, Évariste Galois s'est demandé quelles équations polynomiales peuvent se résoudre avec des racines carrées, cubiques, etc. Ses travaux ont donné naissance à toute une branche des maths (la théorie de Galois), bien au-delà de ce cours.

## 2. Racines réelles et racines complexes

Pour $ax^2 + bx + c = 0$, on calcule le **discriminant** $\Delta = b^2 - 4ac$.

| Signe de $\Delta$ | Solutions |
|---|---|
| $\Delta > 0$ | deux racines réelles $x = \dfrac{-b \pm \sqrt{\Delta}}{2a}$ |
| $\Delta = 0$ | une racine double $x = -\dfrac{b}{2a}$ |
| $\Delta < 0$ | aucune racine **réelle**, mais deux racines **complexes** |

Quand $\Delta < 0$, on ne peut pas prendre $\sqrt{\Delta}$ dans les réels. On introduit un nombre $i$ tel que $i^2 = -1$, et les deux solutions s'écrivent

$$x = \frac{-b \pm i\sqrt{-\Delta}}{2a}.$$

Elles sont **conjuguées** : même partie $\alpha = -\dfrac{b}{2a}$, et $\pm\beta$ avec $\beta = \dfrac{\sqrt{-\Delta}}{2a}$. On les note $x = \alpha \pm i\beta$.

**Exemple.** $x^2 - 2x + 10 = 0$ : $\Delta = 4 - 40 = -36$, donc $\sqrt{-\Delta} = 6$ et $x = \dfrac{2 \pm 6i}{2} = 1 \pm 3i$.

> [!info] Ce qu'il faut en retenir
> « Pas de racine réelle » ne veut pas dire « pas de racine du tout » : les racines sont simplement sorties des réels. En comptant les racines complexes, un polynôme de degré $n$ a **toujours exactement** $n$ racines (admis). On ne manipulera pas les complexes plus loin dans ce cours.

## 3. Factoriser à partir d'une racine connue

> [!tip] Propriété (admise)
> Si $x_0$ est une racine de $P$, alors on peut écrire $P(x) = (x - x_0)\,Q(x)$, où $Q$ est un polynôme de degré $\deg(P) - 1$.

On obtient $Q$ par **division euclidienne** de $P$ par $(x - x_0)$, comme on divise deux entiers. En pratique, le plus simple est souvent d'**identifier les coefficients**.

**Exemple.** $P(x) = x^3 - 2x^2 - 5x + 6$.

1. On essaie des petites valeurs : $P(1) = 1 - 2 - 5 + 6 = 0$. Donc $1$ est racine.
2. On cherche $Q(x) = ax^2 + bx + c$ tel que $(x - 1)(ax^2 + bx + c) = x^3 - 2x^2 - 5x + 6$. En développant : $ax^3 + (b - a)x^2 + (c - b)x - c$.
3. On identifie : $a = 1$, $b - a = -2$ donc $b = -1$, $-c = 6$ donc $c = -6$ (et on vérifie $c - b = -5$).
4. $Q(x) = x^2 - x - 6$, dont les racines sont $3$ et $-2$ (discriminant $25$).

Conclusion : $P(x) = (x - 1)(x - 3)(x + 2)$.

> [!tip] Pourquoi c'est utile
> Une racine trouvée (en essayant, ou par un calcul numérique) fait **baisser le degré** du problème. Un degré 3 devient un degré 2, qu'on sait résoudre.

## 4. Le problème de l'interpolation

On a $n + 1$ points $(x_0, y_0), \dots, (x_n, y_n)$, avec des $x_i$ **tous différents**. Existe-t-il un polynôme $P$ de degré au plus $n$ qui passe par tous ces points, c'est-à-dire $P(x_i) = y_i$ pour chaque $i$ ?

> [!tip] Réponse (admise)
> **Oui, et il est unique.** Deux points donnent une droite, trois points une parabole (degré au plus 2), etc.

C'est ce qu'on fait pour **reconstituer une courbe** à partir de quelques mesures : relevés d'un capteur, valeur manquante entre deux mesures.

## 5. La méthode de Lagrange

L'idée : construire un petit polynôme $L_i$ pour chaque point, qui vaut $1$ en $x_i$ et $0$ en tous les autres $x_j$. Il « allume » le point $i$ et « éteint » les autres.

$$L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j} \qquad\qquad P(x) = \sum_{i=0}^{n} y_i\,L_i(x)$$

Le $\prod$ veut dire qu'on multiplie les fractions pour tous les $j$ différents de $i$.

**Exemple sur 2 points :** $(1, 2)$ et $(3, 8)$.

- $L_0(x) = \dfrac{x - 3}{1 - 3} = -\dfrac{x - 3}{2}$ : il vaut $1$ en $x = 1$ et $0$ en $x = 3$.
- $L_1(x) = \dfrac{x - 1}{3 - 1} = \dfrac{x - 1}{2}$ : il vaut $0$ en $x = 1$ et $1$ en $x = 3$.
- $P(x) = 2\,L_0(x) + 8\,L_1(x) = -(x - 3) + 4(x - 1) = 3x - 1$.

Vérification : $P(1) = 2$ et $P(3) = 8$. Avec deux points, on retrouve la droite qui les relie (l'**interpolation linéaire**).

> [!warning] Le piège
> Dans $L_i$, le dénominateur contient $x_i - x_j$ : c'est le $x$ **du point qu'on allume** moins les autres. Une erreur de signe ici fausse tout. Vérifie toujours $P(x_i) = y_i$ à la fin.

## 6. La méthode de Newton : les différences divisées

Newton donne **le même polynôme** que Lagrange, mais se calcule petit à petit.

- **Ordre 1** : la pente entre deux points voisins, $f[x_i, x_{i+1}] = \dfrac{y_{i+1} - y_i}{x_{i+1} - x_i}$.
- **Ordre 2** : la « pente des pentes », $f[x_i, x_{i+1}, x_{i+2}] = \dfrac{f[x_{i+1}, x_{i+2}] - f[x_i, x_{i+1}]}{x_{i+2} - x_i}$.
- Et ainsi de suite pour les ordres supérieurs.

On range ces valeurs en colonnes. La **première valeur de chaque colonne** donne un coefficient :

$$P(x) = y_0 + f[x_0, x_1]\,(x - x_0) + f[x_0, x_1, x_2]\,(x - x_0)(x - x_1) + \dots$$

**Exemple :** $(0, 2)$, $(1, 3)$, $(2, 6)$.

| $x_i$ | $y_i$ | ordre 1 | ordre 2 |
|---|---|---|---|
| $0$ | $\mathbf{2}$ | | |
| | | $\dfrac{3 - 2}{1 - 0} = \mathbf{1}$ | |
| $1$ | $3$ | | $\dfrac{3 - 1}{2 - 0} = \mathbf{1}$ |
| | | $\dfrac{6 - 3}{2 - 1} = 3$ | |
| $2$ | $6$ | | |

D'où $P(x) = 2 + 1 \cdot x + 1 \cdot x(x - 1) = x^2 + 2$. Vérification : $P(0) = 2$, $P(1) = 3$, $P(2) = 6$.

### L'avantage : ajouter un point sans tout refaire

Une nouvelle mesure arrive : $(3, 11)$. On ajoute **une ligne** au tableau :

- nouvelle pente : $\dfrac{11 - 6}{3 - 2} = 5$ ;
- nouvel ordre 2 : $\dfrac{5 - 3}{3 - 1} = 1$ ;
- nouvel ordre 3 : $\dfrac{1 - 1}{3 - 0} = 0$.

Le nouveau coefficient est $0$ : le terme $0 \cdot x(x-1)(x-2)$ n'ajoute rien, et $P(x) = x^2 + 2$ reste valable (en effet $3^2 + 2 = 11$).

> [!info] Données qui arrivent au fil de l'eau
> Avec Lagrange, un nouveau point oblige à tout recalculer. Avec Newton, chaque mesure ajoute seulement une ligne de calcul : pratique sur un flux de données.

## 7. Développements limités

Près d'un point, on peut **approcher une fonction par un polynôme**. Plus on garde de termes, plus l'approximation est bonne. La formule de Taylor (admise) au voisinage de $0$, à l'ordre 2 :

$$f(x) \approx f(0) + f'(0)\,x + \frac{f''(0)}{2}\,x^2$$

À l'**ordre 1**, on ne garde que $f(0) + f'(0)\,x$ : c'est exactement l'équation de la **tangente** en $0$. Le terme en $x^2$ corrige ensuite la courbure.

```anim
tangente
fonction: exp
titre: Le développement limité d'ordre 1, c'est la tangente
consigne: Place le point en x = 0 : la tangente à la courbe de exp est la droite y = 1 + x. Tout près de 0, elle colle à la courbe ; plus loin, elle s'en écarte.
```

### Les trois DL à connaître (ordre 2, en 0)

$$e^x \approx 1 + x + \frac{x^2}{2} \qquad \ln(1 + x) \approx x - \frac{x^2}{2} \qquad \frac{1}{1 - x} \approx 1 + x + x^2$$

**Exemple.** $e^{0{,}1} \approx 1 + 0{,}1 + \dfrac{0{,}01}{2} = 1{,}105$, alors que la vraie valeur est $1{,}10517\dots$ : erreur inférieure à $0{,}0002$.

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

**Exemple.** Pour $\ln(1 + x)$, le reste à l'ordre 2 est de l'ordre de $\dfrac{x^3}{3}$. Avec $x = 0{,}1$ : $\dfrac{0{,}001}{3} \approx 0{,}0003$. Le DL donne $0{,}1 - 0{,}005 = 0{,}095$, et la vraie valeur est $\ln(1{,}1) \approx 0{,}0953$ : l'écart réel ($0{,}0003$) a bien cet ordre de grandeur.

> [!tip] À quoi ça sert
> Remplacer une fonction coûteuse (exponentielle, logarithme, fonction d'activation) par un polynôme accélère les calculs. Le reste dit **jusqu'où on peut faire confiance** à cette approximation.

## 9. Régression et sur-ajustement

| | Interpolation | Régression (lissage) |
|---|---|---|
| Nombre de points | peu | beaucoup |
| Données | fiables, sans bruit | bruitées |
| Le polynôme… | passe **exactement** par chaque point | passe **au plus près** des points, sans forcément les toucher |
| But | reconstituer une courbe | dégager la tendance sans coller au bruit |

> [!warning] Le sur-ajustement
> Un polynôme de degré très élevé peut passer **exactement** par tous les points connus, mais il **oscille violemment** entre eux. Il « apprend par cœur » le bruit des mesures au lieu de la tendance, et prédit très mal les nouveaux points. En machine learning, c'est l'**overfitting**. Remède : un degré plus faible et une régression plutôt qu'une interpolation exacte.

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
