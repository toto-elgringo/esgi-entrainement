# Étude de fonctions

Ce chapitre remet en place les outils d'analyse : **continuité**, **dérivées**, **trigonométrie**, **primitives** et **intégrales**. En IA, ils servent à décrire une **fonction de coût** (combien le modèle se trompe) et à comprendre la **descente de gradient** (comment le modèle s'améliore).

## 1. Continuité

Une fonction est **continue** en un point $x_0$ si sa courbe n'a **pas de saut** en $x_0$ : on peut la tracer sans lever le crayon.

- Les **polynômes** ($x^2 - 3x + 1$, $5x^3 + x$...) sont continus sur $\mathbb{R}$ tout entier.
- Une **fraction** comme $\dfrac{1}{x-2}$ est continue partout où elle existe, c'est-à-dire sur $\mathbb{R} \setminus \{2\}$ (on enlève la valeur qui annule le dénominateur).
- $\ln$ est continue sur $]0, +\infty[$, et $e^x$ sur $\mathbb{R}$.
- Une fonction qui **n'est pas définie** en un point ne peut pas y être continue.

> [!info] Notation
> $\mathbb{R} \setminus \{2\}$ se lit « R privé de 2 » : tous les réels sauf 2.

En IA : une fonction de coût qui fait un saut brutal à un seuil rend l'optimisation difficile.

## 2. Dérivabilité

Une fonction est **dérivable** en $x_0$ si sa courbe a une **tangente bien définie** en ce point : pas de pointe, pas de saut. Le **nombre dérivé** $f'(x_0)$ est la **pente** de cette tangente.

$$f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$$

> [!warning] Dérivable ⇒ continue, mais pas l'inverse
> Une fonction dérivable est forcément continue. Mais une fonction continue peut ne pas être dérivable : $|x|$ est continue en 0, mais sa courbe fait une **pointe** (pente $-1$ à gauche, $+1$ à droite), donc pas de tangente unique.

### Dérivées à connaître

| $f(x)$ | $f'(x)$ |
|---|---|
| $c$ (constante) | $0$ |
| $x^n$ | $n\,x^{n-1}$ |
| $e^x$ | $e^x$ |
| $\ln x$ | $\dfrac{1}{x}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $1 + \tan^2 x = \dfrac{1}{\cos^2 x}$ |

### Règles de calcul

$$(u + v)' = u' + v' \qquad (k\,u)' = k\,u'$$

$$(uv)' = u'v + uv' \qquad \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}$$

$$\big(u(v(x))\big)' = v'(x) \times u'\big(v(x)\big)$$

La dernière règle est celle de la **composée** : on dérive « l'extérieur » en gardant « l'intérieur », puis on multiplie par la dérivée de l'intérieur.

Exemples :
- produit : $(x^2 \ln x)' = 2x \ln x + x^2 \times \dfrac{1}{x} = 2x\ln x + x$ ;
- quotient : $\left(\dfrac{x+1}{x-1}\right)' = \dfrac{1 \times (x-1) - (x+1) \times 1}{(x-1)^2} = \dfrac{-2}{(x-1)^2}$ ;
- composée : $(e^{3x^2})' = 6x\,e^{3x^2}$ (intérieur $3x^2$, de dérivée $6x$).

> [!tip] Lien avec l'IA
> La **descente de gradient** calcule la dérivée (le gradient) de la fonction de perte pour savoir dans quel sens corriger le modèle. Si la fonction n'est pas dérivable en un point, le gradient n'y existe pas. C'est pour ça que ReLU ($\max(0, x)$) utilise une convention en 0.

## 3. Trigonométrie

- $\sin$ et $\cos$ sont définies et continues sur $\mathbb{R}$, à valeurs dans $[-1, 1]$, et **périodiques** de période $2\pi$ (elles se répètent tous les $2\pi$).
- $\tan x = \dfrac{\sin x}{\cos x}$ n'est **pas définie** quand $\cos x = 0$, c'est-à-dire en $x = \dfrac{\pi}{2} + k\pi$ ($k$ entier). Sur $[0, 2\pi]$ : en $\dfrac{\pi}{2}$ et $\dfrac{3\pi}{2}$.

| $x$ | $0$ | $\dfrac{\pi}{2}$ | $\pi$ | $\dfrac{3\pi}{2}$ | $2\pi$ |
|---|---|---|---|---|---|
| $\sin x$ | $0$ | $1$ | $0$ | $-1$ | $0$ |
| $\cos x$ | $1$ | $0$ | $-1$ | $0$ | $1$ |

Exemple (composée) : $f(x) = \sin(3x^2)$, intérieur $3x^2$ : $f'(x) = 6x\cos(3x^2)$.

En IA : saisonnalité d'une série temporelle, signaux audio, encodages de position des Transformers.

## 4. Primitives

$F$ est une **primitive** de $f$ si $F' = f$. C'est l'opération inverse de la dérivée.

Il y en a une infinité : si $F$ est une primitive, $F + C$ aussi, pour toute **constante** $C$.

| $f(x)$ | Une primitive $F(x)$ |
|---|---|
| $k$ (constante) | $kx$ |
| $x^n$ ($n \neq -1$) | $\dfrac{x^{n+1}}{n+1}$ |
| $\dfrac{1}{x}$ ($x > 0$) | $\ln x$ |
| $e^x$ | $e^x$ |
| $e^{ax}$ ($a \neq 0$) | $\dfrac{1}{a}e^{ax}$ |
| $\sin x$ | $-\cos x$ |
| $\cos x$ | $\sin x$ |

> [!warning] Le cas $n = -1$
> $x^{-1} = \dfrac{1}{x}$ n'a pas pour primitive $\dfrac{x^0}{0}$ (division par zéro !) mais $\ln x$.

> [!tip] Vérifier une primitive
> Dérive ta réponse : tu dois retomber exactement sur $f$.

## 5. Intégrales

$$\int_a^b f(x)\,dx = F(b) - F(a) = \Big[F(x)\Big]_a^b$$

où $F$ est n'importe quelle primitive de $f$ (la constante $C$ s'annule dans la soustraction).

L'intégrale est l'**aire algébrique** entre la courbe et l'axe horizontal : les parties au-dessus de l'axe comptent en positif, celles en dessous en négatif.

Exemple : $\displaystyle\int_1^3 (2x + 1)\,dx$. Une primitive est $F(x) = x^2 + x$, donc $F(3) - F(1) = 12 - 2 = 10$.

Exemple d'aire : $\displaystyle\int_0^4 x\,dx = \left[\frac{x^2}{2}\right]_0^4 = 8$, c'est l'aire du triangle rectangle de base 4 et de hauteur 4 : $\dfrac{4 \times 4}{2} = 8$.

> [!tip] Lien avec l'IA
> L'intégrale mesure une **quantité accumulée** : un coût cumulé dans le temps, un revenu total à partir d'un revenu par jour, l'aire sous une courbe ROC (AUC), une probabilité (aire sous une densité).

## Méthode : calculer une intégrale

1. Trouver une primitive $F$ de $f$ (et la vérifier en dérivant).
2. Calculer $F(b)$ puis $F(a)$.
3. Faire la différence $F(b) - F(a)$.

## À retenir

- Continue = pas de saut. Dérivable = tangente unique. Dérivable ⇒ continue, **pas l'inverse**.
- Produit : $u'v + uv'$. Quotient : $\dfrac{u'v - uv'}{v^2}$. Composée : $v' \times u'(v)$.
- $(\sin)' = \cos$, $(\cos)' = -\sin$, $\tan$ non définie en $\dfrac{\pi}{2} + k\pi$.
- Primitive à une constante près ; intégrale $= F(b) - F(a)$ = aire algébrique.

> [!warning] Pièges fréquents
> - Oublier la dérivée de l'intérieur dans une composée : $(e^{3x})' = 3e^{3x}$, pas $e^{3x}$.
> - Écrire $(uv)' = u'v'$ : c'est faux.
> - Appliquer la formule $\dfrac{x^{n+1}}{n+1}$ avec $n = -1$.
> - Oublier qu'une aire sous l'axe compte en négatif.
