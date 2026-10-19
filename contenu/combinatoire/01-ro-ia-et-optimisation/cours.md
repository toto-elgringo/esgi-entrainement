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

> [!tip] Exemple : les tournées de véhicules (VRP)
> Répartir 200 colis entre 8 camionnettes en respectant les horaires des clients et en minimisant les kilomètres.
> - **Variables** : quelle camionnette prend quel colis, et dans quel ordre elle livre.
> - **Objectif** : minimiser le kilométrage total des 8 tournées.
> - **Contraintes** : capacité des camionnettes, fenêtres horaires, chaque colis livré exactement une fois.

## 2. L'intelligence artificielle (IA)

Selon **Marvin Minsky**, l'IA consiste à construire des programmes qui réalisent des tâches que **les humains font encore mieux que les machines**, parce qu'elles demandent des processus mentaux de haut niveau (apprentissage, organisation de la mémoire, raisonnement critique).

Le point clé : **la référence, c'est l'humain**. Une tâche relève de l'IA tant que l'humain la réussit mieux. L'IA n'est pas le robot des films de science-fiction.

Domaines : prédiction (finance, climat, pannes), apprentissage automatique, simulation de comportements humains (bots de jeux, assistants).

> [!info] Le test de Turing
> Une machine « réussit » le test si, en conversation, on ne peut pas la distinguer d'un humain.

## 3. RO et IA : des frontières floues

| | Recherche opérationnelle | Intelligence artificielle |
|---|---|---|
| Question | quelle est la **meilleure** décision ? | comment avoir un comportement **satisfaisant** ? |
| Référence | un objectif chiffré (coût, délai, distance) | l'être humain |
| Optimalité | explicite, souvent prouvée | souvent pas recherchée : « bon en pratique » suffit |
| Méthodes | programmation linéaire, graphes, recherche exacte ou approchée | apprentissage, heuristiques génériques, inférence |

Les **métaheuristiques** (chapitre 2) sont exactement à la frontière : elles traitent des problèmes de RO de manière générique, sans garantir l'optimum.

## 4. L'anatomie d'un problème d'optimisation

Un problème d'optimisation se décrit **toujours** par trois éléments :

1. les **variables de décision** : ce sur quoi on a la main ;
2. la **fonction objectif** : la quantité à **minimiser** ou **maximiser**, calculée à partir des variables ;
3. les **contraintes** : les conditions à respecter.

Une solution qui respecte toutes les contraintes est dite **réalisable**. Résoudre le problème, c'est trouver la **meilleure solution réalisable**.

> [!tip] Le réflexe
> Devant un énoncé, nommer d'abord les variables, l'objectif et les contraintes. La méthode et la complexité en découlent.

> [!info] Problème de décision
> Certains problèmes n'ont pas d'objectif : la réponse est **oui ou non** (« existe-t-il une promenade qui passe une fois sur chaque pont ? »). Tout problème d'optimisation a une **version décision** : « existe-t-il une solution de valeur au moins $K$ ? ». C'est sous cette forme que la théorie de la complexité classe les problèmes.

## 5. L'optimisation combinatoire

Un problème d'**optimisation combinatoire** consiste à choisir la meilleure solution parmi un ensemble **fini** de candidats, selon un critère, sous contraintes. « Fini » ne veut pas dire « petit » : l'ensemble est en général **astronomique**.

Pourquoi « combinatoire » ? L'espace des solutions est **discret** (des permutations, des sous-ensembles, des affectations), pas continu. On ne peut pas dériver une fonction pour trouver son minimum : il faut organiser la recherche autrement.

## 6. Les quatre problèmes fondateurs

### Le voyageur de commerce (TSP)

Dans quel ordre visiter $n$ villes (chacune une fois, avec retour au départ) pour minimiser la distance totale ?

- Variables : l'ordre de visite (une **permutation** des villes).
- Objectif : minimiser la somme des distances.
- Contraintes : chaque ville exactement une fois, retour au point de départ.

Il y a $n!$ ordres de visite, mais seulement $\dfrac{(n-1)!}{2}$ **tournées distinctes** : on peut fixer la ville de départ (on divise par $n$) et le sens de parcours ne compte pas (on divise par 2).

> [!tip] Exemple
> 8 villes en partant de A : $7! = 5\,040$ ordres, soit $\dfrac{5\,040}{2} = 2\,520$ tournées distinctes.

### Le sac à dos

Des objets ont chacun un poids $p_i$ et une valeur $v_i$ ; le sac a une capacité $C$. Quels objets emporter ?

- Variables : $x_i \in \{0, 1\}$ (on prend l'objet $i$ ou non).
- Objectif : maximiser $\sum_i v_i x_i$.
- Contrainte : $\sum_i p_i x_i \le C$.

Avec $n$ objets, il y a $2^n$ choix possibles (chaque objet : pris ou non).

| Objet | A | B | C | D | E |
|---|---|---|---|---|---|
| Poids (kg) | 4 | 5 | 7 | 3 | 6 |
| Valeur (euros) | 10 | 13 | 20 | 6 | 22 |

Avec $C = 15$ kg, le meilleur choix est **A + B + E** : 15 kg pour 45 euros, parmi $2^5 = 32$ sous-ensembles.

### La coloration de graphe

Combien de couleurs au minimum pour colorier les sommets d'un graphe, si deux sommets reliés doivent avoir des couleurs différentes ?

- Variables : la couleur de chaque sommet.
- Objectif : minimiser le nombre de couleurs.
- Contraintes : deux sommets reliés par une arête ont des couleurs différentes.

Application : le **planning d'examens**. Sommets = examens ; arête = un étudiant passe les deux examens ; couleurs = créneaux horaires.

### L'ordonnancement

Dans quel ordre passer des tâches sur des machines pour finir au plus tôt ?

- Variables : la machine de chaque tâche et sa date de début.
- Objectif : minimiser la date de fin de la dernière tâche (le **makespan**).
- Contraintes : une machine traite une tâche à la fois ; certaines tâches doivent passer avant d'autres.

## 7. Reconnaître un problème combinatoire

| Situation | Combinatoire ? | Pourquoi |
|---|---|---|
| Régler une pièce à 21 °C | non | variable continue (température), pas d'ensemble fini : c'est de la commande |
| Affecter 30 étudiants à 6 projets | oui | ensemble fini d'affectations, satisfaction à maximiser |
| Ordre de passage chez 40 clients | oui | permutation de 40 adresses ($40!$ ordres) : c'est un TSP |

> [!warning] Sommets ou arêtes ?
> « Passer chez 40 **clients** » (visiter des sommets) est un voyageur de commerce, difficile. « Passer dans 40 **rues** » (parcourir des arêtes) est le problème du **postier chinois**, qui se résout en temps polynomial (chapitre sur les graphes). Deux énoncés proches, deux difficultés très différentes.

## À retenir

- RO : la meilleure décision selon un objectif chiffré. IA : faire ce que l'humain fait encore mieux, sans forcément viser l'optimum.
- Un problème d'optimisation = **variables + objectif + contraintes** ; réalisable = respecte les contraintes.
- Combinatoire = ensemble **fini** mais énorme, **discret**.
- TSP : $n!$ ordres, $\frac{(n-1)!}{2}$ tournées. Sac à dos : $2^n$ sous-ensembles.
- Coloration : couleurs = créneaux. Ordonnancement : minimiser le makespan.
