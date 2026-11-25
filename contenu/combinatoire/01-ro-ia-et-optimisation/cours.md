# RO, IA et optimisation combinatoire

Ce cours apprend à **reconnaître et modéliser** un problème d'optimisation combinatoire (tournées, sac à dos, coloration, ordonnancement, affectation…), à connaître les grandes familles de méthodes pour le résoudre (métaheuristiques, théorie des graphes, programmation linéaire) et à comprendre **pourquoi** ces problèmes résistent à la force brute.

| Trimestre | Contenu | Évaluation |
|---|---|---|
| 1 | Introduction, métaheuristiques, théorie des graphes | interrogation (CC1) puis partiel de 1 h 30 |
| 2 | Programmation linéaire (graphique, simplexe, PLNE) | interrogation (CC2) puis partiel de 1 h 30 |

> [!info] PLNE
> PLNE = **P**rogrammation **L**inéaire en **N**ombres **E**ntiers : une programmation linéaire où les variables doivent être entières.

## 1. La recherche opérationnelle (RO)

La **recherche opérationnelle**, ou **aide à la décision**, regroupe les méthodes rationnelles qui cherchent **la meilleure façon de faire des choix** pour atteindre le résultat voulu, ou le meilleur résultat possible.

Elle est née de problèmes concrets (logistique militaire de la Seconde Guerre mondiale, puis industrie). Sa démarche ne change pas :

```text
Problème réel  →  Modèle  →  Méthode  →  Solution
(tournées…)       (variables,   (exacte ou     (optimale
                  contraintes,  approchée)     ou bonne)
                  objectif)
```

Domaines typiques : gestion de projets, emplois du temps, tournées de livraison, production, transport et réseaux.

Ce que la RO n'est **pas** : imiter un humain (c'est plutôt l'IA), stocker des données (c'est une base de données) ou prouver des théorèmes de logique. La RO **décide** : parmi plusieurs choix possibles, lequel donne le meilleur résultat chiffré ?

> [!tip] Exemple : les tournées de véhicules (VRP)
> Le **VRP** (*Vehicle Routing Problem*, problème de tournées de véhicules) : plusieurs véhicules partent d'un dépôt et se partagent des clients à servir. Exemple : 3 camions-bennes doivent vider 50 points de collecte de déchets dans la journée.
> - **Variables** : quel camion vide quel point, et dans quel ordre.
> - **Objectif** : minimiser la distance totale des 3 tournées.
> - **Contraintes** : un camion ne peut pas dépasser sa charge maximale, chaque point est vidé exactement une fois.

**À retenir :** la RO cherche **la meilleure décision** selon un objectif chiffré (coût, distance, délai).

## 2. L'intelligence artificielle (IA)

Selon **Marvin Minsky**, l'IA consiste à construire des programmes qui réalisent des tâches que **les humains font encore mieux que les machines**, parce qu'elles demandent des processus mentaux de haut niveau (apprentissage, organisation de la mémoire, raisonnement critique).

Le point clé : **la référence, c'est l'humain**. Une tâche relève de l'IA tant que l'humain la réussit mieux. L'IA n'est pas le robot des films de science-fiction.

Domaines : prédiction (finance, climat, pannes), apprentissage automatique, simulation de comportements humains (bots de jeux, assistants).

> [!info] Le test de Turing
> Une machine « réussit » le test si, en conversation, on ne peut pas la distinguer d'un humain.

**Exemple résolu : la reconnaissance de l'écriture manuscrite relève-t-elle de l'IA ?**

1. On compare avec l'humain : un humain lit sans effort une écriture penchée ou mal formée.
2. Pendant longtemps, les machines en étaient incapables : l'humain faisait **mieux**.
3. Donc c'est bien une tâche d'IA au sens de Minsky. On ne demande pas une lecture « optimale », seulement une lecture **satisfaisante**, aussi bonne que celle d'un humain.

À l'inverse, additionner un million de nombres n'est pas de l'IA : la machine le fait déjà bien mieux que nous.

**À retenir :** pour l'IA, la question est « l'humain fait-il encore mieux que la machine ? », pas « quelle est la meilleure solution ? ».

## 3. RO et IA : des frontières floues

| | Recherche opérationnelle | Intelligence artificielle |
|---|---|---|
| Question | quelle est la **meilleure** décision ? | comment avoir un comportement **satisfaisant** ? |
| Référence | un objectif chiffré (coût, délai, distance) | l'être humain |
| Optimalité | explicite, souvent prouvée | souvent pas recherchée : « bon en pratique » suffit |
| Méthodes | programmation linéaire, graphes, recherche exacte ou approchée | apprentissage, heuristiques génériques, inférence |

Les **métaheuristiques** (chapitre 2) sont exactement à la frontière : elles traitent des problèmes de RO de manière générique, sans garantir l'optimum.

**À retenir :** RO = la meilleure solution, mesurée par un chiffre ; IA = une solution satisfaisante, mesurée par rapport à l'humain.

## 4. L'anatomie d'un problème d'optimisation

Un problème d'optimisation se décrit **toujours** par trois éléments :

1. les **variables de décision** : ce sur quoi on a la main ;
2. la **fonction objectif** : la quantité à **minimiser** ou **maximiser**, calculée à partir des variables ;
3. les **contraintes** : les conditions à respecter.

Une solution qui respecte toutes les contraintes est dite **réalisable**. Résoudre le problème, c'est trouver la **meilleure solution réalisable** : on l'appelle la solution **optimale**. Une solution optimale est donc forcément réalisable, mais une solution réalisable n'est pas forcément optimale.

> [!tip] Le réflexe
> Devant un énoncé, nommer d'abord les variables, l'objectif et les contraintes. La méthode et la complexité en découlent.

Attention à un quatrième type d'élément, qui n'est **rien de tout ça** : les **données** (ou paramètres). Ce sont les nombres imposés par l'énoncé, que l'on ne choisit pas : le nombre de véhicules disponibles, la capacité d'un véhicule, les horaires d'ouverture d'un client, les distances. Ils servent à **écrire** les contraintes, mais ce ne sont pas des variables.

**Exemple résolu : une équipe de fantasy football.** On doit choisir 5 joueurs parmi 12, avec un budget de 100 millions, pour maximiser le nombre de points prévus de l'équipe.

On classe chaque morceau de l'énoncé en se posant trois questions : « est-ce que je le choisis ? » (variable), « est-ce que je veux le rendre le plus grand ou le plus petit possible ? » (objectif), « est-ce une condition à ne pas violer ? » (contrainte). Sinon, c'est une donnée.

| Élément de l'énoncé | Je le choisis ? | Je l'optimise ? | Condition à respecter ? | Rôle |
|---|---|---|---|---|
| pour chaque joueur : pris ou non | oui | non | non | **variable** |
| maximiser les points prévus | non | oui | non | **objectif** |
| ne pas dépasser 100 millions | non | non | oui | **contrainte** |
| exactement 5 joueurs | non | non | oui | **contrainte** |
| le prix de chaque joueur | non | non | non | **donnée** (sert dans la contrainte de budget) |

Une équipe de 5 joueurs qui coûte 98 millions est **réalisable**. Une équipe qui coûte 104 millions ne l'est pas, même si elle marque beaucoup de points.

Erreur fréquente : prendre une contrainte pour l'objectif. « Ne pas dépasser le budget » est une condition (oui ou non), pas une quantité qu'on cherche à rendre la plus petite possible.

**À retenir :** variable = ce que je choisis ; objectif = ce que je minimise ou maximise (un seul nombre) ; contrainte = ce que je dois respecter ; donnée = ce que l'énoncé m'impose.

> [!info] Problème de décision
> Certains problèmes n'ont pas d'objectif : la réponse est **oui ou non** (« existe-t-il une promenade qui passe une fois sur chaque pont ? »). Tout problème d'optimisation a une **version décision** : « existe-t-il une solution de valeur au moins $K$ ? ». C'est sous cette forme que la théorie de la complexité classe les problèmes.

**Exemple résolu : décision ou optimisation ?** On repère la forme de la réponse attendue.

| Question | Réponse attendue | Type |
|---|---|---|
| « Peut-on finir toutes les tâches en 8 heures ? » | oui ou non | décision |
| « Quel est le plus petit temps pour finir toutes les tâches ? » | une solution et sa valeur | optimisation |
| « Existe-t-il une affectation où chaque étudiant a l'un de ses 2 premiers vœux ? » | oui ou non | décision |
| « Quelle affectation satisfait le plus d'étudiants ? » | une solution et sa valeur | optimisation |

Pour passer d'une optimisation à sa version décision, on garde les mêmes contraintes et on remplace « le meilleur » par un **seuil** $K$ :

- si l'on **minimise** (un temps, une distance) : « existe-t-il une solution de valeur **au plus** $K$ ? » ;
- si l'on **maximise** (une valeur, un gain) : « existe-t-il une solution de valeur **au moins** $K$ ? ».

Exemple : « minimiser le temps de fin » devient « existe-t-il un planning qui finit en au plus 8 heures ? ». Erreur fréquente : poser une autre question (« combien de tâches ? », « la machine est-elle pleine ? ») au lieu de reprendre l'objectif avec un seuil.

**À retenir :** « existe-t-il… ? », « suffit-il… ? », « peut-on… ? » = décision ; « trouver le meilleur… » = optimisation. Version décision = mêmes contraintes + « valeur au moins (ou au plus) $K$ ».

## 5. L'optimisation combinatoire

Un problème d'**optimisation combinatoire** consiste à choisir la meilleure solution parmi un ensemble **fini** de candidats, selon un critère, sous contraintes. « Fini » ne veut pas dire « petit » : l'ensemble est en général **astronomique**.

Pourquoi « combinatoire » ? L'espace des solutions est **discret** (des permutations, des sous-ensembles, des affectations), pas continu. On ne peut pas dériver une fonction pour trouver son minimum : il faut organiser la recherche autrement.

Le nom ne vient donc pas du fait qu'on « combine » plusieurs ordinateurs, ni de la forme de l'objectif : il vient des **combinaisons** possibles (ordres, choix, affectations) parmi lesquelles on cherche.

Trois familles d'objets discrets reviennent tout le temps, avec leur nombre :

| Ce qu'on choisit | Exemple | Nombre de candidats |
|---|---|---|
| un **ordre** de $n$ éléments (permutation) | ordre de passage chez $n$ clients | $n! = 1 \times 2 \times \dots \times n$ |
| un **sous-ensemble** de $n$ éléments | quels objets mettre dans un sac | $2^n$ (chaque élément : pris ou non) |
| une **affectation** de $n$ éléments à $k$ choix | quel projet pour chaque étudiant | $k^n$ ($k$ choix pour chacun des $n$) |

**Exemple résolu : affecter 4 tâches à 3 employés.** Chaque tâche est donnée à l'un des 3 employés.

1. La 1re tâche a 3 employés possibles.
2. Pour **chacun** de ces choix, la 2e tâche a encore 3 possibilités : $3 \times 3 = 9$.
3. On continue : $3 \times 3 \times 3 \times 3 = 3^4 = 81$ affectations.

C'est un nombre **fini** : on peut, en principe, les examiner toutes et garder la meilleure. C'est donc un problème combinatoire. Avec 40 tâches, on aurait $3^{40} \approx 1{,}2 \times 10^{19}$ affectations : toujours fini, mais impossible à tout examiner.

**À retenir :** combinatoire = on choisit parmi des ordres, des sous-ensembles ou des affectations, en nombre fini (souvent gigantesque) ; on compte en multipliant les possibilités de chaque choix.

## 6. Les quatre problèmes fondateurs

### Le voyageur de commerce (TSP)

Dans quel ordre visiter $n$ villes (chacune une fois, avec retour au départ) pour minimiser la distance totale ? En anglais : *Travelling Salesman Problem*, d'où le sigle **TSP**.

- Variables : l'ordre de visite (une **permutation** des villes).
- Objectif : minimiser la somme des distances.
- Contraintes : chaque ville exactement une fois, retour au point de départ.

Il y a $n!$ ordres de visite, mais seulement $\dfrac{(n-1)!}{2}$ **tournées distinctes** : on peut fixer la ville de départ (on divise par $n$) et le sens de parcours ne compte pas (on divise par 2).

Rappel : la **factorielle** $n!$ (« factorielle $n$ ») est le produit $1 \times 2 \times 3 \times \dots \times n$. Par exemple $3! = 6$, $4! = 24$. Elle compte les ordres de $n$ éléments : $n$ choix pour le 1er, $n - 1$ pour le 2e, etc.

**Exemple résolu : 4 villes A, B, C, D.**

1. **Ordres de visite** : $4! = 4 \times 3 \times 2 \times 1 = 24$.
2. **On fixe le départ en A** (une tournée est une boucle : partir de B ou de A revient au même circuit). Il reste à ordonner B, C, D : $3! = 6$ ordres. C'est bien $\dfrac{24}{4} = 6$.
3. **Le sens ne compte pas** : A → B → C → D → A et A → D → C → B → A utilisent les mêmes trajets (AB, BC, CD, DA), donc ont la même longueur. On regroupe les ordres deux par deux :

| Ordre | Ordre inverse | Même tournée |
|---|---|---|
| A B C D | A D C B | tournée 1 |
| A B D C | A C D B | tournée 2 |
| A C B D | A D B C | tournée 3 |

4. Il reste $\dfrac{6}{2} = 3$ tournées distinctes, et la formule donne bien $\dfrac{(4-1)!}{2} = \dfrac{3!}{2} = 3$.

Erreur fréquente : répondre $n!$ (on compte chaque boucle $2n$ fois) ou $(n-1)!$ (on oublie le sens).

> [!tip] Exemple
> 6 villes en partant de A : il reste 5 villes à ordonner, soit $5! = 120$ ordres, et $\dfrac{120}{2} = 60$ tournées distinctes.

**À retenir :** ordres = $n!$ ; départ fixé = $(n-1)!$ ; sens ignoré en plus = $\dfrac{(n-1)!}{2}$.

### Le sac à dos

Des objets ont chacun un poids $p_i$ et une valeur $v_i$ ; le sac a une capacité $C$. Quels objets emporter ?

- Variables : $x_i \in \{0, 1\}$ (on prend l'objet $i$ ou non).
- Objectif : maximiser $\sum_i v_i x_i$.
- Contrainte : $\sum_i p_i x_i \le C$.

Avec $n$ objets, il y a $2^n$ choix possibles (chaque objet : pris ou non).

Comment lire ces formules : $\sum_i v_i x_i$ veut dire « $v_1 x_1 + v_2 x_2 + \dots$ ». Comme $x_i$ vaut 1 si l'objet est pris et 0 sinon, le produit $v_i x_i$ vaut $v_i$ pour un objet pris et 0 pour un objet laissé : la somme est donc **la valeur totale des objets pris**. De même, $\sum_i p_i x_i$ est **le poids total des objets pris**, et la contrainte dit qu'il ne doit pas dépasser $C$.

On maximise la **valeur** (pas le poids, ni le nombre d'objets), et c'est le **poids** qui est limité par $C$ (pas la valeur). La contrainte est un $\le$ : on a le droit de ne pas remplir le sac complètement.

**Exemple résolu : 3 objets, sac de 5 kg.** X pèse 2 kg et vaut 3 euros, Y pèse 3 kg et vaut 4 euros, Z pèse 4 kg et vaut 6 euros. On écrit $x = (x_X, x_Y, x_Z)$.

On examine les $2^3 = 8$ sous-ensembles, un par un :

| $x$ | Objets pris | Poids $\sum_i p_i x_i$ | Réalisable ($\le 5$) ? | Valeur $\sum_i v_i x_i$ |
|---|---|---|---|---|
| (0, 0, 0) | aucun | 0 | oui | 0 |
| (1, 0, 0) | X | 2 | oui | 3 |
| (0, 1, 0) | Y | 3 | oui | 4 |
| (0, 0, 1) | Z | 4 | oui | 6 |
| (1, 1, 0) | X + Y | 2 + 3 = 5 | oui | 3 + 4 = **7** |
| (1, 0, 1) | X + Z | 2 + 4 = 6 | **non** | (9, interdit) |
| (0, 1, 1) | Y + Z | 3 + 4 = 7 | **non** | (10, interdit) |
| (1, 1, 1) | X + Y + Z | 9 | **non** | (13, interdit) |

Parmi les lignes réalisables, la meilleure valeur est **7 euros** avec X + Y. Deux pièges :

- Z est l'objet le plus précieux, mais le prendre seul (6 euros) fait moins bien que X + Y : prendre « le meilleur objet d'abord » ne suffit pas.
- X + Z vaut 9 euros, mais pèse 6 kg : une solution qui ne respecte pas la contrainte ne compte pas, quelle que soit sa valeur.

**À retenir :** pour chaque choix, calcule d'abord le poids (réalisable ?), puis seulement la valeur ; la réponse est la meilleure valeur **parmi les réalisables**.

Le tableau ci-dessous sert aux exercices du chapitre (à toi de trouver le meilleur chargement) :

| Objet | A | B | C | D | E |
|---|---|---|---|---|---|
| Poids (kg) | 4 | 5 | 7 | 3 | 6 |
| Valeur (euros) | 10 | 13 | 20 | 6 | 22 |

Avec $C = 15$ kg, il y a $2^5 = 32$ sous-ensembles à comparer.

### La coloration de graphe

Combien de couleurs au minimum pour colorier les sommets d'un graphe, si deux sommets reliés doivent avoir des couleurs différentes ?

- Variables : la couleur de chaque sommet.
- Objectif : minimiser le nombre de couleurs.
- Contraintes : deux sommets reliés par une arête ont des couleurs différentes.

Application : le **planning d'examens**. Sommets = examens ; arête = un étudiant passe les deux examens ; couleurs = créneaux horaires.

Pourquoi ça marche : deux examens reliés ont un étudiant en commun, il ne peut pas être à deux endroits à la fois, donc ils doivent avoir des créneaux (des couleurs) différents. Les étudiants et les salles n'apparaissent pas comme sommets : les étudiants servent seulement à décider où mettre les arêtes.

Pour trouver le nombre minimum de couleurs, on montre deux choses :

1. **Il en faut au moins $k$** : on cherche $k$ sommets **tous reliés deux à deux**. Ils doivent tous avoir des couleurs différentes, donc au moins $k$ couleurs. Trois sommets tous reliés entre eux (un **triangle**) forcent déjà 3 couleurs.
2. **$k$ suffisent** : on donne une coloration concrète avec $k$ couleurs et on vérifie chaque arête.

**Exemple résolu : quatre examens** Histoire (H), Chimie (C), Droit (D), Économie (E). Conflits : H-C, C-D, D-H, D-E.

1. **Au moins 3 ?** H, C et D sont reliés deux à deux (H-C, C-D, D-H) : c'est un triangle. Avec 2 couleurs, deux d'entre eux auraient la même couleur alors qu'ils sont reliés. Donc 2 créneaux ne suffisent pas.
2. **3 suffisent ?** On place les sommets un par un en prenant la plus petite couleur libre :
   - H : créneau 1.
   - C (relié à H) : créneau 2.
   - D (relié à H et C) : créneau 3.
   - E (relié seulement à D, qui a le créneau 3) : créneau 1.
3. **Vérification arête par arête** : H-C (1 et 2), C-D (2 et 3), D-H (3 et 1), D-E (3 et 1) : toutes différentes.

Le minimum est donc **3 créneaux**. Erreur fréquente : répondre 4 parce qu'il y a 4 examens. Deux examens **non reliés** (ici H et E) peuvent partager un créneau.

**À retenir :** un groupe de $k$ sommets tous reliés impose au moins $k$ couleurs ; une coloration vérifiée avec $k$ couleurs prouve que $k$ suffisent. Si les deux nombres sont égaux, c'est le minimum.

### L'ordonnancement

Dans quel ordre passer des tâches sur des machines pour finir au plus tôt ?

- Variables : la machine de chaque tâche et sa date de début.
- Objectif : minimiser la date de fin de la dernière tâche (le **makespan**).
- Contraintes : une machine traite une tâche à la fois ; certaines tâches doivent passer avant d'autres.

Le makespan n'est ni le nombre de machines, ni le nombre de tâches, ni la durée d'une tâche : c'est **l'heure à laquelle tout est fini**, c'est-à-dire la charge de la machine qui finit en dernier.

**Une règle simple (heuristique de liste)** : on prend les tâches dans l'ordre donné et on place chacune sur la machine **la moins chargée** à ce moment-là. C'est rapide, mais pas toujours optimal.

**Une borne inférieure** : avec $m$ machines identiques, le travail total est partagé entre elles. Même avec un partage parfait, chaque machine travaille au moins $\dfrac{\text{durée totale}}{m}$. **Aucun** makespan ne peut descendre en dessous. Si l'on trouve un planning qui atteint cette borne, il est forcément **optimal**.

**Exemple résolu : 4 tâches de 4, 2, 3 et 3 heures sur 2 machines identiques.**

1. **La règle, pas à pas** (en cas d'égalité, machine 1) :

| Tâche | Charge M1 avant | Charge M2 avant | Placée sur | Charge M1 après | Charge M2 après |
|---|---|---|---|---|---|
| 4 h | 0 | 0 | M1 (égalité) | 4 | 0 |
| 2 h | 4 | 0 | M2 | 4 | 2 |
| 3 h | 4 | 2 | M2 | 4 | 5 |
| 3 h | 4 | 5 | M1 | 7 | 5 |

La dernière machine finit à 7 h : makespan **7 heures** avec la règle.

2. **La borne** : durée totale $4 + 2 + 3 + 3 = 12$ h, divisée par 2 machines : **6 heures**. Aucun planning ne peut finir avant 6 h.
3. **Peut-on atteindre 6 ?** Il faut deux groupes de 6 h exactement : $\{4, 2\}$ et $\{3, 3\}$. Oui : M1 fait 4 h + 2 h, M2 fait 3 h + 3 h, tout finit à 6 h.
4. **Conclusion** : l'optimum est **6 heures**, la règle simple donnait 7 heures.

Erreurs fréquentes : additionner toutes les durées (12 h, comme s'il n'y avait qu'une machine) ; croire que la règle simple donne toujours l'optimum.

**À retenir :** makespan = fin de la machine la plus chargée ; borne = total ÷ nombre de machines ; un planning qui atteint la borne est optimal.

## 7. Reconnaître un problème combinatoire

Pour décider, on se pose deux questions :

1. Les solutions possibles se **comptent**-elles (ordres, choix oui/non, affectations), ou bien la variable peut-elle prendre n'importe quelle valeur dans un intervalle (température, vitesse, pression) ?
2. Y a-t-il un **critère** à optimiser (une quantité à minimiser ou maximiser) ?

Deux « oui » (solutions dénombrables + critère) : c'est de l'optimisation combinatoire.

| Situation | Combinatoire ? | Pourquoi |
|---|---|---|
| Régler la vitesse d'un ventilateur pour un débit d'air voulu | non | variable continue (la vitesse peut valoir 1 203,7 tours/min…), pas d'ensemble fini : c'est de la commande |
| Choisir 4 villes parmi 10 pour ouvrir des entrepôts au moindre coût | oui | ensemble fini de choix (210 groupes de 4), coût à minimiser |
| Ordre de passage de 25 commandes sur une machine | oui | permutation de 25 commandes ($25!$ ordres) |
| Calculer le prix TTC d'un article | non | un simple calcul, rien à choisir ni à optimiser |

**À retenir :** combinatoire = un nombre fini (même énorme) de candidats discrets + un critère à optimiser ; une grandeur continue à régler ou un simple calcul n'en sont pas.

> [!warning] Sommets ou arêtes ?
> Dans un graphe routier, les **adresses** sont des sommets et les **rues** sont des arêtes (des liens entre deux adresses). « Passer à 30 **adresses** » (visiter des sommets, chacun une fois) est un voyageur de commerce, difficile. « Passer dans 30 **rues** » (parcourir chaque arête au moins une fois, comme un chasse-neige qui doit dégager toutes les rues) est le problème du **postier chinois**, qui se résout en temps polynomial (chapitre sur les graphes). Deux énoncés proches, deux difficultés très différentes : il faut donc toujours se demander si l'on visite des **points** ou si l'on parcourt des **liens**.

## À retenir

- RO : la meilleure décision selon un objectif chiffré. IA : faire ce que l'humain fait encore mieux, sans forcément viser l'optimum.
- Un problème d'optimisation = **variables + objectif + contraintes** ; réalisable = respecte les contraintes ; optimale = la meilleure des réalisables.
- Décision = réponse oui/non ; version décision d'une optimisation = « existe-t-il une solution de valeur au moins (au plus) $K$ ? ».
- Combinatoire = ensemble **fini** mais énorme, **discret**.
- TSP : $n!$ ordres, $\frac{(n-1)!}{2}$ tournées. Sac à dos : $2^n$ sous-ensembles. Affectation de $n$ éléments à $k$ choix : $k^n$.
- Coloration : couleurs = créneaux ; $k$ sommets tous reliés imposent $k$ couleurs. Ordonnancement : minimiser le makespan, jamais en dessous de total ÷ machines.
