# Les algorithmes génétiques

Après la métallurgie, le vivant. Un **algorithme génétique** (AG) ne fait pas évoluer **une** solution mais toute une **population** de solutions, comme la sélection naturelle décrite par Darwin (*De l'origine des espèces*, 1859) : les mieux adaptés se reproduisent davantage, leurs enfants combinent leurs caractères avec quelques mutations, et génération après génération la population s'adapte… ici, à notre fonction de coût.

> [!info] Un randonneur ou une meute ?
> Recherche locale et recuit simulé : **un** randonneur explore le paysage. Algorithme génétique : **une meute** explore plusieurs pistes à la fois et échange de l'information par les croisements.

## 1. Le cycle d'une génération

```text
Initialisation : créer une population (souvent au hasard)
répéter :
    Évaluation   : calculer la fitness de chaque individu
    Sélection    : choisir les reproducteurs (roulette ou tournoi)
    Croisement   : combiner les reproducteurs (probabilité pc ≈ 0,8)
    Mutation     : modifier un peu quelques enfants (pm ≈ 0,01)
    Remplacement : les enfants forment la nouvelle génération
jusqu'au critère d'arrêt (générations, stagnation, temps)
```

## 2. Le vocabulaire

| Terme | Sens dans l'algorithme | Dans le problème |
|---|---|---|
| **Individu** | une solution candidate | une valeur des variables de décision |
| **Gènes** (chromosome) | le codage de la solution (ex. : l'ordre des villes) | la façon d'écrire les variables |
| **Fitness** | la qualité d'un individu, **à maximiser** | la fonction objectif ramenée à un maximum |
| **Individu réalisable** | un individu qu'on a le droit de garder | les contraintes |
| **Population** | un ensemble d'individus traités ensemble | (propre à la méthode) |
| **Génération** | une itération de la boucle | (propre à la méthode) |
| **Sélection** | choisir les parents en favorisant les meilleurs | (propre à la méthode) |
| **Croisement** | combiner deux parents en un ou deux enfants | (propre à la méthode) |
| **Mutation** | perturber rarement un individu | (propre à la méthode) |

> [!warning] Les contraintes ne se traduisent pas toutes seules
> Un croisement ou une mutation peut fabriquer un individu **interdit** (sac trop lourd, tournée qui oublie une ville). Trois réponses :
> 1. **Pénaliser** : garder l'individu mais baisser sa fitness selon l'importance de la violation.
> 2. **Réparer** : corriger l'individu (retirer des objets jusqu'à repasser sous la capacité).
> 3. **Coder pour que l'interdit n'existe pas** : avec un codage par **permutation**, « chaque ville une fois » est automatique. La meilleure option quand c'est possible.

## 3. Codage et fitness

| Codage | Problèmes |
|---|---|
| vecteur binaire (0/1) | sac à dos, sélection de variables |
| permutation | voyageur de commerce, ordonnancement |
| vecteur d'entiers | PLNE |

La fitness doit être **à maximiser**. Pour un coût $c$ à minimiser : $f(s) = \dfrac{1}{c(s)}$, ou $f(s) = c_{\max} - c(s)$ (avec $c_{\max}$ le plus grand coût de la population).

## 4. La sélection

### La roulette (roue de la fortune)

Chaque individu est choisi avec une probabilité **proportionnelle à sa fitness** :

$$P(i) = \frac{f_i}{\sum_j f_j}$$

| Tournée | Longueur $L$ | Fitness $f = 1000/L$ | Probabilité |
|---|---|---|---|
| 1 | 100 | 10,00 | 31,5 % |
| 2 | 120 | 8,33 | 26,3 % |
| 3 | 140 | 7,14 | 22,5 % |
| 4 | 160 | 6,25 | 19,7 % |

La meilleure est favorite, mais la pire garde presque une chance sur cinq : la **diversité** est préservée.

### Le tournoi

On tire **$k$ individus au hasard** (avec remise) et on garde le meilleur des $k$. Le paramètre $k$ règle la **pression de sélection** (à quel point on favorise les meilleurs) :

- $k = 1$ : tirage uniforme, aucune pression ;
- $k$ grand : le meilleur gagne presque toujours ;
- $k = 2$ ou $3$ : le compromis habituel.

Dans une population de $N$ individus, le meilleur gagne si on le tire au moins une fois :

$$P(\text{le meilleur gagne}) = 1 - \left(\frac{N-1}{N}\right)^k$$

| $k$ (avec $N = 10$) | 1 | 2 | 4 | 8 |
|---|---|---|---|---|
| P(le meilleur gagne) | 10 % | 19 % | 34 % | 57 % |

> [!tip] La fitness règle aussi la pression
> Avec $f = 10^4 / L^2$ au lieu de $1000/L$, les tournées longues sont plus pénalisées : la meilleure passe de 31,5 % à 38,5 %. Changer la fonction de fitness, c'est changer la pression de sélection.

## 5. Croisement et mutation

**Croisement un point** (codage binaire) : on coupe les deux parents au même endroit et on échange les fins. Exemple : `1101|0010` et `0110|1100` donnent `11011100` et `01100010`.

**Croisement OX** (permutations) : un croisement naïf produirait des **doublons**. L'OX recopie un segment du parent 1, puis complète avec les villes manquantes **dans l'ordre où elles apparaissent chez le parent 2**, en remplissant à partir de la fin du segment et en revenant au début.

> [!tip] Exemple d'OX (variante du cours, parent 2 lu depuis le début)
> - Parent 1 : `4 2 | 6 1 5 | 3 8 7` ; parent 2 : `1 3 5 7 2 4 6 8`.
> - On recopie le segment `6 1 5` (positions 3 à 5).
> - Villes manquantes dans l'ordre du parent 2 (on saute 6, 1, 5) : `3 7 2 4 8`.
> - On remplit les positions 6, 7, 8 puis 1, 2 : enfant `4 8 | 6 1 5 | 3 7 2`.

**Mutation** : petite perturbation **rare** (environ 1 % des individus) : inverser un bit, échanger deux villes. Exemple : échanger les positions 2 et 7 de `4 8 6 1 5 3 7 2` donne `4 7 6 1 5 3 8 2`. Son rôle : **maintenir la diversité** et réintroduire des gènes perdus.

## 6. Diversité et convergence prématurée

La richesse d'un AG est **toute sa population** : des individus **divers** et **plutôt bons**. Sans diversité, les croisements ne fabriquent que des copies.

| Phénomène | Cause | Remède |
|---|---|---|
| **Dérive génétique** | le hasard de l'échantillonnage fait disparaître des variantes, surtout dans une **petite** population | augmenter la taille de la population |
| **Convergence prématurée** | une sélection **trop dure** (ex. : garder les « N % meilleurs ») recopie le meilleur partout | adoucir la sélection (roulette, tournoi) |

Les deux mènent à une « **armée de clones** » : l'algorithme stagne, c'est l'équivalent d'un minimum local.

| Opérateur | Effet sur la diversité |
|---|---|
| garder les « N % meilleurs » | la détruit |
| roulette | les meilleurs dominent, les autres survivent un peu |
| tournoi | pression réglable par $k$ |
| croisement | explore en réutilisant de grands blocs des parents |
| mutation | réinjecte de la diversité |

> [!tip] L'élitisme
> Recopier d'office **quelques** meilleurs individus dans la génération suivante protège le meilleur sans tuer la diversité. C'est le réglage qui coûte le moins et rapporte le plus.

**Questions qui fâchent** : rien ne garantit que le meilleur survive (d'où l'élitisme) ; les AG explorent et mélangent plus qu'ils ne « descendent », on les termine souvent par une recherche locale (algorithmes **mémétiques**) ; ils ont beaucoup de paramètres, réglés par expérience.

**Réglages conseillés** : population de 50 à 200, $p_c \approx 0{,}8$, $p_m \approx 0{,}01$, élitisme, recherche locale finale si le budget le permet.

## À retenir

- AG = une **population** qui évolue : évaluation, sélection, croisement, mutation, remplacement.
- Fitness **à maximiser** ; contraintes : pénaliser, réparer ou coder pour les éviter.
- Roulette : $P(i) = f_i / \sum f_j$. Tournoi : le meilleur gagne avec $1 - \left(\frac{N-1}{N}\right)^k$.
- Croisement adapté au codage (OX pour les permutations) ; mutation rare pour la diversité.
- Dérive génétique (hasard) ≠ convergence prématurée (sélection trop dure). Élitisme : garder quelques meilleurs.
