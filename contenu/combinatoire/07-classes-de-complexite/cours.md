# Les classes de complexité

Cette annexe précise les définitions informelles du chapitre 1 (P, NP, NP-complet, NP-difficile) et montre que le « dessin » de ces classes dépend d'une question que personne n'a encore tranchée : **P = NP ?**

## 1. On classe des problèmes de décision

Un **problème de décision** associe à chaque **instance** (un exemplaire concret du problème) la réponse **oui** ou **non**. La **taille** d'une instance est le nombre de symboles, de **bits**, nécessaires pour l'écrire.

- « Existe-t-il une tournée de coût au plus $K$ ? » est un problème de décision.
- « Trouver la tournée la plus courte » n'en est pas un : la réponse est une tournée.

**Passer d'un problème d'optimisation à sa version décision.** On ajoute un **seuil** $K$ et on demande seulement si on peut faire au moins aussi bien que $K$.

**Exemple résolu :** « trouver le plus court chemin de la ville X à la ville Y ».

1. Ce qu'on cherche : un chemin (ce n'est pas un oui / non).
2. On ajoute un seuil $K$ : « existe-t-il un chemin de X à Y de longueur au plus $K$ ? ».
3. La réponse est maintenant oui ou non : c'est un problème de décision.

Pour un problème où l'on **maximise** (le sac à dos : valeur la plus grande), le seuil se lit dans l'autre sens : « peut-on mettre des objets de valeur **au moins** $K$ sans dépasser la capacité ? ».

**À retenir :** version décision = « peut-on faire au moins aussi bien que $K$ ? », réponse oui ou non.

### Mesurer la taille en bits

Un nombre $N$ s'écrit en binaire avec environ $\log_2 N$ bits. Avec $b$ bits, on écrit tous les nombres de $0$ à $2^b - 1$.

**Exemple résolu :** combien de bits pour écrire $1\,000$ ? Et quelle taille a une liste de 10 nombres écrits chacun sur 16 bits ?

1. On cherche la plus petite puissance de 2 qui dépasse 1 000 : $2^9 = 512$ (trop petit), $2^{10} = 1\,024$ (suffit). Il faut donc **10 bits**.
2. Pour la liste : chaque nombre prend 16 bits, il y en a 10, donc $10 \times 16 = 160$ bits.

On remarque que la **valeur** 1 000 est grande, mais qu'elle ne prend que 10 bits : la taille grandit beaucoup moins vite que la valeur.

**À retenir :** la taille d'une instance = la somme des bits de tout ce qu'on écrit (chaque nombre compte pour son nombre de bits, pas pour sa valeur).

### Polynomial ou exponentiel

Un algorithme est **polynomial** si son nombre d'opérations est borné par un polynôme de la taille de l'instance ($n^2$, $n^3$, $n^{10}$…), et non par une exponentielle comme $2^n$.

**Exemple résolu :** comparons $n^3$ et $2^n$.

| $n$ | $n^3$ | $2^n$ |
|---|---|---|
| 10 | $1\,000$ | $1\,024$ |
| 20 | $8\,000$ | $1\,048\,576$ |
| 30 | $27\,000$ | environ $1{,}07 \times 10^9$ |

Quand $n$ augmente de 10, $n^3$ est multiplié par un petit nombre, alors que $2^n$ est multiplié par $2^{10} = 1\,024$ à chaque fois.

**À retenir :** polynomial = la taille $n$ est en **bas** de la puissance ($n^3$) ; exponentiel = $n$ est **en haut** ($2^n$).

## 2. Les définitions

- **P** : les problèmes de décision qu'un algorithme **résout** en temps polynomial.
- **NP** : les problèmes de décision pour lesquels les instances de réponse *oui* possèdent un **certificat** (une preuve courte) qu'un algorithme **vérifie** en temps polynomial.

NP veut dire « **N**on déterministe **P**olynomial », **pas** « non polynomial ». Être dans NP ne veut pas dire « difficile » : cela veut dire « une réponse oui se **vérifie** vite si on nous donne la preuve ».

> [!tip] Exemple de certificat
> Pour « existe-t-il une tournée de coût au plus $K$ ? », le certificat est la tournée elle-même : on vérifie que chaque ville y est une fois, on additionne $n$ distances et on compare à $K$. Rien n'est demandé pour les réponses *non* : prouver qu'**aucune** tournée ne convient n'a pas, a priori, de preuve courte.

**Exemple résolu : vérifier un certificat.** Quatre villes P, Q, R, S. Distances : PQ = 2, PR = 4, PS = 7, QR = 3, QS = 5, RS = 1. Question : « existe-t-il une tournée de coût au plus $K = 13$ ? ».

On nous donne la tournée P → R → Q → S → P. On la vérifie :

1. Chaque ville apparaît une fois : P, R, Q, S. Oui.
2. On additionne les trajets, **retour au départ compris** : PR + RQ + QS + SP $= 4 + 3 + 5 + 7 = 19$.
3. On compare : $19 > 13$. Cette tournée n'est **pas** un certificat.

Est-ce que cela prouve que la réponse est non ? **Non** : une tournée trop chère ne dit rien des autres. On essaie P → Q → R → S → P : PQ + QR + RS + SP $= 2 + 3 + 1 + 7 = 13 \le 13$. Celle-ci **est** un certificat : la réponse est oui, et on l'a vérifié avec 4 additions et une comparaison.

**Combien de tournées pour prouver un « non » ?** Il faudrait toutes les examiner. Avec $n$ villes, on fixe la ville de départ (il reste $(n-1)!$ ordres pour les autres), puis on divise par 2 car une tournée et la même parcourue à l'envers coûtent pareil :

$$\text{nombre de tournées distinctes} = \frac{(n-1)!}{2}$$

Pour 5 villes : $\frac{4!}{2} = \frac{24}{2} = 12$. Pour 6 villes : $\frac{5!}{2} = 60$. Ce nombre explose : pas de preuve courte pour un « non ».

**À retenir :** un certificat se vérifie en **recalculant** (ici : chaque ville une fois, somme avec le retour, comparaison à $K$). Un mauvais candidat ne prouve jamais « non ».

### Les problèmes du chapitre et leurs certificats

| Problème (version décision) | Question | Certificat d'une réponse oui |
|---|---|---|
| SAT | cette formule logique peut-elle être rendue vraie ? | une valeur vrai / faux pour chaque variable |
| Voyageur de commerce | existe-t-il une tournée de coût au plus $K$ ? | la tournée |
| Sac à dos | peut-on atteindre une valeur au moins $K$ sans dépasser la capacité $C$ ? | la liste des objets choisis |
| $k$-coloration | peut-on colorier les sommets avec $k$ couleurs, deux voisins toujours de couleurs différentes ? | la couleur de chaque sommet |
| Circuit hamiltonien | existe-t-il un cycle qui passe une fois par chaque **sommet** ? | l'ordre des sommets |
| Factorisation | le nombre $N$ a-t-il un diviseur $d$ avec $1 < d \le k$ ? | le diviseur $d$ |
| Isomorphisme de graphes | deux graphes sont-ils le même graphe, à un renommage des sommets près ? | le renommage |

**Exemple résolu : un certificat pour SAT.** Une formule SAT utilise des variables qui valent vrai ou faux, avec $\lor$ (ou), $\land$ (et) et $\lnot$ (non). Elle est **satisfiable** si au moins une affectation la rend vraie. Soit $(x \lor y) \land (\lnot x \lor z) \land (\lnot y \lor \lnot z)$ et le certificat $x$ = vrai, $y$ = faux, $z$ = vrai.

| Clause | Calcul | Vraie ? |
|---|---|---|
| $x \lor y$ | vrai ou faux | oui |
| $\lnot x \lor z$ | faux ou vrai | oui |
| $\lnot y \lor \lnot z$ | vrai ou faux | oui |

Les trois clauses sont vraies, donc la formule est vraie : la réponse est oui. La vérification ne demande qu'un passage sur la formule.

**Exemple résolu : un certificat pour la factorisation.** « 91 a-t-il un diviseur $d$ avec $1 < d \le 10$ ? ». Certificat : $d = 7$. On vérifie : $1 < 7 \le 10$, et $91 = 7 \times 13$, donc 7 divise 91. Réponse oui.

**À retenir :** pour montrer qu'un problème est dans NP, dis **quel est le certificat** et **comment le vérifier** en temps polynomial.

### Pourquoi $P \subseteq NP$

Tout problème de P est dans NP (l'algorithme qui le résout sert de vérificateur) : $P \subseteq NP$.

Pas à pas : si un algorithme répond en temps polynomial, le « vérificateur » peut ignorer le certificat et relancer cet algorithme. Il conclut en temps polynomial. Donc tout problème facile est aussi « facile à vérifier ».

**À retenir :** facile à résoudre ⇒ facile à vérifier. L'inverse ($NP \subseteq P$) est exactement la question ouverte.

### Les réductions

**Réduction polynomiale.** Un problème A se **réduit** à B, noté $A \le_p B$, s'il existe une transformation $f$ calculable en temps polynomial qui envoie chaque instance $x$ de A sur une instance $f(x)$ de B **de même réponse**. Lecture : **B est au moins aussi difficile que A**.

Pour vérifier une réduction, on contrôle **trois** points :

1. $f$ se calcule en temps polynomial (on **écrit** l'instance de B, on ne la résout pas).
2. Si la réponse de $x$ est oui, celle de $f(x)$ est oui.
3. Si la réponse de $f(x)$ est oui, celle de $x$ est oui (donc non donne non).

**Exemple résolu : Stable $\le_p$ Clique.** Dans un graphe, un **stable** est un groupe de sommets **sans** arête entre eux ; une **clique** est un groupe de sommets **tous** reliés entre eux. Problème A : « ce graphe a-t-il un stable de $k$ sommets ? ». Problème B : « ce graphe a-t-il une clique de $k$ sommets ? ».

Transformation $f$ : on garde les mêmes sommets et le même $k$, et on prend le **graphe complémentaire** (on relie deux sommets exactement quand ils n'étaient **pas** reliés).

Prenons le graphe à 4 sommets avec les arêtes 1-2, 2-3, 3-4, et $k = 2$.

| Paire | Arête dans le graphe ? | Arête dans le complémentaire ? |
|---|---|---|
| 1-2 | oui | non |
| 1-3 | non | oui |
| 1-4 | non | oui |
| 2-3 | oui | non |
| 2-4 | non | oui |
| 3-4 | oui | non |

1. Coût de $f$ : on regarde chaque paire une fois, $\frac{n(n-1)}{2}$ paires, c'est polynomial.
2. $\{1, 3\}$ est un stable du graphe (pas d'arête 1-3) : dans le complémentaire, 1-3 est une arête, donc $\{1, 3\}$ est une clique. Oui donne oui.
3. Inversement, une clique du complémentaire n'a que des paires absentes du graphe de départ : c'est un stable. Oui de B donne oui de A.

Les deux réponses sont toujours les mêmes : c'est une réduction, et Clique est au moins aussi difficile que Stable.

**Choisir le seuil $K$ quand on fabrique un voyageur de commerce.** On donne souvent la distance 1 aux paires reliées dans un graphe et une grande distance aux autres. Une tournée de $n$ villes a exactement **$n$ trajets**. Exemple avec 4 villes, distances 1 et 10 : si tous les trajets valent 1, la tournée coûte $4 \times 1 = 4$ ; dès qu'un trajet vaut 10, elle coûte au moins $3 \times 1 + 10 = 13$. Avec $K = 4$, on accepte seulement les tournées faites de trajets à 1.

**À retenir :** une réduction écrit une instance de B en temps polynomial et garde la **même réponse** dans les deux sens. Pour le seuil, compare le coût « tout à 1 » et le coût minimal dès qu'un mauvais trajet est utilisé.

### NP-difficile et NP-complet

- **NP-difficile** : tout problème de NP se réduit à lui. Il n'a **pas besoin** d'être dans NP.
- **NP-complet** : à la fois dans NP **et** NP-difficile.

Tout NP-complet est donc NP-difficile, mais un NP-difficile n'est pas forcément NP-complet.

**Exemple résolu : classer trois problèmes** (on suppose $P \neq NP$). On pose deux questions à chaque problème.

| Problème | Dans NP ? | NP-difficile ? | Conclusion |
|---|---|---|---|
| Voyageur de commerce, décision | oui (la tournée est un certificat) | oui | NP-complet |
| Voyageur de commerce, optimisation | non (la réponse est une tournée, pas oui / non) | oui | NP-difficile seulement |
| Plus court chemin, décision | oui | non (il est dans P) | dans P |

**À retenir :** NP-complet = deux « oui » (dans NP **et** NP-difficile). Un seul « oui » côté difficile = NP-difficile seulement.

### Dans quel sens réduire ?

Pour prouver qu'un nouveau problème X est NP-difficile, on part d'un problème **déjà connu** NP-difficile (SAT par exemple) et on le transforme **en** X : $SAT \le_p X$.

Pas à pas : tout problème de NP se réduit à SAT, puis SAT se réduit à X. En enchaînant les deux transformations (deux temps polynomiaux à la suite restent polynomiaux), tout NP se réduit à X.

Le sens inverse, $X \le_p SAT$, montre seulement que X n'est **pas plus difficile** que SAT. Par exemple, le plus court chemin se réduit à SAT (il est dans NP), et pourtant il est facile.

**À retenir :** pour prouver que X est difficile, la flèche va **du** problème connu **vers** X.

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

### Pourquoi les problèmes 1 à 4 sont dans P

- **Chemin eulérien** : Euler a montré qu'il existe si et seulement si le graphe est connexe (sommets isolés mis à part) et a 0 ou 2 sommets de degré impair. Compter les degrés est rapide.
- **Plus court chemin** : l'algorithme de Dijkstra le calcule en temps polynomial ; on compare ensuite la longueur à $K$.
- **Programmation linéaire continue** (variables réelles, pas entières) : Khachiyan (1979) a donné le premier algorithme polynomial, puis Karmarkar (1984) un plus rapide. Avec des variables **entières** (PLNE), le problème redevient NP-complet.
- **Toujours oui / toujours non** : on répond sans même lire l'instance.

Attention à ne pas confondre : chemin **eulérien** (chaque **arête** une fois) est facile, circuit **hamiltonien** (chaque **sommet** une fois) est NP-complet.

**À retenir :** pour placer un problème dans P, cite l'algorithme polynomial connu (Euler, Dijkstra, Khachiyan, ou réponse fixe).

### Deux couleurs ou trois : un exemple

La **2-coloration** (« peut-on colorier avec 2 couleurs, deux voisins toujours différents ? ») est dans P. Méthode : on donne une couleur à un sommet, la couleur opposée à tous ses voisins, puis l'opposée aux voisins des voisins, et ainsi de suite (parcours en largeur). On ne fait jamais de choix : chaque couleur est **forcée**. Si on tombe sur deux voisins de même couleur, c'est impossible.

**Exemple résolu 1 : le carré** 1-2, 2-3, 3-4, 4-1.

| Étape | Sommet | Couleur forcée | Conflit ? |
|---|---|---|---|
| 1 | 1 | A (choix de départ) | non |
| 2 | 2 et 4 (voisins de 1) | B | non |
| 3 | 3 (voisin de 2 et de 4, tous deux B) | A | non |

Le carré se colorie A, B, A, B : réponse oui.

**Exemple résolu 2 : le triangle** 1-2, 2-3, 3-1. On met 1 en A, donc 2 et 3 (voisins de 1) en B. Mais 2 et 3 sont voisins et ont tous les deux B : conflit, réponse non.

Ce qui gêne, c'est un **cycle de longueur impaire** : en alternant A, B, A, B… le long d'un cycle, on revient à la couleur de départ seulement après un nombre **pair** d'arêtes. Le carré a 4 arêtes (pair), le triangle 3 (impair). Le nombre de sommets ou un sommet isolé ne gênent jamais.

Avec **3 couleurs**, les couleurs ne sont plus forcées (un voisin de A peut être B **ou** C) : il faut faire des choix, et la 3-coloration est NP-complète.

**À retenir :** 2-coloration = couleurs forcées, impossible dès qu'il y a un cycle impair (dans P). 3-coloration = choix à faire (NP-complet).

### Si P ≠ NP (ce que parie la grande majorité des chercheurs)

- **P et NP-difficile n'ont rien en commun** : aucun problème NP-difficile n'a d'algorithme polynomial.
- **Théorème de Ladner (1975)** : il existe alors des problèmes **NP-intermédiaires**, ni dans P ni NP-complets. On n'en connaît aucun avec certitude ; candidats : la factorisation et l'isomorphisme de graphes.

Pourquoi un problème de P ne peut pas être NP-complet si $P \neq NP$, pas à pas : supposons qu'un problème B soit dans P **et** NP-complet. Tout problème A de NP se réduit à B. On résout A en transformant son instance (polynomial) puis en résolvant B (polynomial). Donc tout NP serait dans P, c'est-à-dire $P = NP$ : contraire à l'hypothèse.

**À retenir :** si $P \neq NP$, trois zones dans NP : P, NP-complet, et entre les deux les candidats NP-intermédiaires (factorisation, isomorphisme).

### Si P = NP

- **Tout problème non trivial de P devient NP-complet** (même le chemin eulérien) : la réduction a le droit de **résoudre** elle-même l'instance en temps polynomial, puis de renvoyer une instance *oui* ou *non* fixée de B.
- **Exceptions** : « toujours oui » et « toujours non ». On ne peut pas y réduire SAT : il faudrait envoyer une formule insatisfiable sur une instance *non*, et il n'y en a pas.

Un problème est **non trivial** s'il a au moins une instance de réponse oui **et** au moins une instance de réponse non.

**Exemple résolu : réduire SAT à « ce graphe est-il connexe ? » en supposant $P = NP$.** On choisit d'abord deux instances fixées du problème B : $G_{oui}$ = deux sommets reliés (connexe) et $G_{non}$ = deux sommets non reliés (pas connexe). Pour une formule $\varphi$ :

1. Comme $P = NP$, SAT est dans P : on décide en temps polynomial si $\varphi$ est satisfiable.
2. Si oui, on renvoie $G_{oui}$ ; si non, on renvoie $G_{non}$.
3. Même réponse des deux côtés, et tout s'est fait en temps polynomial : c'est une réduction. Comme SAT est NP-complet, la connexité devient NP-difficile, et elle est dans NP : NP-complète.

Avec « toujours oui », l'étape 2 bloque : il n'existe aucune instance $G_{non}$ à renvoyer pour une formule insatisfiable.

**À retenir :** si $P = NP$, tout problème de NP qui a au moins un oui et au moins un non est NP-complet ; seuls « toujours oui » et « toujours non » restent à part.

### Dans les deux cas

NP-difficile **déborde** de NP : les problèmes d'**optimisation** (12) et les problèmes **plus durs que NP**, jusqu'aux **indécidables**. Le problème de l'arrêt (13) est NP-difficile (on y réduit SAT : un programme qui essaie toutes les affectations d'une formule et s'arrête s'il en trouve une bonne) mais il n'est pas dans NP, car aucun algorithme ne le décide (Turing, 1936).

Les mots, un par un :

- **Décider** un problème : avoir un algorithme qui s'arrête **toujours** et donne la bonne réponse oui / non.
- **Indécidable** : aucun algorithme ne peut le faire, quel que soit le temps qu'on lui laisse. Le problème de l'arrêt (« ce programme s'arrête-t-il sur cette entrée ? ») l'est.
- **Tout problème de NP se décide** : les certificats ont une longueur polynomiale, donc il y en a un nombre **fini** ; on peut tous les essayer (c'est long, mais ça s'arrête). Un problème indécidable ne peut donc pas être dans NP.

La réduction de SAT à l'arrêt, écrite en pseudo-code (pour une formule $\varphi$ donnée, on **écrit** ce programme, on ne le lance pas) :

```text
pour chaque affectation vrai/faux des variables de la formule :
    si la formule est vraie avec cette affectation :
        s'arrêter
boucler sans fin
```

**À retenir :** l'hypothèse $P = NP$ ne déplace que les problèmes **de NP** ; l'optimisation et l'indécidable restent hors de NP dans les deux figures.

> [!warning] Laquelle des deux figures est la bonne ?
> Personne ne le sait. La question est posée depuis 1971 ; c'est l'un des sept **problèmes du millénaire** (un million de dollars de prix depuis 2000).

```anim
classes
```

## 4. Un seul algorithme suffirait à trancher

**Propriété** : si $A \le_p B$ et $B \in P$, alors $A \in P$.

On calcule $f(x)$ en temps polynomial (donc $f(x)$ a une taille polynomiale), puis on lance l'algorithme de B : un polynôme appliqué à un polynôme reste un polynôme. Par exemple, une transformation en $O(n^4)$ suivie d'un algorithme en $O(m^2)$ donne du $O(n^8)$.

**Le même exemple, pas à pas.** L'instance de A a une taille $n$.

1. $f$ fait au plus de l'ordre de $n^4$ opérations, donc elle écrit au plus de l'ordre de $n^4$ symboles : l'instance de B a une taille $m$ de l'ordre de $n^4$.
2. B coûte de l'ordre de $m^2$. On remplace $m$ par $n^4$ : $(n^4)^2$.
3. Règle des puissances : $(n^a)^b = n^{a \times b}$, donc $(n^4)^2 = n^{4 \times 2} = n^8$.
4. Le temps de $f$ ($n^4$) s'ajoute, mais $n^8$ est plus grand : le total est en $O(n^8)$, toujours polynomial.

Pièges : **additionner** les exposants ($4 + 2 = 6$) ou calculer une puissance d'exposants ($2^4 = 16$) ; la bonne opération est le **produit**.

Conséquence : un **seul** problème NP-complet résolu en temps polynomial, et $P = NP$. C'est pourquoi montrer qu'un problème est NP-complet est si utile : le résoudre vite résoudrait du même coup des milliers de problèmes sur lesquels on bute depuis plus de 50 ans.

Pas à pas : si le sac à dos (décision), NP-complet, avait un algorithme polynomial, alors tout problème A de NP (qui se réduit au sac à dos, par définition de NP-difficile) se résoudrait en « transformer, puis résoudre le sac à dos » : polynomial d'après la propriété. Tout NP serait dans P, donc $P = NP$.

**À retenir :** les réductions transportent la facilité de B vers A ; les exposants se **multiplient**.

### De la décision à l'optimisation

Savoir répondre vite à la version décision permet aussi de trouver la **meilleure** solution, en posant plusieurs questions.

1. **Le coût optimal, par dichotomie.** Le coût est un entier entre $0$ et $M$, soit $M + 1$ valeurs possibles. Chaque question « existe-t-il une tournée de coût au plus $K$ ? », avec $K$ au milieu, coupe l'intervalle en deux. Après $q$ questions, on distingue $2^q$ valeurs : il faut $2^q \ge M + 1$, donc $q = \lceil \log_2(M + 1) \rceil$ ($\lceil \ \rceil$ veut dire « arrondi à l'entier **supérieur** »).
2. **La tournée elle-même.** On prend les arêtes une par une. On l'interdit (on lui donne une distance énorme) et on redemande si le coût optimal est encore atteignable. Si oui, on la laisse interdite ; si non, elle est indispensable et on la remet. Une question par arête.

**Exemple résolu :** 10 villes, coût d'une tournée entre 0 et 1 000.

1. Valeurs possibles : $1\,000 + 1 = 1\,001$. On cherche la plus petite puissance de 2 qui atteint 1 001 : $2^9 = 512$ (trop petit), $2^{10} = 1\,024$ (suffit). Donc **10 questions**.
2. Arêtes entre 10 villes : chaque paire de villes en est une, $\frac{n(n-1)}{2} = \frac{10 \times 9}{2} = 45$. (Calculer $10 \times 9 = 90$ compterait chaque arête deux fois, A-B et B-A.)
3. Total : $10 + 45 = 55$ questions, un nombre polynomial. Si chaque question est polynomiale, l'optimisation l'est aussi.

**À retenir :** coût optimal = $\lceil \log_2(\text{nombre de valeurs}) \rceil$ questions ; tournée = une question par arête, $\frac{n(n-1)}{2}$.

## 5. Ce que cela change pour le cours

Le cours parie sur $P \neq NP$ : voyageur de commerce, sac à dos, coloration et PLNE n'ont alors aucun algorithme polynomial. À grande échelle, on renonce soit à l'**optimum** (métaheuristiques), soit à un **temps garanti** (branch & bound).

> [!warning] Polynomial ne veut pas dire rapide
> Même si $P = NP$, l'algorithme pourrait être en $n^{100}$ : pour $n = 30$, $30^{100} \approx 5{,}2 \times 10^{147}$ opérations, bien plus que les $30! \approx 2{,}7 \times 10^{32}$ de la force brute.

**Comparer deux nombres énormes avec $\log_{10}$.** $\log_{10}$ d'un nombre donne à peu près son nombre de chiffres moins un (son « exposant de 10 »). Règles utiles : $\log_{10}(a^b) = b \times \log_{10} a$ et $\log_{10}(a \times b) = \log_{10} a + \log_{10} b$.

**Exemple résolu (celui de l'encart, $n = 30$) :**

1. $\log_{10}(30^{100}) = 100 \times \log_{10} 30 \approx 100 \times 1{,}477 = 147{,}7$, donc $30^{100} \approx 10^{147{,}7}$.
2. $30! = 1 \times 2 \times \dots \times 30$, donc $\log_{10}(30!) = \log_{10} 1 + \log_{10} 2 + \dots + \log_{10} 30 \approx 32{,}4$ (ou directement à la calculatrice), donc $30! \approx 10^{32{,}4}$.
3. On compare les exposants : $147{,}7 > 32{,}4$. L'algorithme « polynomial » ferait environ $10^{115}$ fois plus d'opérations que la force brute.

Même avec $P = NP$, les métaheuristiques garderaient donc leur intérêt tant que l'algorithme polynomial a un trop gros exposant.

**À retenir :** pour comparer des nombres énormes, compare leurs $\log_{10}$ (avec $\log_{10}(a^b) = b \log_{10} a$) ; polynomial ne garantit pas « utilisable ».

> [!info] Pseudo-polynomial
> La programmation dynamique résout le sac à dos en $O(n \times C)$. Ce n'est pas polynomial en la **taille** de l'instance : $C$ s'écrit avec environ $\log_2 C$ bits, et ajouter un bit double $C$. On parle d'algorithme **pseudo-polynomial** ; le sac à dos est dit **faiblement** NP-complet.

**Exemple résolu :** 10 objets, poids, valeurs et capacité écrits chacun sur 32 bits.

1. Taille de l'instance : $10 \times 32$ (poids) $+ 10 \times 32$ (valeurs) $+ 32$ (capacité) $= 320 + 320 + 32 = 672$ bits.
2. Avec 32 bits, $C$ peut valoir jusqu'à $2^{32} - 1 \approx 4{,}3 \times 10^9$.
3. La table de la programmation dynamique a environ $n \times C$ cases : jusqu'à $10 \times 4{,}3 \times 10^9 \approx 4{,}3 \times 10^{10}$ cases, pour une instance de seulement 672 bits.
4. Avec un bit de plus (33 bits), $C$ peut aller jusqu'à $2^{33} - 1 \approx 8{,}6 \times 10^9$ : la valeur maximale **double**, et la table aussi. Le temps est exponentiel en le nombre de bits de $C$.

C'est pourquoi un algorithme en $O(n \times C)$ ne prouve **pas** $P = NP$ : il est polynomial en la **valeur** de $C$, pas en sa **taille**.

**À retenir :** pseudo-polynomial = polynomial en la **valeur** des nombres, exponentiel en leur nombre de **bits**.

## À retenir

- On classe des problèmes de **décision** ; la taille d'une instance se mesure en bits.
- P = résoluble en temps polynomial ; NP = vérifiable en temps polynomial grâce à un certificat ; $P \subseteq NP$.
- $A \le_p B$ : B au moins aussi difficile que A ; si $B \in P$ alors $A \in P$. Pour prouver X difficile : connu $\le_p$ X.
- NP-difficile : tout NP s'y réduit (pas forcément dans NP). NP-complet : NP-difficile **et** dans NP. Premier : SAT.
- Si $P \neq NP$ : NP-intermédiaires possibles. Si $P = NP$ : tout problème non trivial de P est NP-complet.
- Optimisation et indécidables (l'arrêt) : NP-difficiles mais hors de NP, dans les deux figures.
- Polynomial ≠ rapide ; $O(n \times C)$ est pseudo-polynomial.
