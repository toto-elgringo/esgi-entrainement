# Métaheuristiques et recherche locale

Les problèmes du cours (voyageur de commerce, PLNE…) ont un nombre de solutions **fini mais astronomique** et sont **NP-difficiles**. Les méthodes exactes coûtent trop cher : on renonce à l'optimum global prouvé et on cherche **un bon optimum local, vite**.

## 1. Qu'est-ce qu'une métaheuristique ?

Une **métaheuristique** est une méthode d'optimisation **générique** : un cadre d'algorithme, souvent **stochastique** (il utilise du hasard), qui guide la recherche vers de bonnes solutions quel que soit le problème, **sans garantie d'optimalité**.

« Méta » veut dire « au-dessus » : la méthode **pilote** une heuristique de bas niveau (le voisinage) au lieu de résoudre le problème directement.

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

## 2. L'exemple jouet : 27 cubes de 3 couleurs

On empile **27 cubes** (9 de chaque couleur) en 3 lignes de 9. **But : une seule couleur par ligne.**

- **Variables** : la position de chaque cube (une permutation des 27 cubes).
- **Objectif** : minimiser une **erreur** qui vaut 0 quand le casse-tête est résolu.
- **Contraintes** : un cube par position ; les couleurs sont **données** (on déplace les cubes, on ne les repeint pas).

Le joueur est **aveugle** : il ne voit pas les couleurs. Il connaît seulement l'erreur de la situation et dispose d'un seul mouvement : **échanger deux cubes voisins**.

**L'erreur** : la somme des écarts de ligne entre cubes de même couleur, chaque paire comptée dans les deux sens :

$$E = \sum_{i \neq j \text{ de même couleur}} |y_i - y_j|$$

où $y_i$ est le numéro de ligne du cube $i$.

> [!tip] D'où vient l'erreur 32 ?
> Si on échange deux cubes de deux lignes voisines, chacun se retrouve à 1 ligne de ses **8** partenaires de couleur, et chaque paire compte **2** fois : $2 \times 8 \times 2 = 32$.

> [!warning] Le plateau
> L'erreur ne dépend que des **lignes** : échanger deux cubes d'une même ligne ne la change pas. Une zone où le coût ne bouge pas s'appelle un **plateau**. Les échanges horizontaux servent seulement à préparer des échanges verticaux.

Sur la grille 3 × 9, il y a $3 \times 8 = 24$ échanges horizontaux et $2 \times 9 = 18$ échanges verticaux : **42** mouvements possibles.

### Combien d'états ?

| Modélisation | Un état est… | Nombre d'états | À $10^9$ états/s |
|---|---|---|---|
| A : cubes uniques (retenue) | une permutation des 27 cubes | $27! \approx 1{,}1 \times 10^{28}$ | $\approx 3{,}5 \times 10^{11}$ ans |
| B : coloriages libres | une couleur par position | $3^{27} \approx 7{,}6 \times 10^{12}$ | $\approx 2$ heures |
| A vue par l'erreur | une configuration visible | $\dfrac{27!}{(9!)^3} \approx 2{,}3 \times 10^{11}$ | $\approx 4$ minutes |

On retient A : B compte des états impossibles (27 cubes rouges). Ici la force brute n'est pas impossible, elle est **hors de propos** : le joueur ne peut pas décrire l'état courant, et la taille explose dès que le casse-tête grandit.

## 3. La recherche locale

### Le vocabulaire

- $S$ : l'ensemble des solutions ; $c : S \to \mathbb{R}$ : le **coût** à minimiser.
- **Voisinage** $V(s)$ : les solutions atteignables depuis $s$ en **un** mouvement élémentaire.
- **Optimum local** : une solution $s$ dont aucun voisin n'est strictement meilleur : $c(s') \ge c(s)$ pour tout $s' \in V(s)$.
- **Descente** : on passe à chaque pas à un voisin qui n'aggrave pas le coût. La variante **stricte** n'accepte que les voisins **améliorants** et s'arrête seule sur un optimum local.

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

### Le piège : le minimum local

Dans certaines configurations, **aucun** mouvement ne fait baisser l'erreur (ex. : un état d'erreur 112 dont les 42 échanges laissent l'erreur égale ou la font monter). La descente s'arrête alors **sans avoir résolu** le problème, et le résultat **dépend de l'état initial**.

Image : une bille qui roule dans un paysage de collines. Elle s'arrête au fond de la première vallée, même si une vallée voisine est bien plus profonde.

> [!tip] La rustine : le multi-start
> Relancer la descente depuis **plusieurs états initiaux au hasard** et garder la meilleure solution. Bon marché, souvent efficace, mais **sans garantie**.

## 4. Le voyageur de commerce : glouton puis 2-opt

### Construire : le plus proche voisin

Une méthode **gloutonne** fait à chaque étape le choix le meilleur sur le moment, sans revenir en arrière. Pour le TSP : partir d'une ville et aller toujours à la ville non visitée **la plus proche**.

### Améliorer : le mouvement 2-opt

Le **2-opt** supprime **deux arêtes** de la tournée et reconnecte dans l'autre sens : cela revient à **inverser un segment**. Si on remplace les arêtes $(a,b)$ et $(c,d)$ par $(a,c)$ et $(b,d)$, l'échange est **améliorant** si :

$$d(a,c) + d(b,d) < d(a,b) + d(c,d)$$

Le **gain** vaut $\big(d(a,b) + d(c,d)\big) - \big(d(a,c) + d(b,d)\big)$. Une tournée de $n$ villes a $\dfrac{n(n-3)}{2}$ voisins 2-opt.

> [!info] Pourquoi « 2-opt » ?
> « 2 » = le nombre d'arêtes retirées ; « opt » = optimal. Une tournée est **2-optimale** quand aucun échange 2-opt ne la raccourcit : c'est exactement un **optimum local** pour ce voisinage. La généralisation **k-opt** retire $k$ arêtes ; Lin et Kernighan (1973) ont rendu $k$ variable.

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

> [!info] Construction, amélioration, métaheuristique
> Le plus proche voisin est une heuristique de **construction** (il crée une solution). Le 2-opt est une heuristique d'**amélioration** (il répare une solution). Une **métaheuristique** est un cadre qui pilote ces briques.

## À retenir

- Métaheuristique = méthode générique, souvent aléatoire, **sans garantie** d'optimum.
- Recette : codage + fonction de coût + voisinage.
- Descente : on passe de voisin en voisin sans aggraver le coût ; piège du **minimum local** ; rustine : **multi-start**.
- 2-opt : supprimer deux arêtes = inverser un segment ; améliorant si $d(a,c) + d(b,d) < d(a,b) + d(c,d)$.
- Tournée 2-optimale = optimum local pour le 2-opt.
