# Métaheuristiques et recherche locale

Les problèmes du cours (voyageur de commerce, PLNE…) ont un nombre de solutions **fini mais astronomique** et sont **NP-difficiles**. Les méthodes exactes coûtent trop cher : on renonce à l'optimum global prouvé et on cherche **un bon optimum local, vite**.

## 1. Qu'est-ce qu'une métaheuristique ?

Une **métaheuristique** est une méthode d'optimisation **générique** : un cadre d'algorithme, souvent **stochastique** (il utilise du hasard), qui guide la recherche vers de bonnes solutions quel que soit le problème, **sans garantie d'optimalité**.

« Méta » veut dire « au-dessus » : la méthode **pilote** une heuristique de bas niveau (le voisinage) au lieu de résoudre le problème directement.

Les mots, un par un :

- **heuristique** : une méthode « astucieuse » qui donne vite une solution correcte, sans promettre que c'est la meilleure ;
- **générique** : la même méthode sert pour le voyageur de commerce, un emploi du temps ou un casse-tête, on change seulement le codage, le coût et les mouvements ;
- **stochastique** : elle tire des nombres au hasard, donc deux lancements peuvent donner deux résultats différents ;
- **sans garantie d'optimalité** : la solution trouvée peut être la meilleure, mais on ne peut pas le **prouver**.

| | Méthodes exactes | Métaheuristiques |
|---|---|---|
| Résultat | optimum global **prouvé** | bonne solution, sans preuve |
| Temps | peut exploser | contrôlé par le critère d'arrêt |
| Taille visée | petites et moyennes instances | grandes instances |

Les trois métaheuristiques du chapitre 2, de la plus simple à la plus élaborée :

1. la **recherche locale** : améliorer une solution par petites retouches ;
2. le **recuit simulé** : accepter parfois de dégrader pour sortir des pièges ;
3. les **algorithmes génétiques** : faire évoluer une population de solutions.

> [!tip] La recette commune
> Toutes demandent trois ingrédients : un **codage** des solutions, une **fonction de coût** (ou de *fitness*) qui note chaque solution, et des **mouvements élémentaires** qui relient les solutions entre elles.

**Exemple résolu : les trois ingrédients pour un emploi du temps.** On doit placer 5 examens dans 3 créneaux.

1. **Codage** : une liste de 5 numéros de créneau, par exemple $(1, 3, 2, 1, 2)$ veut dire « examen 1 au créneau 1, examen 2 au créneau 3… ».
2. **Fonction de coût** : le nombre d'étudiants qui ont deux examens au même créneau. On veut la rendre la plus petite possible.
3. **Mouvement élémentaire** : changer le créneau d'**un seul** examen. Depuis $(1, 3, 2, 1, 2)$, on peut aller en $(2, 3, 2, 1, 2)$ par exemple.

Une fois ces trois choses écrites, n'importe quelle métaheuristique du chapitre peut tourner, sans rien savoir d'autre sur les emplois du temps.

**À retenir :** pour appliquer une métaheuristique, écris d'abord le codage, le coût et le mouvement ; la méthode elle-même ne change pas d'un problème à l'autre.

## 2. L'exemple jouet : 27 cubes de 3 couleurs

On empile **27 cubes** (9 de chaque couleur) en 3 lignes de 9. **But : une seule couleur par ligne.**

- **Variables** : la position de chaque cube (une permutation des 27 cubes).
- **Objectif** : minimiser une **erreur** qui vaut 0 quand le casse-tête est résolu.
- **Contraintes** : un cube par position ; les couleurs sont **données** (on déplace les cubes, on ne les repeint pas).

Le joueur est **aveugle** : il ne voit pas les couleurs. Il connaît seulement l'erreur de la situation et dispose d'un seul mouvement : **échanger deux cubes voisins**.

**L'erreur** : la somme des écarts de ligne entre cubes de même couleur, chaque paire comptée dans les deux sens :

$$E = \sum_{i \neq j \text{ de même couleur}} |y_i - y_j|$$

où $y_i$ est le numéro de ligne du cube $i$.

**Exemple résolu : calculer l'erreur sur un petit cas.** Trois cubes rouges $r_1$, $r_2$, $r_3$ : $r_1$ et $r_2$ sont sur la ligne 1, $r_3$ sur la ligne 2. « Dans les deux sens » veut dire qu'on compte $(r_1, r_2)$ **et** $(r_2, r_1)$.

| Paire | Lignes | Écart $\lvert y_i - y_j \rvert$ |
|---|---|---|
| $(r_1, r_2)$ et $(r_2, r_1)$ | 1 et 1 | $0 + 0 = 0$ |
| $(r_1, r_3)$ et $(r_3, r_1)$ | 1 et 2 | $1 + 1 = 2$ |
| $(r_2, r_3)$ et $(r_3, r_2)$ | 1 et 2 | $1 + 1 = 2$ |

Total pour les rouges : $0 + 2 + 2 = 4$. On fait la même chose pour chaque couleur et on additionne. Si les trois rouges étaient sur la même ligne, tous les écarts vaudraient 0 : c'est pour ça que l'erreur vaut 0 exactement quand chaque couleur est sur une seule ligne.

**À retenir :** l'erreur ne regarde que les **numéros de ligne** ; deux cubes de même couleur sur la même ligne ne coûtent rien, et chaque paire compte deux fois.

> [!tip] D'où vient l'erreur 32 ?
> Si on échange deux cubes de deux lignes voisines, chacun se retrouve à 1 ligne de ses **8** partenaires de couleur, et chaque paire compte **2** fois : $2 \times 8 \times 2 = 32$.

> [!warning] Le plateau
> L'erreur ne dépend que des **lignes** : échanger deux cubes d'une même ligne ne la change pas. Une zone où le coût ne bouge pas s'appelle un **plateau**. Les échanges horizontaux servent seulement à préparer des échanges verticaux.

Sur la grille 3 × 9, il y a $3 \times 8 = 24$ échanges horizontaux et $2 \times 9 = 18$ échanges verticaux : **42** mouvements possibles.

**Exemple résolu : compter les mouvements sur une grille 2 × 5** (2 lignes de 5 cubes).

1. **Horizontaux** : sur une ligne de 5 cubes, les paires de voisins côte à côte sont (1,2), (2,3), (3,4), (4,5) : **4** paires, toujours une de moins que le nombre de cubes. Avec 2 lignes : $2 \times 4 = 8$.
2. **Verticaux** : il n'y a qu'**une** paire de lignes voisines (1-2). Chaque colonne donne un échange haut-bas, et il y a 5 colonnes : $1 \times 5 = 5$.
3. **Total** : $8 + 5 = 13$ mouvements.

Pour 3 lignes, il y a **deux** paires de lignes voisines (1-2 et 2-3) : les lignes 1 et 3 ne se touchent pas.

**À retenir :** horizontaux = lignes × (cubes par ligne − 1) ; verticaux = (lignes − 1) × colonnes.

### Combien d'états ?

| Modélisation | Un état est… | Nombre d'états | À $10^9$ états/s |
|---|---|---|---|
| A : cubes uniques (retenue) | une permutation des 27 cubes | $27! \approx 1{,}1 \times 10^{28}$ | $\approx 3{,}5 \times 10^{11}$ ans |
| B : coloriages libres | une couleur par position | $3^{27} \approx 7{,}6 \times 10^{12}$ | $\approx 2$ heures |
| A vue par l'erreur | une configuration visible | $\dfrac{27!}{(9!)^3} \approx 2{,}3 \times 10^{11}$ | $\approx 4$ minutes |

On retient A : B compte des états impossibles (27 cubes rouges). Ici la force brute n'est pas impossible, elle est **hors de propos** : le joueur ne peut pas décrire l'état courant, et la taille explose dès que le casse-tête grandit.

**Exemple résolu : d'où viennent ces trois nombres ?** On le voit sur 4 cubes : 2 rouges ($r_1$, $r_2$) et 2 bleus ($b_1$, $b_2$), sur 4 positions.

1. **Cubes uniques** : on range 4 cubes différents dans 4 places : $4! = 4 \times 3 \times 2 \times 1 = 24$ façons.
2. **Configurations visibles** : échanger $r_1$ et $r_2$ ne se voit pas (ce sont deux rouges). Chaque dessin de couleurs est donc compté $2! \times 2! = 4$ fois dans les 24. Il y a $\dfrac{4!}{2! \times 2!} = \dfrac{24}{4} = 6$ dessins différents. Pour les 27 cubes, c'est pareil avec $9!$ par couleur : $\dfrac{27!}{(9!)^3}$.
3. **Coloriages libres** : on choisit une couleur parmi 2 pour chaque place : $2^4 = 16$. Ce nombre contient « rouge, rouge, rouge, rouge », impossible avec seulement 2 rouges : ce modèle décrit un **autre** problème, où l'on pourrait repeindre les cubes.

**À retenir :** $n!$ pour ranger des objets tous différents ; on divise par $k!$ pour chaque groupe de $k$ objets qu'on ne distingue pas ; « couleurs^positions » compte aussi des états impossibles.

**Exemple résolu : convertir un nombre d'états en temps.** On veut énumérer $5 \times 10^{13}$ états à $10^9$ états par seconde.

1. Temps en secondes = nombre d'états ÷ vitesse : $\dfrac{5 \times 10^{13}}{10^9} = 5 \times 10^{4} = 50\,000$ s (on soustrait les puissances : $13 - 9 = 4$).
2. En minutes, on divise par 60 : $\dfrac{50\,000}{60} \approx 833{,}3$ min.
3. En heures, on divise par $3\,600$ (60 × 60) : $\dfrac{50\,000}{3\,600} \approx 13{,}9$ h.

Erreur fréquente : s'arrêter au nombre de secondes alors que la question demande des minutes ou des heures, ou diviser par 60 au lieu de 3 600 pour les heures.

**À retenir :** secondes = états ÷ vitesse, puis ÷ 60 pour des minutes, ÷ 3 600 pour des heures.

## 3. La recherche locale

### Le vocabulaire

- $S$ : l'ensemble des solutions ; $c : S \to \mathbb{R}$ : le **coût** à minimiser.
- **Voisinage** $V(s)$ : les solutions atteignables depuis $s$ en **un** mouvement élémentaire.
- **Optimum local** : une solution $s$ dont aucun voisin n'est strictement meilleur : $c(s') \ge c(s)$ pour tout $s' \in V(s)$.
- **Descente** : on passe à chaque pas à un voisin qui n'aggrave pas le coût. La variante **stricte** n'accepte que les voisins **améliorants** et s'arrête seule sur un optimum local.

L'**optimum global** est la meilleure solution de **toutes** : c'est aussi un optimum local, mais un optimum local n'est pas forcément l'optimum global.

### L'algorithme naïf

```text
1 : à partir de l'état courant, faire une permutation au hasard
2 : évaluer l'erreur du nouvel état
    si elle est plus grande que l'erreur précédente,
    défaire la permutation
3 : recommencer en 1

Arrêt : temps écoulé, nombre de permutations, erreur = 0…
```

Deux variantes sans hasard :

| Variante | Principe |
|---|---|
| **Première amélioration** | prendre le premier voisin améliorant trouvé |
| **Meilleure amélioration** | examiner tout le voisinage et prendre le meilleur (plus cher par pas, moins de pas) |

**Exemple résolu : minima locaux et descente sur un paysage.** Sept solutions sont alignées ; les voisines d'une solution sont celle de gauche et celle de droite (les bouts n'en ont qu'une).

| Solution | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Coût | 6 | 4 | 5 | 2 | 3 | 7 | 1 |

1. **Chercher les minima locaux** : pour chaque solution, on compare son coût à celui de ses voisines.

| Solution | Coût | Coûts des voisines | Une voisine strictement moins chère ? | Minimum local ? |
|---|---|---|---|---|
| 1 | 6 | 4 | oui (4) | non |
| 2 | 4 | 6 et 5 | non | **oui** |
| 3 | 5 | 4 et 2 | oui | non |
| 4 | 2 | 5 et 3 | non | **oui** |
| 5 | 3 | 2 et 7 | oui (2) | non |
| 6 | 7 | 3 et 1 | oui | non |
| 7 | 1 | 7 | non | **oui** |

Les minima locaux sont 2, 4 et 7. Le minimum **global** est le plus petit coût de tout le tableau : la solution 7 (coût 1).

2. **Descente en meilleure amélioration depuis 5** : voisines 4 (coût 2) et 6 (coût 7). La meilleure est 4, et $2 < 3$ : on y va. Depuis 4 : voisines 3 (coût 5) et 5 (coût 3), aucune n'est sous 2 : **arrêt en 4**, coincé à côté du vrai minimum.
3. **Depuis 6, les deux variantes ne vont pas au même endroit** :
   - meilleure amélioration : on regarde les deux voisines, 5 (coût 3) et 7 (coût 1), on prend 7. Arrêt en **7** (coût 1) ;
   - première amélioration, en regardant d'abord la voisine de gauche : 5 (coût 3) est mieux que 7, on la prend tout de suite. Depuis 5, la gauche 4 (coût 2) est mieux : on y va. Arrêt en **4** (coût 2).

Erreur fréquente : s'arrêter sur une solution qui a encore une voisine moins chère (par exemple 5), ou croire que le minimum local trouvé est forcément le minimum global.

**À retenir :** minimum local = aucune voisine **strictement** moins chère ; la descente s'arrête sur le premier qu'elle rencontre, et le résultat dépend du départ et de la variante.

### Le piège : le minimum local

Dans certaines configurations, **aucun** mouvement ne fait baisser l'erreur (ex. : un état d'erreur 112 dont les 42 échanges laissent l'erreur égale ou la font monter). La descente s'arrête alors **sans avoir résolu** le problème, et le résultat **dépend de l'état initial**.

Image : une bille qui roule dans un paysage de collines. Elle s'arrête au fond de la première vallée, même si une vallée voisine est bien plus profonde.

> [!tip] La rustine : le multi-start
> Relancer la descente depuis **plusieurs états initiaux au hasard** et garder la meilleure solution. Bon marché, souvent efficace, mais **sans garantie**.

Dans le paysage ci-dessus, un multi-start qui part de 5 et de 6 (en meilleure amélioration) trouve les coûts 2 et 1 : il garde le meilleur, **1**.

### Le multi-start en probabilités

Si **une** descente lancée au hasard trouve le minimum global avec la probabilité $p$, et que les lancements sont **indépendants** (aucun n'influence les autres) :

- un lancement échoue avec la probabilité $1 - p$ ;
- les $k$ lancements échouent **tous** avec la probabilité $(1 - p)^k$ (indépendants : on multiplie) ;
- **au moins un** réussit avec la probabilité $1 - (1 - p)^k$.

Pour savoir combien de lancements il faut pour atteindre une probabilité $q$, on résout $(1 - p)^k \le 1 - q$ avec le logarithme $\ln$. Comme $\ln(1 - p)$ est **négatif**, diviser par lui **retourne** l'inégalité :

$$k \ge \frac{\ln(1 - q)}{\ln(1 - p)}$$

puis on arrondit **au-dessus** (un nombre de lancements est entier).

**Exemple résolu :** $p = 0{,}3$.

1. Avec 5 lancements : échec de chacun $0{,}7$ ; échec de tous $0{,}7^5 \approx 0{,}168$ ; au moins une réussite $1 - 0{,}168 = 0{,}832$.
2. Pour dépasser 90 % : il faut $0{,}7^k \le 0{,}1$, donc $k \ge \dfrac{\ln 0{,}1}{\ln 0{,}7} \approx \dfrac{-2{,}303}{-0{,}357} \approx 6{,}46$. On arrondit au-dessus : **7** lancements.
3. On vérifie : $0{,}7^6 \approx 0{,}118$ (encore plus de 10 % d'échec, pas assez) et $0{,}7^7 \approx 0{,}082$ (moins de 10 %, c'est bon).

Erreurs fréquentes : écrire $5 \times 0{,}3 = 1{,}5$ (une probabilité ne dépasse jamais 1 : on ne peut pas additionner les chances), ou donner $0{,}7^5$, qui est la probabilité d'échec. Et même 99 % n'est pas une garantie : en pratique, on ne connaît même pas $p$.

**À retenir :** « au moins un succès » = $1 - (\text{échec})^k$ ; pour trouver $k$, passe au $\ln$ et arrondis au-dessus.

```anim
recuit
mode: descente
titre: La bille coincée dans un minimum local
consigne: La descente refuse toute remontée et s’arrête au fond du premier creux. Essaie « Départ au hasard » (multi-start), puis passe au recuit.
```

## 4. Le voyageur de commerce : glouton puis 2-opt

### Construire : le plus proche voisin

Une méthode **gloutonne** fait à chaque étape le choix le meilleur sur le moment, sans revenir en arrière. Pour le TSP : partir d'une ville et aller toujours à la ville non visitée **la plus proche**.

**Exemple résolu : le plus proche voisin sur 5 villes.** Distances entre les villes P, Q, R, S, T :

| | P | Q | R | S | T |
|---|---|---|---|---|---|
| **P** | — | 2 | 1 | 6 | 3 |
| **Q** | 2 | — | 5 | 8 | 2 |
| **R** | 1 | 5 | — | 6 | 8 |
| **S** | 6 | 8 | 6 | — | 8 |
| **T** | 3 | 2 | 8 | 8 | — |

On part de P et, à chaque étape, on lit la ligne de la ville courante en ne regardant que les villes **pas encore visitées** :

| Ville courante | Villes restantes (distance) | Choix |
|---|---|---|
| P | Q 2, R 1, S 6, T 3 | R (1) |
| R | Q 5, S 6, T 8 | Q (5) |
| Q | S 8, T 2 | T (2) |
| T | S 8 | S (8), la seule qui reste |
| S | toutes visitées | retour en P (6) |

Tournée P → R → Q → T → S → P, de longueur $1 + 5 + 2 + 8 + 6 = 22$. S, loin de tout, n'est jamais choisie tant qu'il reste mieux : elle arrive en dernier et coûte cher ($8 + 6$). Erreur fréquente : oublier l'arête du **retour** au départ.

**À retenir :** plus proche voisin = à chaque étape, le minimum de la ligne parmi les villes non visitées, puis on n'oublie pas de revenir au départ ; le résultat dépend de la ville de départ.

### Combien de tournées ?

Une tournée de $n$ villes est un cycle. On fixe la ville de départ (partir d'ailleurs donne le même cycle) : il reste $(n-1)!$ ordres pour les autres villes. Chaque cycle est compté deux fois (une fois dans chaque sens), d'où $\dfrac{(n-1)!}{2}$ tournées distinctes.

**Exemple résolu :** 5 villes. $(5-1)! = 4! = 24$ ordres depuis P, et P → R → Q → T → S → P est la même tournée que P → S → T → Q → R → P (lue à l'envers) : $\dfrac{24}{2} = 12$ tournées.

**À retenir :** $\dfrac{(n-1)!}{2}$ : on fixe le départ, puis on divise par 2 pour le sens de parcours.

### Améliorer : le mouvement 2-opt

Le **2-opt** supprime **deux arêtes** de la tournée et reconnecte dans l'autre sens : cela revient à **inverser un segment**. Si on remplace les arêtes $(a,b)$ et $(c,d)$ par $(a,c)$ et $(b,d)$, l'échange est **améliorant** si :

$$d(a,c) + d(b,d) < d(a,b) + d(c,d)$$

Le **gain** vaut $\big(d(a,b) + d(c,d)\big) - \big(d(a,c) + d(b,d)\big)$. Une tournée de $n$ villes a $\dfrac{n(n-3)}{2}$ voisins 2-opt.

Gain **positif** : la tournée raccourcit de ce gain (échange améliorant). Gain négatif : elle s'allongerait, on refuse. Gain nul : même longueur (un plateau).

**D'où vient $\dfrac{n(n-3)}{2}$ ?** Une tournée de $n$ villes a $n$ arêtes. Pour une arête donnée, on ne peut pas l'associer à elle-même ni à ses 2 voisines (deux arêtes qui se touchent redonnent la même tournée) : il reste $n - 3$ partenaires. Cela fait $n(n-3)$, et chaque paire est comptée deux fois, d'où la division par 2. Exemple : 8 villes donnent $\dfrac{8 \times 5}{2} = 20$ voisins. Ce nombre grandit comme $n^2$ (polynomial) : le voisinage reste petit alors que le nombre de tournées explose.

**Exemple résolu : un pas de 2-opt sur la tournée gloutonne P → R → Q → T → S → P (longueur 22).** On inverse le segment Q…S.

1. **Nouvelle tournée** : on garde P, R, on écrit Q, T, S à l'envers (S, T, Q) : P → R → S → T → Q → P.
2. **Arêtes supprimées** : celle qui **entre** dans le segment, (R,Q), et celle qui en **sort**, (S,P). On le vérifie en comparant les listes : avant (P,R), (R,Q), (Q,T), (T,S), (S,P) ; après (P,R), (R,S), (S,T), (T,Q), (Q,P). Les arêtes **à l'intérieur** du segment, (Q,T) et (T,S), sont toujours là, parcourues à l'envers.
3. **Arêtes ajoutées** : (R,S) et (Q,P).
4. **Gain** : retirées $d(R,Q) + d(S,P) = 5 + 6 = 11$ ; ajoutées $d(R,S) + d(Q,P) = 6 + 2 = 8$ ; gain $= 11 - 8 = 3 > 0$ : améliorant.
5. **Nouvelle longueur** : $22 - 3 = 19$. On vérifie en refaisant la somme : $1 + 6 + 8 + 2 + 2 = 19$.

Ensuite, aucun des 5 voisins 2-opt de P → R → S → T → Q → P n'est plus court : la tournée est **2-optimale**. Ici, en essayant les 12 tournées, on voit que 19 est aussi l'optimum global, mais ce n'est pas garanti en général.

Erreurs fréquentes : faire la soustraction à l'envers (ajoutées − retirées, ce qui change le signe) ; ajouter le gain à la longueur au lieu de le retirer ; repartir de la tournée de départ au lieu de la tournée **courante** pour le pas suivant.

**À retenir :** gain = (retirées) − (ajoutées) ; gain positif = nouvelle longueur = ancienne − gain ; inverser un segment retire seulement l'arête qui y entre et celle qui en sort.

> [!info] Pourquoi « 2-opt » ?
> « 2 » = le nombre d'arêtes retirées ; « opt » = optimal. Une tournée est **2-optimale** quand aucun échange 2-opt ne la raccourcit : c'est exactement un **optimum local** pour ce voisinage. La généralisation **k-opt** retire $k$ arêtes ; Lin et Kernighan (1973) ont rendu $k$ variable.

> [!tip] Même tournée, sens inverse
> Une tournée lue à l'envers passe par les mêmes arêtes : c'est la **même** tournée, de même longueur. P → R → S → T → Q → P et P → Q → T → S → R → P sont identiques. Pour comparer deux tournées, lis l'une d'elles à l'envers en gardant la même ville de départ.

### Exemple : 6 villes

Villes A(4,6), B(1,5), C(2,5), D(4,5), E(1,6), F(4,2). Distances (arrondies au centième) :

| | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| **A** | — | 3,16 | 2,24 | 1,00 | 3,00 | 4,00 |
| **B** | 3,16 | — | 1,00 | 3,00 | 1,00 | 4,24 |
| **C** | 2,24 | 1,00 | — | 2,00 | 1,41 | 3,61 |
| **D** | 1,00 | 3,00 | 2,00 | — | 3,16 | 3,00 |
| **E** | 3,00 | 1,00 | 1,41 | 3,16 | — | 5,00 |
| **F** | 4,00 | 4,24 | 3,61 | 3,00 | 5,00 | — |

Il y a $\dfrac{5!}{2} = 60$ tournées distinctes.

**1. Glouton depuis A** : A → D (1,00) → C (2,00) → B (1,00) → E (1,00) → F (5,00) → A (4,00). Longueur **14,00**. Le glouton laisse F pour la fin : le détour coûte cher.

**2. Descente 2-opt (première amélioration)** :

| Pas | Tournée | Échange | Longueur |
|---|---|---|---|
| 0 | A D C B E F | — | 14,00 |
| 1 | A D E B C F | inverser C…E | 13,77 |
| 2 | A D F C B E | inverser E…F | **12,61** |

Ensuite plus aucun échange n'améliore : optimum local, qui est ici aussi l'optimum global (on le vérifie en énumérant les 60 tournées). Ce n'est pas le cas en général : sur quelques dizaines de villes, glouton + descente finissent souvent quelques pourcents au-dessus de l'optimum.

```anim
voyageur
villes: cours
```

> [!info] Construction, amélioration, métaheuristique
> Le plus proche voisin est une heuristique de **construction** (il crée une solution). Le 2-opt est une heuristique d'**amélioration** (il répare une solution). Une **métaheuristique** est un cadre qui pilote ces briques.

**Exemple résolu : classer trois méthodes.**

| Méthode | Que fait-elle ? | Catégorie |
|---|---|---|
| Insérer les villes une à une, chacune là où elle allonge le moins | part de rien et fabrique une tournée | construction |
| Échanger deux villes de place tant que ça raccourcit | part d'une tournée existante et la retouche | amélioration |
| Multi-start autour d'une descente | pilote une autre méthode (la descente) | cadre au-dessus des briques, comme une métaheuristique |

Pour décider, pose deux questions : « part-elle de rien ? » (construction) ; « part-elle d'une solution existante ? » (amélioration). Si elle **commande** d'autres méthodes (et accepte parfois de dégrader, utilise une population…), c'est une métaheuristique.

**À retenir :** construction = crée, amélioration = répare, métaheuristique = pilote.

## À retenir

- Métaheuristique = méthode générique, souvent aléatoire, **sans garantie** d'optimum.
- Recette : codage + fonction de coût + voisinage.
- Descente : on passe de voisin en voisin sans aggraver le coût ; piège du **minimum local** ; rustine : **multi-start**.
- Multi-start : au moins un succès en $k$ lancements avec la probabilité $1 - (1-p)^k$.
- 2-opt : supprimer deux arêtes = inverser un segment ; améliorant si $d(a,c) + d(b,d) < d(a,b) + d(c,d)$.
- Tournée 2-optimale = optimum local pour le 2-opt.
