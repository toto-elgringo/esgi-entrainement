# Les classes de complexité

Cette annexe précise les définitions informelles du chapitre 1 (P, NP, NP-complet, NP-difficile) et montre que le « dessin » de ces classes dépend d'une question que personne n'a encore tranchée : **P = NP ?**

## 1. On classe des problèmes de décision

Un **problème de décision** associe à chaque **instance** (un exemplaire concret du problème) la réponse **oui** ou **non**. La **taille** d'une instance est le nombre de symboles, de **bits**, nécessaires pour l'écrire.

- « Existe-t-il une tournée de coût au plus $K$ ? » est un problème de décision.
- « Trouver la tournée la plus courte » n'en est pas un : la réponse est une tournée.

Un algorithme est **polynomial** si son nombre d'opérations est borné par un polynôme de la taille de l'instance ($n^2$, $n^3$, $n^{10}$…), et non par une exponentielle comme $2^n$.

## 2. Les définitions

- **P** : les problèmes de décision qu'un algorithme **résout** en temps polynomial.
- **NP** : les problèmes de décision pour lesquels les instances de réponse *oui* possèdent un **certificat** (une preuve courte) qu'un algorithme **vérifie** en temps polynomial.

> [!tip] Exemple de certificat
> Pour « existe-t-il une tournée de coût au plus $K$ ? », le certificat est la tournée elle-même : on vérifie que chaque ville y est une fois, on additionne $n$ distances et on compare à $K$. Rien n'est demandé pour les réponses *non* : prouver qu'**aucune** tournée ne convient n'a pas, a priori, de preuve courte.

Tout problème de P est dans NP (l'algorithme qui le résout sert de vérificateur) : $P \subseteq NP$.

**Réduction polynomiale.** Un problème A se **réduit** à B, noté $A \le_p B$, s'il existe une transformation $f$ calculable en temps polynomial qui envoie chaque instance $x$ de A sur une instance $f(x)$ de B **de même réponse**. Lecture : **B est au moins aussi difficile que A**.

- **NP-difficile** : tout problème de NP se réduit à lui. Il n'a **pas besoin** d'être dans NP.
- **NP-complet** : à la fois dans NP **et** NP-difficile.

> [!info] Et les problèmes d'optimisation ?
> Ils ne sont pas des problèmes de décision, donc **jamais dans NP**. On les dit NP-difficiles « au sens large » quand les résoudre permettrait de résoudre un problème NP-complet : connaître la tournée la plus courte répond aussitôt à « existe-t-il une tournée de coût au plus $K$ ? ».

**Le premier NP-complet** : le **théorème de Cook-Levin** (Cook 1971, Levin 1973) dit que **SAT** (« cette formule logique peut-elle être rendue vraie ? ») est NP-complet. En 1972, Karp en déduit 20 autres problèmes NP-complets par réductions (les « 21 problèmes de Karp »), dont le sac à dos, le circuit hamiltonien et la coloration.

## 3. Où tombent les problèmes ?

| # | Problème | Si $P \neq NP$ | Si $P = NP$ |
|---|---|---|---|
| 1 | Chemin eulérien (passer une fois par chaque **arête**) | P | NP-complet |
| 2 | Plus court chemin, en décision | P | NP-complet |
| 3 | Programmation linéaire continue, en décision | P | NP-complet |
| 4 | Répondre toujours oui (ou toujours non) | P | P, mais **pas** NP-complet |
| 5 | Factorisation, en décision | NP, ni P ni NP-complet connus | NP-complet |
| 6 | Isomorphisme de graphes | NP, ni P ni NP-complet connus | NP-complet |
| 7 | SAT | NP-complet | NP-complet |
| 8 | Voyageur de commerce, en décision | NP-complet | NP-complet |
| 9 | Sac à dos, en décision | NP-complet | NP-complet |
| 10 | $k$-coloration, $k \ge 3$ | NP-complet | NP-complet |
| 11 | Circuit hamiltonien (passer une fois par chaque **sommet**) | NP-complet | NP-complet |
| 12 | Voyageur de commerce, en optimisation | NP-difficile, hors de NP | NP-difficile, hors de NP |
| 13 | Problème de l'arrêt | NP-difficile, hors de NP | NP-difficile, hors de NP |

### Si P ≠ NP (ce que parie la grande majorité des chercheurs)

- **P et NP-difficile n'ont rien en commun** : aucun problème NP-difficile n'a d'algorithme polynomial.
- **Théorème de Ladner (1975)** : il existe alors des problèmes **NP-intermédiaires**, ni dans P ni NP-complets. On n'en connaît aucun avec certitude ; candidats : la factorisation et l'isomorphisme de graphes.

### Si P = NP

- **Tout problème non trivial de P devient NP-complet** (même le chemin eulérien) : la réduction a le droit de **résoudre** elle-même l'instance en temps polynomial, puis de renvoyer une instance *oui* ou *non* fixée de B.
- **Exceptions** : « toujours oui » et « toujours non ». On ne peut pas y réduire SAT : il faudrait envoyer une formule insatisfiable sur une instance *non*, et il n'y en a pas.

### Dans les deux cas

NP-difficile **déborde** de NP : les problèmes d'**optimisation** (12) et les problèmes **plus durs que NP**, jusqu'aux **indécidables**. Le problème de l'arrêt (13) est NP-difficile (on y réduit SAT : un programme qui essaie toutes les affectations d'une formule et s'arrête s'il en trouve une bonne) mais il n'est pas dans NP, car aucun algorithme ne le décide (Turing, 1936).

> [!warning] Laquelle des deux figures est la bonne ?
> Personne ne le sait. La question est posée depuis 1971 ; c'est l'un des sept **problèmes du millénaire** (un million de dollars de prix depuis 2000).

## 4. Un seul algorithme suffirait à trancher

**Propriété** : si $A \le_p B$ et $B \in P$, alors $A \in P$.

On calcule $f(x)$ en temps polynomial (donc $f(x)$ a une taille polynomiale), puis on lance l'algorithme de B : un polynôme appliqué à un polynôme reste un polynôme. Par exemple, une transformation en $O(n^2)$ suivie d'un algorithme en $O(m^3)$ donne du $O(n^6)$.

Conséquence : un **seul** problème NP-complet résolu en temps polynomial, et $P = NP$. C'est pourquoi montrer qu'un problème est NP-complet est si utile : le résoudre vite résoudrait du même coup des milliers de problèmes sur lesquels on bute depuis plus de 50 ans.

## 5. Ce que cela change pour le cours

Le cours parie sur $P \neq NP$ : voyageur de commerce, sac à dos, coloration et PLNE n'ont alors aucun algorithme polynomial. À grande échelle, on renonce soit à l'**optimum** (métaheuristiques), soit à un **temps garanti** (branch & bound).

> [!warning] Polynomial ne veut pas dire rapide
> Même si $P = NP$, l'algorithme pourrait être en $n^{100}$ : pour $n = 20$, $20^{100} \approx 1{,}3 \times 10^{130}$ opérations, bien plus que les $20! \approx 2{,}4 \times 10^{18}$ de la force brute.

> [!info] Pseudo-polynomial
> La programmation dynamique résout le sac à dos en $O(n \times C)$. Ce n'est pas polynomial en la **taille** de l'instance : $C$ s'écrit avec environ $\log_2 C$ bits, et ajouter un bit double $C$. On parle d'algorithme **pseudo-polynomial** ; le sac à dos est dit **faiblement** NP-complet.

## À retenir

- On classe des problèmes de **décision** ; la taille d'une instance se mesure en bits.
- P = résoluble en temps polynomial ; NP = vérifiable en temps polynomial grâce à un certificat ; $P \subseteq NP$.
- $A \le_p B$ : B au moins aussi difficile que A ; si $B \in P$ alors $A \in P$.
- NP-difficile : tout NP s'y réduit (pas forcément dans NP). NP-complet : NP-difficile **et** dans NP. Premier : SAT.
- Si $P \neq NP$ : NP-intermédiaires possibles. Si $P = NP$ : tout problème non trivial de P est NP-complet.
- Polynomial ≠ rapide ; $O(n \times C)$ est pseudo-polynomial.
