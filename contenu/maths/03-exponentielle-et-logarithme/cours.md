# Exponentielle et logarithme

Ces deux fonctions sont partout en informatique : croissance d'un volume de données, complexité d'un algorithme, fonction de perte d'un modèle de machine learning. Le but de ce chapitre : connaître leurs propriétés **par cœur** et les manipuler vite, sans les redémontrer.

## 1. L'exponentielle

La fonction exponentielle se note $x \mapsto e^x$ (ou $\exp(x)$). Elle est définie pour **tout** réel $x$ et donne toujours un résultat **strictement positif** : $e^x > 0$.

Le nombre $e$ vaut environ $2{,}718$.

### Les règles de calcul

$$e^{a+b} = e^a \times e^b \qquad e^{a-b} = \frac{e^a}{e^b} \qquad e^{-a} = \frac{1}{e^a} \qquad (e^a)^n = e^{na} \qquad e^0 = 1$$

> [!tip] Le réflexe
> L'exponentielle transforme une **somme** (dans l'exposant) en **produit**. Exemple : $e^3 \times e^{-1} = e^{3 + (-1)} = e^2$.

> [!warning] Piège classique
> $e^{a+b} \neq e^a + e^b$. Par exemple $e^{1+1} = e^2 \approx 7{,}39$ alors que $e^1 + e^1 \approx 5{,}44$.

### Variations et limites

- $\exp$ est **strictement croissante** sur $\mathbb{R}$ : si $a < b$ alors $e^a < e^b$.
- $\lim\limits_{x \to +\infty} e^x = +\infty$ et $\lim\limits_{x \to -\infty} e^x = 0$.
- Sa dérivée est elle-même : $(e^x)' = e^x$.
- Pour une composée : $\left(e^{u(x)}\right)' = u'(x)\, e^{u(x)}$. Exemple : $\left(e^{3x^2}\right)' = 6x\,e^{3x^2}$.

## 2. Le logarithme népérien

La fonction $\ln$ est la **réciproque** de l'exponentielle : elle « défait » ce que fait $\exp$.

$$\ln(e^x) = x \quad \text{pour tout réel } x \qquad\qquad e^{\ln x} = x \quad \text{pour } x > 0$$

> [!warning] Le domaine
> $\ln x$ n'existe que pour $x > 0$. $\ln(0)$ et $\ln(-3)$ n'ont **aucun sens**. Avant de résoudre une équation avec $\ln$, on écrit toujours la condition sur $x$.

### Les règles de calcul (pour $a > 0$ et $b > 0$)

$$\ln(ab) = \ln a + \ln b \qquad \ln\frac{a}{b} = \ln a - \ln b \qquad \ln(a^n) = n \ln a$$

$$\ln 1 = 0 \qquad \ln e = 1 \qquad \ln\frac{1}{a} = -\ln a$$

> [!tip] Le réflexe
> Le logarithme transforme un **produit** en **somme**. Exemple : $2\ln 3 + \ln 2 = \ln(3^2) + \ln 2 = \ln(9 \times 2) = \ln 18$.

> [!warning] Piège classique
> $\ln(a + b) \neq \ln a + \ln b$. Il n'existe **aucune** formule pour le logarithme d'une somme.

### Variations et limites

- $\ln$ est **strictement croissante** sur $]0, +\infty[$.
- $\lim\limits_{x \to +\infty} \ln x = +\infty$ (mais **très lentement**) et $\lim\limits_{x \to 0^+} \ln x = -\infty$.
- Sa dérivée : $(\ln x)' = \dfrac{1}{x}$. Pour une composée : $\left(\ln u(x)\right)' = \dfrac{u'(x)}{u(x)}$.
- Signe : $\ln x < 0$ si $0 < x < 1$, $\ln x = 0$ si $x = 1$, $\ln x > 0$ si $x > 1$.

## 3. Le logarithme en base $a$

Pour $a > 0$ et $a \neq 1$ :

$$\log_a(x) = \frac{\ln x}{\ln a}$$

Il répond à la question : « à quelle puissance faut-il élever $a$ pour obtenir $x$ ? ». Donc $\log_a(a^n) = n$, $\log_a(a) = 1$ et $\log_a(1) = 0$.

| Base | Notation | Exemple | Usage |
|---|---|---|---|
| $e$ | $\ln$ | $\ln(e^3) = 3$ | maths, physique, machine learning |
| $10$ | $\log_{10}$ | $\log_{10}(1000) = 3$ | ordres de grandeur, décibels |
| $2$ | $\log_2$ | $\log_2(8) = 3$ | informatique |

> [!info] $\log_2$ en informatique
> $\log_2(n)$ est le nombre de fois qu'on peut **diviser $n$ par 2** avant d'arriver à 1. C'est le nombre d'étapes d'une **recherche dichotomique** dans un tableau trié, ou la profondeur d'un arbre binaire équilibré. Avec $n = 1\,000\,000$ : environ $20$ étapes seulement.

## 4. Résoudre des équations et des inéquations

On « enlève » une exponentielle en appliquant $\ln$ des deux côtés, et on « enlève » un $\ln$ en appliquant $\exp$.

| À résoudre | Solution |
|---|---|
| $e^x = a$ (avec $a > 0$) | $x = \ln a$ |
| $\ln x = b$ | $x = e^b$ |
| $e^x > a$ (avec $a > 0$) | $x > \ln a$ |
| $\ln x \le b$ | $0 < x \le e^b$ |

Comme $\exp$ et $\ln$ sont **strictement croissantes**, elles ne changent pas le sens d'une inégalité.

**Exemple.** $e^{2x-1} = 7 \iff 2x - 1 = \ln 7 \iff x = \dfrac{1 + \ln 7}{2}$.

**Exemple avec domaine.** $\ln x + \ln(x - 3) = \ln 4$.
1. Condition : $x > 0$ **et** $x - 3 > 0$, donc $x > 3$.
2. On regroupe : $\ln\big(x(x-3)\big) = \ln 4$, donc $x^2 - 3x - 4 = 0$.
3. Solutions de l'équation du second degré : $x = 4$ ou $x = -1$.
4. Seule $x = 4$ respecte la condition $x > 3$.

> [!warning] Ne pas oublier
> Une « solution » qui ne respecte pas le domaine doit être **éliminée**. Ici $x = -1$ rendrait $\ln(-1)$ et $\ln(-4)$ impossibles.

## 5. Croissances comparées

Quand $x \to +\infty$, les trois fonctions tendent vers $+\infty$, mais pas à la même vitesse :

$$\ln x \ll x \ll e^x \qquad \text{c'est-à-dire} \qquad \lim_{x \to +\infty} \frac{\ln x}{x} = 0 \qquad \lim_{x \to +\infty} \frac{x}{e^x} = 0$$

Le symbole $\ll$ se lit « est négligeable devant ».

### Le lien avec la complexité des algorithmes

$$O(\log n) \ll O(n) \ll O(n \log n) \ll O(n^2) \ll O(2^n)$$

| $n$ | $\log_2 n$ | $n^2$ | $2^n$ |
|---|---|---|---|
| $10$ | $\approx 3$ | $100$ | $1\,024$ |
| $1\,000$ | $\approx 10$ | $10^6$ | nombre à 302 chiffres |
| $1\,000\,000$ | $\approx 20$ | $10^{12}$ | impossible à calculer |

> [!tip] À retenir
> Un algorithme en $O(\log n)$ reste rapide avec des milliards de données. Un algorithme en $O(2^n)$ devient impraticable dès que $n$ dépasse quelques dizaines.

## 6. Convexité

- **Convexe** : la courbe est **en dessous** de ses cordes (elle « sourit »). C'est le cas quand la dérivée seconde est positive.
- **Concave** : la courbe est **au-dessus** de ses cordes. Dérivée seconde négative.

| Fonction | Dérivée seconde | Forme |
|---|---|---|
| $e^x$ | $e^x > 0$ | convexe |
| $\ln x$ | $-\dfrac{1}{x^2} < 0$ | concave |
| $-\ln x$ | $\dfrac{1}{x^2} > 0$ | convexe |

En machine learning, une fonction de perte **convexe** n'a qu'un seul « creux » : la descente de gradient trouve à coup sûr le meilleur réglage.

## 7. Applications en informatique et en IA

### Croissance exponentielle

Une quantité qui **double** toutes les $T$ unités de temps s'écrit :

$$Q(t) = Q_0 \times 2^{t/T} = Q_0 \, e^{kt} \qquad \text{avec } k = \frac{\ln 2}{T}$$

Exemple : 100 Go qui doublent tous les 6 mois donnent $Q(t) = 100 \times 2^{t/6}$ (avec $t$ en mois). Pour savoir quand on dépasse un seuil, on passe au $\ln$.

### Linéariser une relation

Si $y = a\,e^{bx}$, alors en posant $z = \ln y$ :

$$z = \ln a + b\,x$$

C'est une **droite** en fonction de $x$ (pente $b$, ordonnée à l'origine $\ln a$). D'où les graphiques en **échelle logarithmique** : une croissance exponentielle y apparaît comme une droite, beaucoup plus facile à reconnaître à l'œil.

### La log-loss (entropie croisée)

Pour un modèle qui prédit la probabilité $\hat{p}$ qu'une donnée soit de classe $1$, avec $y \in \{0, 1\}$ la vraie classe :

$$\text{perte}(\hat{p}, y) = -\big(y \ln \hat{p} + (1 - y)\ln(1 - \hat{p})\big)$$

- Si $y = 1$, la perte vaut $-\ln \hat{p}$ : proche de $0$ si $\hat{p}$ est proche de $1$, énorme si $\hat{p}$ est proche de $0$.
- Un modèle **sûr de lui et qui se trompe** est très lourdement pénalisé.

## 8. Étude de fonction guidée : $f(x) = \dfrac{\ln x}{x}$ sur $]0, +\infty[$

1. **Dérivée** (règle du quotient) : $f'(x) = \dfrac{\frac{1}{x} \times x - \ln x \times 1}{x^2} = \dfrac{1 - \ln x}{x^2}$.
2. **Signe** : $x^2 > 0$, donc $f'(x)$ a le signe de $1 - \ln x$ : positif si $x < e$, négatif si $x > e$.
3. **Variations** : $f$ croît sur $]0, e]$ puis décroît sur $[e, +\infty[$. Son maximum vaut $f(e) = \dfrac{1}{e}$.
4. **Limites** : $\lim\limits_{x \to 0^+} f(x) = -\infty$ et $\lim\limits_{x \to +\infty} f(x) = 0$ (croissances comparées).

> [!tip] Méthode type pour étudier une fonction
> Dérivée, signe de la dérivée, tableau de variations, limites aux bornes.

## À retenir

> [!tip] Les formules
> - $\exp$ : somme vers produit, $(e^x)' = e^x$, toujours positive, convexe.
> - $\ln$ : produit vers somme, $(\ln x)' = \frac{1}{x}$, définie pour $x > 0$, concave.
> - $\log_a x = \frac{\ln x}{\ln a}$.
> - $\exp$ et $\ln$ sont réciproques : l'une défait l'autre.

> [!warning] Les pièges
> - $e^{a+b} \neq e^a + e^b$ et $\ln(a+b) \neq \ln a + \ln b$.
> - $\ln$ n'existe que pour $x > 0$ : vérifier le domaine et éliminer les fausses solutions.
> - Dans une composée, ne pas oublier la dérivée de l'intérieur : $(e^{3x})' = 3e^{3x}$.
