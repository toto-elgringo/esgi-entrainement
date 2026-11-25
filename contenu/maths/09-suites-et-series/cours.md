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

**Exemple résolu (formule explicite) :** $u_n = 6 - \dfrac{4}{n+2}$. On calcule $u_0$, $u_1$, $u_2$ en remplaçant $n$ partout, sans oublier le $+2$ du dénominateur.

| $n$ | $n + 2$ | $\dfrac{4}{n+2}$ | $u_n$ |
|---|---|---|---|
| 0 | 2 | 2 | $6 - 2 = 4$ |
| 1 | 3 | $1{,}333\dots$ | $6 - \frac43 = \frac{14}{3} \approx 4{,}67$ |
| 2 | 4 | 1 | $6 - 1 = 5$ |

**Exemple résolu (récurrence) :** $u_{n+1} = 3u_n - 1$ avec $u_0 = 2$. On calcule un terme à partir du précédent, comme une boucle :

1. $u_1 = 3 \times u_0 - 1 = 3 \times 2 - 1 = 5$.
2. $u_2 = 3 \times u_1 - 1 = 3 \times 5 - 1 = 14$.
3. $u_3 = 3 \times 14 - 1 = 41$.

Erreur fréquente : recopier $u_0$ comme premier terme demandé quand on te demande $(u_1, u_2, u_3)$. Le premier calcul **utilise** $u_0$ mais donne $u_1$.

**À retenir :** formule explicite = on remplace $n$ ; récurrence = on part de $u_0$ et on applique la règle un tour après l'autre.

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

### Trouver une limite, pas à pas

Trois réflexes suffisent pour presque toutes les suites du chapitre.

1. **Un nombre fixe divisé par quelque chose qui grandit sans fin tend vers $0$.** Exemple : $\dfrac{9}{n+5}$ : pour $n = 995$, c'est $\dfrac{9}{1000} = 0{,}009$ ; pour $n = 999\,995$, c'est $0{,}000009$. Limite : $0$.
2. **Un morceau qui tend vers $0$ disparaît dans une somme.** Exemple : $v_n = 2 + \dfrac{7}{n}$. Le morceau $\dfrac{7}{n}$ tend vers $0$, donc $v_n \to 2 + 0 = 2$. (Ce n'est ni $7$ ni $9$ : on ne mélange pas les nombres, on regarde ce que devient **chaque** morceau.)
3. **Une fraction « $\dfrac{an + b}{n}$ » se coupe en deux.** Exemple : $\dfrac{5n + 2}{n} = \dfrac{5n}{n} + \dfrac{2}{n} = 5 + \dfrac{2}{n} \to 5$.

Et pour reconnaître une divergence :

- $u_n = 4n + 1$ augmente de $4$ à chaque rang : elle dépasse n'importe quel nombre, elle **diverge vers $+\infty$**. Le $4$ et le $1$ ne sont pas des limites.
- $u_n = 3 \times (-1)^n$ vaut $3, -3, 3, -3, \dots$ : elle saute entre deux valeurs sans se rapprocher d'aucune, elle **diverge en oscillant**. Elle reste pourtant bornée (entre $-3$ et $3$), donc elle ne part pas vers l'infini.

**À retenir :** regarde ce que devient chaque morceau quand $n$ devient énorme ; une suite qui saute sans fin entre deux valeurs diverge, même si elle reste petite.

## 3. Le critère « monotone et bornée »

> [!tip] Théorème (admis)
> - Une suite **croissante** et **majorée** (elle ne dépasse jamais une certaine valeur) converge.
> - Une suite **décroissante** et **minorée** converge aussi.

L'intérêt : on peut savoir qu'une suite se stabilise **sans connaître sa limite**. Pour un algorithme itératif, il suffit de montrer que les valeurs qu'il produit montent sans jamais dépasser un plafond (ou descendent sans passer sous un plancher).

Vocabulaire : **croissante** = chaque terme est plus grand (ou égal) que le précédent ; **majorée par $M$** = tous les termes sont $\le M$ (un plafond) ; **minorée** = il existe un plancher.

**Exemple.** $u_n = 3 - \dfrac{2}{n+1}$ : $u_0 = 1$, $u_1 = 2$, $u_2 \approx 2{,}33$. Quand $n$ augmente, on retire un nombre de plus en plus petit, donc la suite **croît**. Et comme $\dfrac{2}{n+1} > 0$, on a toujours $u_n < 3$ : elle est **majorée**. Elle converge donc (vers $3$).

**Le même raisonnement, en quatre étapes, sur $w_n = 1 + \dfrac{5}{n+1}$ :**

1. **Premiers termes** : $w_0 = 1 + 5 = 6$, $w_1 = 1 + 2{,}5 = 3{,}5$, $w_2 = 1 + \frac53 \approx 2{,}67$. Ça descend.
2. **Sens de variation** : quand $n$ grandit, $n + 1$ grandit, donc $\dfrac{5}{n+1}$ rétrécit. On **ajoute** à $1$ un nombre de plus en plus petit : la suite est **décroissante**.
3. **Plancher** : $n + 1 > 0$, donc $\dfrac{5}{n+1} > 0$, donc $w_n > 1$ pour tout $n$. La suite est **minorée** par $1$.
4. **Conclusion** : décroissante et minorée, elle converge. Sa limite : $\dfrac{5}{n+1} \to 0$, donc $w_n \to 1$.

Erreurs fréquentes :

- Justifier le plafond par « elle est croissante » : une suite croissante peut très bien partir vers $+\infty$ (comme $u_n = n$). Croissante **et** majorée, il faut les deux.
- Justifier par la valeur d'un seul terme ($w_0 = 6$) : un terme ne dit rien sur tous les suivants.

**À retenir :** pour le sens de variation, regarde si le morceau qui bouge grandit ou rétrécit ; pour la borne, regarde son signe.

> [!warning] Majorée ne veut pas dire « tend vers le majorant »
> La suite ci-dessus est aussi majorée par $100$, mais sa limite est $3$. Le critère dit seulement qu'il **existe** une limite.

Par exemple, si l'on sait seulement qu'une suite est croissante et majorée par $10$, on peut dire qu'elle converge vers une limite **inférieure ou égale à $10$**, mais pas que cette limite vaut $10$.

## 4. Suites arithmétiques et géométriques

| | Arithmétique | Géométrique |
|---|---|---|
| Récurrence | $u_{n+1} = u_n + r$ (on **ajoute** $r$) | $u_{n+1} = q \times u_n$ (on **multiplie** par $q$) |
| Formule explicite | $u_n = u_0 + n\,r$ | $u_n = u_0 \times q^n$ |
| Comportement | diverge dès que $r \neq 0$ | converge vers $0$ si $\lvert q \rvert < 1$, diverge si $\lvert q \rvert > 1$ |

Pourquoi ces formules : pour aller de $u_0$ à $u_n$, on fait $n$ pas. En arithmétique, chaque pas **ajoute** $r$, donc on a ajouté $n$ fois $r$, soit $n\,r$. En géométrique, chaque pas **multiplie** par $q$, donc on a multiplié $n$ fois par $q$, soit $q^n$.

**Exemple résolu (arithmétique) :** $u_0 = 10$ et $u_{n+1} = u_n - 4$ (raison $r = -4$).

1. Formule : $u_n = 10 + n \times (-4) = 10 - 4n$.
2. Contrôle : $u_1 = 10 - 4 = 6$, et la récurrence donne aussi $10 - 4 = 6$.
3. $u_{15} = 10 - 4 \times 15 = 10 - 60 = -50$.
4. Comportement : on retire $4$ à chaque pas, elle diverge vers $-\infty$.

**Exemple résolu (géométrique) :** $w_0 = 3$ et $w_{n+1} = 4\,w_n$ (raison $q = 4$).

1. Formule : $w_n = 3 \times 4^n$.
2. $w_3 = 3 \times 4^3 = 3 \times 64 = 192$. On calcule **d'abord la puissance**, puis on multiplie par $3$ (ce n'est pas $12^3$).
3. Comportement : $\lvert 4 \rvert > 1$, elle explose vers $+\infty$.

Erreurs fréquentes : inverser les rôles ($u_0\,n + r$ au lieu de $u_0 + n\,r$), utiliser la formule géométrique pour une suite arithmétique (ou l'inverse), ou mettre $u_0$ dans la puissance ($(3 \times 4)^n$).

**Le comportement de $q^n$ selon $q$ :**

| Raison $q$ | Ce que fait $q^n$ | Exemple |
|---|---|---|
| entre $-1$ et $1$ (exclus) | tend vers $0$ | $0{,}2^n$ : $1;\ 0{,}2;\ 0{,}04;\ \dots$ |
| égale à $1$ | constante | $1, 1, 1, \dots$ |
| égale à $-1$ | oscille entre $1$ et $-1$ | $1, -1, 1, \dots$ |
| plus grande que $1$ | diverge vers $+\infty$ | $3^n$ : $1, 3, 9, 27, \dots$ |
| plus petite que $-1$ | oscille de plus en plus fort | $(-2)^n$ : $1, -2, 4, -8, \dots$ |

Une raison **négative** ne veut pas dire divergence : $(-0{,}5)^n$ vaut $1;\ -0{,}5;\ 0{,}25;\ -0{,}125;\ \dots$ et tend vers $0$. Ce qui compte, c'est la **taille** $\lvert q \rvert$.

**À retenir :** « on ajoute » → $u_0 + n\,r$ ; « on multiplie » → $u_0 \times q^n$ ; une géométrique converge (vers $0$) seulement si $\lvert q \rvert < 1$, une arithmétique ne converge jamais (sauf $r = 0$).

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

**Pourquoi $v_n$ est géométrique (dans le cas général).** Le point fixe vérifie $\ell = a\ell + b$, donc $b = \ell - a\ell$. Alors :

$$v_{n+1} = u_{n+1} - \ell = a\,u_n + b - \ell = a\,u_n + (\ell - a\ell) - \ell = a\,u_n - a\ell = a\,(u_n - \ell) = a\,v_n$$

Le $+ b$ a disparu : c'est tout l'intérêt de mesurer l'écart au point fixe. La raison de $(v_n)$ est le **coefficient $a$** devant $u_n$ (pas $b$, pas $1 - a$).

**Exemple résolu complet :** $u_{n+1} = 0{,}5\,u_n + 6$ avec $u_0 = 20$.

1. **Point fixe** : $\ell = 0{,}5\,\ell + 6$. On regroupe les $\ell$ à gauche : $\ell - 0{,}5\,\ell = 6$, soit $0{,}5\,\ell = 6$, donc $\ell = 12$. (Raccourci : $\frac{6}{1 - 0{,}5} = 12$.)
2. **Raison de $v_n = u_n - 12$** : le coefficient devant $u_n$, soit $0{,}5$.
3. **Premier terme** : $v_0 = u_0 - \ell = 20 - 12 = 8$ (dans cet ordre : $u_0$ **moins** $\ell$).
4. **Formule** : $v_n = 8 \times 0{,}5^n$, donc $u_n = 12 + 8 \times 0{,}5^n$.
5. **Contrôle** : $n = 0$ donne $12 + 8 = 20$ ✓ ; $n = 1$ donne $12 + 4 = 16$, et la récurrence donne $0{,}5 \times 20 + 6 = 16$ ✓.
6. **Limite** : $0{,}5^n \to 0$, donc $u_n \to 12$, le point fixe.

Ici $u_0$ est au-dessus du point fixe, l'écart $v_0$ est positif et la suite **descend** vers $12$. Dans l'exemple précédent ($u_0 = 0$, sous le point fixe $10$), l'écart était négatif et la suite **montait**.

Erreurs fréquentes : calculer $\ell - u_0$ au lieu de $u_0 - \ell$ (signe faux), prendre $b$ comme raison, ou se tromper dans $1 - a$ quand $a$ est négatif ($1 - (-0{,}5) = 1{,}5$, pas $0{,}5$).

**À retenir :** point fixe, écart de départ $u_0 - \ell$, raison $a$, puis $u_n = \ell + (u_0 - \ell)\,a^n$ ; contrôle toujours avec $n = 0$ et $n = 1$.

> [!tip] Le réflexe
> Si $\lvert a \rvert < 1$, l'écart au point fixe est multiplié par $a$ à chaque tour : il fond, et la suite converge vers $\ell$. Si $\lvert a \rvert > 1$, l'écart grossit et la suite diverge (sauf si on part pile sur $\ell$).

## 6. Séries : additionner les termes d'une suite

À partir d'une suite $(u_n)$, on forme les **sommes partielles** :

$$S_N = \sum_{n=0}^{N} u_n = u_0 + u_1 + \dots + u_N$$

La **série** de terme général $u_n$, c'est la suite $(S_N)$. Si $(S_N)$ converge, on dit que la série converge, et sa limite se note $\displaystyle\sum_{n=0}^{+\infty} u_n$.

**Exemple résolu :** les sommes partielles de $u_n = (-1)^n$.

| $N$ | Terme ajouté $u_N$ | Somme partielle $S_N$ |
|---|---|---|
| 0 | $1$ | $1$ |
| 1 | $-1$ | $0$ |
| 2 | $1$ | $1$ |
| 3 | $-1$ | $0$ |

$S_N$ saute entre $1$ et $0$ sans se stabiliser : la série diverge.

**À retenir :** une série converge quand ses sommes partielles se stabilisent ; ne confonds pas la suite des termes $(u_n)$ et la suite des sommes $(S_N)$.

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

### Sommes finies, pas à pas

L'exposant du haut est $N + 1$ parce que de $n = 0$ à $n = N$, il y a $N + 1$ termes ($q^0, q^1, \dots, q^N$).

**Exemple résolu :** $\displaystyle\sum_{n=0}^{4} 3^n$.

1. On repère $q = 3$ et $N = 4$, donc $N + 1 = 5$.
2. Formule : $\dfrac{1 - 3^5}{1 - 3} = \dfrac{1 - 243}{-2} = \dfrac{-242}{-2} = 121$.
3. Vérification à la main : $1 + 3 + 9 + 27 + 81 = 121$.

**Avec une fraction :** $\displaystyle\sum_{n=0}^{3} \left(\frac12\right)^n = \dfrac{1 - \frac{1}{16}}{1 - \frac12} = \dfrac{\frac{15}{16}}{\frac12} = \dfrac{15}{16} \times 2 = \dfrac{15}{8}$. Vérification : $1 + \frac12 + \frac14 + \frac18 = \frac{8 + 4 + 2 + 1}{8} = \frac{15}{8}$. (Diviser par une fraction, c'est multiplier par son inverse.)

**Avec une raison négative :** $\displaystyle\sum_{n=0}^{4} (-3)^n = \dfrac{1 - (-3)^5}{1 - (-3)} = \dfrac{1 - (-243)}{4} = \dfrac{244}{4} = 61$. Vérification : $1 - 3 + 9 - 27 + 81 = 61$. Attention : $(-3)^5$ est négatif (puissance impaire), et $1 - (-3) = 4$.

Erreurs fréquentes : mettre $q^N$ au lieu de $q^{N+1}$ (on oublie le terme $q^0 = 1$), perdre un signe avec une raison négative.

**À retenir :** repère $q$ et $N$, calcule $\dfrac{1 - q^{N+1}}{1 - q}$, puis vérifie en additionnant les premiers termes à la main.

### Sommes infinies, pas à pas

**Exemple résolu :** $\displaystyle\sum_{n=0}^{+\infty} \left(-\frac13\right)^n$.

1. $q = -\frac13$, et $\lvert q \rvert = \frac13 < 1$ : la série converge (la raison négative ne gêne pas).
2. Somme : $\dfrac{1}{1 - (-\frac13)} = \dfrac{1}{1 + \frac13} = \dfrac{1}{\frac43} = \dfrac34$.

**Une série qui diverge :** $\displaystyle\sum_{n=0}^{+\infty} 2^n$. Ici $\lvert q \rvert = 2 \ge 1$ : les termes $1, 2, 4, 8, \dots$ grandissent, la somme part vers $+\infty$. Si on appliquait quand même $\dfrac{1}{1 - q}$, on trouverait $\dfrac{1}{1 - 2} = -1$ : un résultat **négatif** pour une somme de nombres positifs, absurde. La formule est interdite dès que $\lvert q \rvert \ge 1$.

**À retenir :** vérifie d'abord $\lvert q \rvert < 1$ ; seulement ensuite, la somme (depuis $n = 0$) vaut $\dfrac{1}{1 - q}$.

> [!warning] Le premier terme compte
> La formule part de $n = 0$ (premier terme $q^0 = 1$). Si la somme commence à $n = 1$, on retire ce $1$ : $\displaystyle\sum_{n=1}^{+\infty} \left(\frac{1}{2}\right)^n = 2 - 1 = 1$.

## 8. Le critère grossier de divergence

> [!tip] Critère (admis)
> Si $u_n$ **ne tend pas vers $0$**, la série $\sum u_n$ **diverge**. Inutile de calculer la moindre somme partielle.

**Exemple.** $\displaystyle\sum \frac{2n+1}{n}$ diverge, car $\dfrac{2n+1}{n} = 2 + \dfrac{1}{n} \to 2 \neq 0$ : on ajoute à chaque fois presque $2$.

> [!warning] Le piège : la réciproque est fausse
> $u_n \to 0$ **ne suffit pas** pour que la série converge. Avec $u_n = \dfrac{1}{n}$, le terme tend vers $0$, et pourtant $1 + \dfrac12 + \dfrac13 + \dots$ grandit sans limite. Quand $u_n \to 0$, le critère grossier **ne permet pas de conclure** : il faut des outils plus fins.

**La méthode, sur trois séries :**

| Série | Limite du terme général | Ne tend pas vers $0$ ? | Conclusion du critère grossier |
|---|---|---|---|
| $\sum \dfrac{4n + 3}{n}$ | $4 + \dfrac3n \to 4$ | oui | diverge |
| $\sum 2 \times (-1)^n$ | pas de limite ($2, -2, 2, \dots$) | oui | diverge |
| $\sum \dfrac{1}{n^3}$ | $0$ | non | **ne permet pas de conclure** |

- Pour la 2e : un terme qui n'a **aucune** limite ne tend pas vers $0$, le critère s'applique.
- Pour la 3e : le critère se tait. Il ne dit ni « converge » ni « diverge ». (Cette série converge en réalité, mais ça se montre avec un autre outil, hors programme ici.)

**À retenir :** calcule la limite du terme général ; si ce n'est pas $0$ (ou s'il n'y a pas de limite), la série diverge ; si c'est $0$, on ne peut rien conclure avec ce critère.

## 9. Un aperçu des séries entières

Une **série entière** est une somme infinie de la forme $\displaystyle\sum_{n=0}^{+\infty} a_n x^n$ : un « polynôme avec une infinité de termes ». Elle converge pour certaines valeurs de $x$ (proches de $0$) et diverge pour d'autres ; la frontière s'appelle le **rayon de convergence** (notion admise ici).

L'exemple à connaître : l'exponentielle elle-même.

$$e^x = \sum_{n=0}^{+\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \dots$$

Elle converge pour **tout** réel $x$. Avec $x = 1$ : $1 + 1 + 0{,}5 + 0{,}1667 + 0{,}0417 \approx 2{,}708$, déjà proche de $e \approx 2{,}718$. Les termes $\dfrac{1}{n!}$ diminuent très vite, donc chaque terme ajouté rapproche encore du résultat.

**La factorielle** $n!$ (« factorielle $n$ ») est le produit des entiers de $1$ à $n$, et par convention $0! = 1$ :

| $n$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| $n!$ | 1 | 1 | 2 | 6 | 24 | 120 |

**Exemple résolu :** valeur approchée de $e^{0{,}2}$ avec les termes de $n = 0$ à $n = 3$.

| $n$ | $x^n$ avec $x = 0{,}2$ | $n!$ | Terme $\dfrac{x^n}{n!}$ |
|---|---|---|---|
| 0 | $1$ | 1 | $1$ |
| 1 | $0{,}2$ | 1 | $0{,}2$ |
| 2 | $0{,}04$ | 2 | $0{,}02$ |
| 3 | $0{,}008$ | 6 | $0{,}001333\dots$ |

Somme : $1 + 0{,}2 + 0{,}02 + 0{,}00133 \approx 1{,}2213$. La vraie valeur est $e^{0{,}2} \approx 1{,}2214$ : quatre termes suffisent presque.

Pourquoi ça marche si bien : pour $x > 0$, tous les termes sont positifs, donc chaque ajout fait monter la somme vers $e^x$ ; et comme $n!$ grandit beaucoup plus vite que $x^n$, les termes deviennent minuscules, donc ce qu'il reste à ajouter devient minuscule aussi.

Erreurs fréquentes : oublier que $0! = 1$ (le premier terme vaut $1$), diviser par $n$ au lieu de $n!$, ou oublier d'élever $x$ à la puissance.

**À retenir :** terme $n$ = $x^n$ divisé par $n!$ ; additionne les premiers termes dans un tableau.

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

**Exemple résolu :** $\theta_0 = 8$.

- Avec $\eta = 0{,}5$ : raison $1 - 0{,}5 = 0{,}5$. $\theta_1 = 8 \times 0{,}5 = 4$, $\theta_2 = 2$, $\theta_3 = 1$. Formule : $\theta_n = 8 \times 0{,}5^n \to 0$.
- Avec $\eta = 3$ : raison $1 - 3 = -2$. $\theta_1 = 8 \times (-2) = -16$, $\theta_2 = -16 \times (-2) = 32$ (moins fois moins donne plus). La taille double à chaque pas : ça diverge.

On ne retire **pas** la même quantité à chaque pas : $\theta_n - \eta\,\theta_n$ retire une **part** ($\eta$) de la valeur actuelle. C'est pour ça que la formule est une puissance, pas $\theta_0 - n \times \dots$

**D'où vient « $0 < \eta < 2$ » :** $\lvert 1 - \eta \rvert < 1$ veut dire $-1 < 1 - \eta < 1$.

1. Partie droite : $1 - \eta < 1$ donne $-\eta < 0$, soit $\eta > 0$.
2. Partie gauche : $-1 < 1 - \eta$ donne $\eta < 2$.
3. Ensemble : $0 < \eta < 2$. Entre $1$ et $2$, la raison est négative (le signe change) mais de taille inférieure à $1$ : ça converge **en oscillant**.

**À retenir :** mise à jour « valeur moins une part de la valeur » = suite géométrique de raison $1 - \eta$ ; elle converge si et seulement si $\lvert 1 - \eta \rvert < 1$.

### Le diagramme en escalier

Pour voir une suite $u_{n+1} = f(u_n)$, on trace la courbe $y = f(x)$ et la droite $y = x$. On part de $u_0$ sur l'axe horizontal, on monte jusqu'à la courbe (on lit $u_1$), on va horizontalement jusqu'à la droite $y = x$ (on reporte $u_1$), et on recommence. Le point où la courbe croise la droite est le **point fixe**.

- Si $f$ est une droite de pente **positive** (entre $0$ et $1$), on obtient un **escalier** qui monte (ou descend) sans jamais revenir en arrière.
- Si la pente est **négative** (entre $-1$ et $0$), les valeurs passent alternativement au-dessus et en dessous du point fixe : on obtient une **spirale** qui s'enroule vers lui.
- Si la pente est plus grande que $1$ en valeur absolue, l'escalier ou la spirale **s'éloigne** du point fixe : la suite diverge.

**Exemple résolu :** $u_{n+1} = -0{,}25\,u_n + 10$ avec $u_0 = 0$.

1. **Termes** : $u_1 = 10$, $u_2 = -2{,}5 + 10 = 7{,}5$, $u_3 = -0{,}25 \times 7{,}5 + 10 = 8{,}125$, $u_4 = -0{,}25 \times 8{,}125 + 10 = 7{,}96875$.
2. **Point fixe** : $\ell = -0{,}25\,\ell + 10$, donc $\ell + 0{,}25\,\ell = 10$, soit $1{,}25\,\ell = 10$ et $\ell = 8$. (Avec la formule : $1 - a = 1 - (-0{,}25) = 1{,}25$.)
3. **Écarts** $u_n - 8$ : $-8$, $+2$, $-0{,}5$, $+0{,}125$, $-0{,}03125$. Chaque écart est l'écart précédent fois $-0{,}25$ : le signe change à chaque rang et la taille est divisée par $4$.
4. **Dessin** : au-dessous, au-dessus, au-dessous… de plus en plus près de $8$ : une **spirale qui s'enroule** vers le point fixe.

**À retenir :** le signe de $a$ décide de la forme (positif : escalier, négatif : spirale) ; la taille $\lvert a \rvert$ décide du sens (moins de $1$ : on se rapproche, plus de $1$ : on s'éloigne).

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
