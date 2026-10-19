# Un PLNE et la comparaison des méthodes

Pour finir le chapitre 2, on applique les trois méthodes à un petit problème de production, puis on les compare et on retient les conseils de réglage.

## 1. Le problème de l'atelier

Un atelier fabrique deux produits :
- une unité de **x** rapporte 6, consomme 2 unités de matière et 1 heure de travail ;
- une unité de **y** rapporte 9, consomme 5 unités de matière et 1 heure.

Il dispose de 22 unités de matière et de 6 heures. On veut maximiser le profit **en nombres entiers** :

$$
\begin{aligned}
\max\ & z = 6x + 9y \\
\text{sous}\ & 2x + 5y \le 22 \quad \text{(matière)} \\
& x + y \le 6 \quad \text{(heures)} \\
& x, y \in \mathbb{N}
\end{aligned}
$$

- **Variables** : $x$ et $y$, entiers positifs (on ne fabrique pas un tiers de produit).
- **Objectif** : maximiser $z = 6x + 9y$.
- **Contraintes** : matière, heures, intégrité.

> [!info] PLNE
> Un **PLNE** (programme linéaire en nombres entiers) a un objectif et des contraintes **linéaires** (des sommes de « nombre × variable ») et des variables **entières**. La programmation linéaire est étudiée au trimestre 2.

## 2. La lecture exacte

**Relaxation continue** : on oublie l'obligation d'être entier. L'optimum continu est à l'intersection des deux contraintes : $x + y = 6$ donne $x = 6 - y$, puis $2(6 - y) + 5y = 22$, donc $y = \dfrac{10}{3}$ et $x = \dfrac{8}{3}$, pour $z = 46$. Inatteignable en entiers, mais c'est une **borne** : l'optimum entier ne peut pas dépasser 46.

**Arrondir ne suffit pas** : vers le bas, $(2, 3)$ ne donne que $z = 39$. Au plus proche, $(3, 3)$ tombe ici sur l'optimum, mais en général un arrondi peut être **irréalisable** ou **mauvais**.

**Énumération** (possible car le problème est minuscule) :

| $y$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| meilleur $x$ | 6 | 5 | 4 | 3 | 1 |
| profit $z$ | 36 | 39 | 42 | **45** | 42 |

L'optimum entier est $(x, y) = (3, 3)$, $z = 45$, strictement en dessous de la borne 46.

> [!warning] Toute la difficulté des PLNE
> Aucune règle d'arrondi ne relie systématiquement la solution à virgule et l'optimum entier. D'où les solveurs exacts (**branch & bound**) et les méthodes approchées.

## 3. La lecture métaheuristique

- **Codage** : le couple $(x, y)$.
- **Coût** : le profit (à maximiser) ; on rejette les points qui violent une contrainte.
- **Voisinage** : $\pm 1$ sur une des deux coordonnées.

Descente en **meilleure amélioration** depuis $(0, 0)$ :

| Pas | $(x, y)$ | Profit | Mouvement |
|---|---|---|---|
| 0 | (0, 0) | 0 | +y (gain 9, meilleur que +x qui rapporte 6) |
| 1 | (0, 1) | 9 | +y |
| 2 | (0, 2) | 18 | +y |
| 3 | (0, 3) | 27 | +y |
| 4 | (0, 4) | 36 | +x, car (0, 5) dépasserait la matière |
| 5 | (1, 4) | 42 | **bloqué : optimum local** |

Depuis $(1, 4)$, tous les voisins sont moins bons ou irréalisables : la descente s'arrête à **42** alors que l'optimum vaut **45**.

- **Recuit simulé** : il faudrait accepter la dégradation $(1, 4) \to (1, 3)$ (profit 42 → 33), puis remonter $(2, 3)$ (39) puis $(3, 3)$ (45). C'est exactement ce qu'un recuit accepte quand la température est assez haute.
- **Algorithme génétique** : en croisant $(2, 3)$ (profit 39) et $(3, 2)$ (profit 36), en prenant le $x$ de l'un et le $y$ de l'autre, on obtient directement $(3, 3)$, l'optimum, qu'aucun parent n'atteignait.

## 4. Comparaison des trois méthodes

| | Recherche locale | Recuit simulé | Algorithme génétique |
|---|---|---|---|
| Idée | descendre tant que possible | descendre en acceptant des dégradations contrôlées | faire évoluer une population |
| Solutions manipulées | une | une | une population |
| Contre les minima locaux | rien (d'où le multi-start) | acceptation aléatoire $e^{-\Delta E/T}$ | diversité, croisements, mutations |
| Paramètres clés | voisinage, nombre de redémarrages | $T_0$, loi de refroidissement, itérations par palier | taille de population, $p_c$, $p_m$, opérateurs |
| Force | simple, rapide, sert de référence | simple, efficace sur de grandes instances | exploration large, parallélisable |
| Faiblesse | minima locaux | réglage de $T$, gel en fin de course | beaucoup de paramètres, perte de diversité |

## 5. Conseils de réglage

- **Toujours établir une référence** (*baseline*) : une descente **multi-start** (10 à 100 redémarrages). Elle est souvent meilleure qu'on ne le croit.
- **Recuit** : $T_0$ pour 80 à 100 % d'acceptation au départ ; $\alpha \in [0{,}95 ; 0{,}999]$ ; plusieurs itérations par palier ; mémoriser la meilleure solution.
- **AG** : population de 50 à 200 ; $p_c \approx 0{,}8$ ; $p_m \approx 0{,}01$ ; élitisme ; recherche locale finale si possible.
- **Critère d'arrêt réaliste** : temps, itérations sans amélioration, erreur nulle si elle est atteignable. Jamais l'espoir d'une preuve d'optimalité.

> [!warning] Un seul lancement ne prouve rien
> Ces méthodes sont **aléatoires** : deux lancements donnent deux résultats. Pour comparer, on fait **plusieurs lancements** (30 est un standard), sur les mêmes instances et avec le même budget de temps, et on rapporte la **moyenne** et la **dispersion**.

## À retenir

- PLNE : objectif et contraintes linéaires, variables entières. La relaxation continue donne une **borne** (46), pas la solution (45).
- Arrondir la solution continue n'est pas une méthode.
- La descente se bloque en (1, 4) à 42 ; le recuit (en acceptant une dégradation) ou le croisement d'un AG atteignent 45.
- Comparer les méthodes sur plusieurs lancements, contre une descente multi-start.
