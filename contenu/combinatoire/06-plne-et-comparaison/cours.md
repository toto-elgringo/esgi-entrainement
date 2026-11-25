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

« Linéaire » veut dire : pas de $x^2$, pas de $x \times y$, pas de $1/x$, seulement des termes comme $6x$ ou $9y$ additionnés. « En nombres entiers » ajoute l'**intégrité** : $x$ et $y$ ne peuvent valoir que $0, 1, 2, \dots$

### Lire un modèle, pas à pas

Pour une production $(x, y)$ donnée, on fait trois calculs : le profit (objectif), la consommation de chaque ressource, et la comparaison avec ce qui est disponible.

**Exemple résolu sur un autre atelier :**

$$
\begin{aligned}
\max\ & z = 5x + 4y \\
\text{sous}\ & 6x + 4y \le 24 \quad \text{(bois)} \\
& x + 2y \le 6 \quad \text{(heures)} \\
& x, y \in \mathbb{N}
\end{aligned}
$$

| Production $(x, y)$ | Profit $5x + 4y$ | Bois $6x + 4y$ (≤ 24 ?) | Heures $x + 2y$ (≤ 6 ?) | Réalisable ? |
|---|---|---|---|---|
| $(2, 1)$ | $10 + 4 = 14$ | $12 + 4 = 16$ : oui | $2 + 2 = 4$ : oui | oui |
| $(4, 0)$ | $20 + 0 = 20$ | $24 + 0 = 24$ : oui (égalité) | $4 + 0 = 4$ : oui | oui |
| $(3, 2)$ | $15 + 8 = 23$ | $18 + 8 = 26$ : **non** | $3 + 4 = 7$ : **non** | non |
| $(1, 3)$ | $5 + 12 = 17$ | $6 + 12 = 18$ : oui | $1 + 6 = 7$ : **non** | non |

- Une contrainte **tout juste atteinte** (bois $= 24$ pour $(4, 0)$) est respectée : le signe est « $\le$ ».
- **Une seule** contrainte violée suffit pour qu'une production soit irréalisable, comme $(1, 3)$.
- Un profit élevé ($23$ pour $(3, 2)$) ne sert à rien si la production est irréalisable.

Erreur classique : mélanger les coefficients. Le profit utilise les nombres de l'objectif (5 et 4), le bois ceux de la ligne du bois (6 et 4), etc.

**À retenir :** pour un point, calcule l'objectif, puis chaque contrainte avec **ses** coefficients, et vérifie « $\le$ » une par une.

## 2. La lecture exacte

**Relaxation continue** : on oublie l'obligation d'être entier. L'optimum continu est à l'intersection des deux contraintes : $x + y = 6$ donne $x = 6 - y$, puis $2(6 - y) + 5y = 22$, donc $y = \dfrac{10}{3}$ et $x = \dfrac{8}{3}$, pour $z = 46$. Inatteignable en entiers, mais c'est une **borne** : l'optimum entier ne peut pas dépasser 46.

Pourquoi une **borne** ? La relaxation a **plus de choix** que le problème entier (tous les points entiers, plus les points à virgule). Avec plus de choix, on fait aussi bien ou mieux. Donc :

- pour un **maximum**, l'optimum continu est une **borne supérieure** de l'optimum entier ;
- pour un **minimum**, ce serait une **borne inférieure**.

**Exemple résolu : la relaxation de l'autre atelier** ($\max z = 5x + 4y$, bois $6x + 4y \le 24$, heures $x + 2y \le 6$).

1. On cherche le point où les deux contraintes sont **serrées** (égalités) : $6x + 4y = 24$ et $x + 2y = 6$.
2. La 2ᵉ donne $x = 6 - 2y$.
3. On remplace dans la 1ʳᵉ : $6(6 - 2y) + 4y = 24$, soit $36 - 12y + 4y = 24$, soit $36 - 8y = 24$, donc $8y = 12$ et $y = \dfrac{12}{8} = 1{,}5$.
4. Puis $x = 6 - 2 \times 1{,}5 = 3$.
5. Vérification : bois $6 \times 3 + 4 \times 1{,}5 = 18 + 6 = 24$, heures $3 + 2 \times 1{,}5 = 6$. Les deux sont bien serrées.
6. Profit : $z = 5 \times 3 + 4 \times 1{,}5 = 15 + 6 = 21$.

On compare avec les autres coins de la zone autorisée pour être sûr que c'est le maximum :

| Coin | Profit |
|---|---|
| $(0, 0)$ | 0 |
| $(4, 0)$ (bois serré, $y = 0$) | 20 |
| $(3 ; 1{,}5)$ (bois et heures serrés) | **21** |
| $(0, 3)$ (heures serrées, $x = 0$) | 12 |

L'optimum continu vaut 21 : l'optimum entier de cet atelier vaut **au plus** 21.

**À retenir :** relaxation = résoudre le système des contraintes serrées, vérifier, comparer les coins ; son optimum est une borne (supérieure si on maximise).

**Arrondir ne suffit pas** : vers le bas, $(2, 3)$ ne donne que $z = 39$. Au plus proche, $(3, 3)$ tombe ici sur l'optimum, mais en général un arrondi peut être **irréalisable** ou **mauvais**.

**Exemple résolu : arrondir la solution $(3 ; 1{,}5)$ de l'autre atelier.**

| Arrondi | Point | Bois (≤ 24) | Heures (≤ 6) | Réalisable ? | Profit |
|---|---|---|---|---|---|
| vers le bas (partie entière) | $(3, 1)$ | $18 + 4 = 22$ | $3 + 2 = 5$ | oui | $15 + 4 = 19$ |
| vers le haut / au plus proche | $(3, 2)$ | $18 + 8 = 26$ | $3 + 4 = 7$ | **non** | — |

L'arrondi vers le haut sort des contraintes, et l'arrondi vers le bas donne 19, alors que l'optimum entier (calculé plus bas) vaut 20 en $(4, 0)$ : un point qui n'est **pas** voisin de $(3 ; 1{,}5)$. L'**écart** entre deux profits se calcule par une simple soustraction : ici l'arrondi perd $20 - 19 = 1$, et la borne dépasse l'optimum de $21 - 20 = 1$.

**À retenir :** arrondir donne soit un point irréalisable, soit un point réalisable mais pas forcément optimal ; vérifie toujours les contraintes après un arrondi.

**Énumération** (possible car le problème est minuscule) :

| $y$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| meilleur $x$ | 6 | 5 | 4 | 3 | 1 |
| profit $z$ | 36 | 39 | 42 | **45** | 42 |

L'optimum entier est $(x, y) = (3, 3)$, $z = 45$, strictement en dessous de la borne 46.

**Méthode de l'énumération :** pour chaque valeur de $y$, chaque contrainte donne une limite sur $x$. Il faut les respecter **toutes**, donc on garde la **plus petite** limite, arrondie vers le bas (car $x$ est entier). Comme le profit augmente avec $x$, on prend ce plus grand $x$ autorisé.

**Exemple résolu : énumérer l'autre atelier.**

| $y$ | Limite du bois $6x \le 24 - 4y$ | Limite des heures $x \le 6 - 2y$ | Meilleur $x$ | Profit $5x + 4y$ |
|---|---|---|---|---|
| 0 | $x \le 24/6 = 4$ | $x \le 6$ | 4 | **20** |
| 1 | $x \le 20/6 \approx 3{,}33$ | $x \le 4$ | 3 | 19 |
| 2 | $x \le 16/6 \approx 2{,}67$ | $x \le 2$ | 2 | 18 |
| 3 | $x \le 12/6 = 2$ | $x \le 0$ | 0 | 12 |
| 4 | — | $x \le -2$ : impossible | — | — |

Pour $y = 4$, les heures valent déjà $2 \times 4 = 8 > 6$ même avec $x = 0$ : on s'arrête. L'optimum entier est $(4, 0)$ avec $z = 20$, sous la borne 21.

Erreur classique : ne regarder qu'une contrainte. Pour $y = 3$, le bois seul autoriserait $x = 2$, mais alors les heures vaudraient $2 + 6 = 8 > 6$ : seule la limite des heures, $x = 0$, respecte tout.

**À retenir :** pour chaque $y$, la plus petite limite sur $x$ gagne ; puis on garde le $y$ dont le profit est le plus grand.

> [!warning] Toute la difficulté des PLNE
> Aucune règle d'arrondi ne relie systématiquement la solution à virgule et l'optimum entier. D'où les solveurs exacts (**branch & bound**) et les méthodes approchées.

### Le branch & bound, pas à pas

Le **branch & bound** (« séparer et évaluer ») est une méthode **exacte** : elle trouve l'optimum entier **et prouve** qu'on ne peut pas faire mieux.

1. **Évaluer** : on résout la relaxation continue. Si la solution est entière, c'est fini pour cette partie.
2. **Séparer** (*branch*) : si une variable vaut par exemple $1{,}5$, aucune solution entière n'a $y$ entre 1 et 2. On coupe donc le problème en deux branches : $y \le 1$ et $y \ge 2$.
3. **Couper** (*bound*) : la relaxation d'une branche donne une **borne** de tout ce que cette branche contient. Si cette borne est **plus petite** que la meilleure solution entière déjà trouvée, la branche ne peut rien apporter : on l'abandonne sans l'explorer.
4. **Conclure** : quand toutes les branches sont résolues ou coupées, la meilleure solution entière trouvée est **prouvée** optimale.

**Exemple résolu : l'autre atelier.** Relaxation : $(3 ; 1{,}5)$, $z = 21$. La variable $y = 1{,}5$ n'est pas entière.

- **Branche $y \le 1$** : le meilleur point continu est sur $y = 1$ avec le bois serré : $6x = 24 - 4 = 20$, $x = 20/6 \approx 3{,}33$ (les heures $3{,}33 + 2 = 5{,}33 \le 6$ sont respectées). Profit $5 \times 3{,}33 + 4 \approx 20{,}67$. Encore à virgule : on sépare sur $x$.
  - **$x \le 3$** (et $y \le 1$) : le meilleur point est $(3, 1)$, entier, profit 19.
  - **$x \ge 4$** (et $y \le 1$) : le bois impose $6 \times 4 + 4y \le 24$, donc $y = 0$ : point $(4, 0)$, entier, profit **20**. Meilleure solution entière connue : 20.
- **Branche $y \ge 2$** : à $y = 2$, les heures imposent $x \le 2$ et le bois $x \le 2{,}67$, d'où $(2, 2)$ et un profit de 18 ; monter $y$ fait encore baisser le profit. Borne de la branche : 18.
- **Coupe** : $18 < 20$, la branche $y \ge 2$ ne peut pas battre la solution déjà trouvée. On l'abandonne.

Toutes les branches sont résolues ou coupées : $(4, 0)$ avec $z = 20$ est **prouvé** optimal.

Erreur classique : croire qu'il faut toujours explorer une branche jusqu'au bout. Une borne plus petite que la meilleure solution connue suffit pour l'abandonner.

**À retenir :** branch & bound = relaxation, séparation sur une variable à virgule, abandon des branches dont la borne est trop faible ; à la fin, l'optimum est prouvé (ce qu'aucune métaheuristique ne fait).

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

« Meilleure amélioration » veut dire : à chaque pas, on calcule **tous** les voisins réalisables et on va sur celui qui a le **plus grand** profit, à condition qu'il soit meilleur que le point actuel. Si aucun voisin n'est meilleur, on s'arrête : c'est un **optimum local** (meilleur que ses voisins, mais pas forcément le meilleur de tous, l'**optimum global**).

**Exemple résolu : une descente sur l'autre atelier, depuis $(0, 2)$.** Voisins : $(x \pm 1, y)$ et $(x, y \pm 1)$, sans valeur négative, et on rejette ceux qui dépassent le bois (24) ou les heures (6).

| Point | Profit | Voisins (profit, ou « non » si irréalisable) | Choix |
|---|---|---|---|
| $(0, 2)$ | 8 | $(1, 2)$ : 13 ; $(0, 3)$ : 12 ; $(0, 1)$ : 4 | $(1, 2)$ |
| $(1, 2)$ | 13 | $(2, 2)$ : 18 ; $(0, 2)$ : 8 ; $(1, 3)$ : non (heures 7) ; $(1, 1)$ : 9 | $(2, 2)$ |
| $(2, 2)$ | 18 | $(3, 2)$ : non (bois 26) ; $(1, 2)$ : 13 ; $(2, 3)$ : non (heures 8) ; $(2, 1)$ : 14 | **arrêt** |

La descente s'arrête en $(2, 2)$ avec 18 : c'est un optimum local, car l'optimum global vaut 20 en $(4, 0)$. Le point $(2, 2)$ est bien réalisable (bois 20, heures 6) : être bloqué ne veut pas dire être hors des contraintes.

**À retenir :** à chaque pas, liste tous les voisins, raye les irréalisables, prends le meilleur s'il améliore ; sinon tu es sur un optimum local.

- **Recuit simulé** : il faudrait accepter la dégradation $(1, 4) \to (1, 3)$ (profit 42 → 33), puis remonter $(2, 3)$ (39) puis $(3, 3)$ (45). C'est exactement ce qu'un recuit accepte quand la température est assez haute.
- **Algorithme génétique** : en croisant $(2, 3)$ (profit 39) et $(3, 2)$ (profit 36), en prenant le $x$ de l'un et le $y$ de l'autre, on obtient directement $(3, 3)$, l'optimum, qu'aucun parent n'atteignait.

**Le recuit en maximisation.** Quand on maximise, une dégradation est une **baisse** du profit : baisse $=$ profit actuel $-$ profit du voisin, un nombre **positif**. Le recuit accepte ce mouvement avec la probabilité $e^{-\text{baisse}/T}$.

**Exemple résolu :** sur l'autre atelier, depuis $(2, 2)$ (profit 18), le recuit propose $(2, 1)$ (profit 14).

1. Baisse : $18 - 14 = 4$ (positive, on ne met pas de signe moins).
2. À $T = 5$ : $e^{-4/5} = e^{-0{,}8} \approx 0{,}449$, soit environ 45 % de chances d'accepter.
3. À $T = 1$ : $e^{-4/1} = e^{-4} \approx 0{,}018$, soit moins de 2 % : presque toujours refusé.

Erreurs classiques : donner l'exposant ($0{,}8$) au lieu de la probabilité, ou oublier de diviser par $T$.

**À retenir :** baisse positive, divisée par $T$, puis $e^{-\dots}$ ; plus $T$ est petite, plus la même dégradation est refusée.

**Le croisement sur un couple $(x, y)$.** Un enfant prend une coordonnée de chaque parent : le $x$ d'un parent et le $y$ de l'autre.

**Exemple résolu :** sur l'autre atelier, parents $(3, 1)$ (profit 19) et $(2, 2)$ (profit 18).

- Enfant « $x$ du 1ᵉʳ, $y$ du 2ᵉ » : $(3, 2)$, bois $18 + 8 = 26 > 24$ : **irréalisable**, on le rejette.
- Enfant « $x$ du 2ᵉ, $y$ du 1ᵉʳ » : $(2, 1)$, réalisable, profit 14.

Un croisement peut donc donner un enfant meilleur que ses parents (comme $(3, 3)$ sur l'atelier), moins bon, ou même irréalisable. Son intérêt : il **saute** directement vers un point éloigné, sans passer par les points intermédiaires moins bons que la descente refuse.

**À retenir :** croiser $(x_1, y_1)$ et $(x_2, y_2)$ donne $(x_1, y_2)$ et $(x_2, y_1)$ ; vérifie les contraintes de chaque enfant.

```anim
plne
```

## 4. Comparaison des trois méthodes

| | Recherche locale | Recuit simulé | Algorithme génétique |
|---|---|---|---|
| Idée | descendre tant que possible | descendre en acceptant des dégradations contrôlées | faire évoluer une population |
| Solutions manipulées | une | une | une population |
| Contre les minima locaux | rien (d'où le multi-start) | acceptation aléatoire $e^{-\Delta E/T}$ | diversité, croisements, mutations |
| Paramètres clés | voisinage, nombre de redémarrages | $T_0$, loi de refroidissement, itérations par palier | taille de population, $p_c$, $p_m$, opérateurs |
| Force | simple, rapide, sert de référence | simple, efficace sur de grandes instances | exploration large, parallélisable |
| Faiblesse | minima locaux | réglage de $T$, gel en fin de course | beaucoup de paramètres, perte de diversité |

Quelques mots du tableau :

- **multi-start** : relancer la descente depuis plusieurs points de départ différents et garder le meilleur résultat ;
- **gel** : en fin de recuit, $T$ est si petite que plus aucune dégradation n'est acceptée ; le recuit se comporte alors comme une simple descente ;
- **parallélisable** : on peut répartir le travail sur plusieurs processeurs ; dans un AG, la fitness de chaque individu se calcule indépendamment des autres.

**Exemple résolu : reconnaître la méthode à partir d'un indice.** On cherche le mot-clé qui n'appartient qu'à une méthode.

| Indice | Mot-clé | Méthode |
|---|---|---|
| « on règle $T_0$ et $\alpha$ » | température | recuit simulé |
| « on règle la taille de la population et $p_m$ » | population, mutation | algorithme génétique |
| « on relance 50 fois depuis des points au hasard » | redémarrages | recherche locale (multi-start) |
| « s'arrête au premier point sans voisin meilleur » | aucun mécanisme d'échappement | recherche locale |

**À retenir :** température → recuit ; population, croisement, mutation → AG ; ni l'un ni l'autre, juste des redémarrages → recherche locale.

## 5. Conseils de réglage

- **Toujours établir une référence** (*baseline*) : une descente **multi-start** (10 à 100 redémarrages). Elle est souvent meilleure qu'on ne le croit.
- **Recuit** : $T_0$ pour 80 à 100 % d'acceptation au départ ; $\alpha \in [0{,}95 ; 0{,}999]$ ; plusieurs itérations par palier ; mémoriser la meilleure solution.
- **AG** : population de 50 à 200 ; $p_c \approx 0{,}8$ ; $p_m \approx 0{,}01$ ; élitisme ; recherche locale finale si possible.
- **Critère d'arrêt réaliste** : temps, itérations sans amélioration, erreur nulle si elle est atteignable. Jamais l'espoir d'une preuve d'optimalité.

Une **référence** sert d'étalon : si une méthode compliquée (recuit, AG) ne fait pas mieux qu'une descente relancée plusieurs fois, elle ne vaut pas l'effort de la régler.

> [!warning] Un seul lancement ne prouve rien
> Ces méthodes sont **aléatoires** : deux lancements donnent deux résultats. Pour comparer, on fait **plusieurs lancements** (30 est un standard), sur les mêmes instances et avec le même budget de temps, et on rapporte la **moyenne** et la **dispersion**.

### Moyenne et dispersion, pas à pas

- La **moyenne** : on additionne tous les résultats et on divise par le nombre de lancements.
- La **dispersion** dit si les résultats sont serrés ou éparpillés. La mesure la plus simple est l'**étendue** : le plus grand résultat moins le plus petit.
- Une méthode est **régulière** quand son étendue est petite : ses résultats sont prévisibles.

**Exemple résolu :** deux méthodes C et D, coût à **minimiser**, 5 lancements chacune.

| Lancement | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Méthode C | 50 | 51 | 49 | 50 | 50 |
| Méthode D | 42 | 58 | 47 | 53 | 50 |

1. Moyenne de C : $(50 + 51 + 49 + 50 + 50) / 5 = 250 / 5 = 50$.
2. Moyenne de D : $(42 + 58 + 47 + 53 + 50) / 5 = 250 / 5 = 50$.
3. Étendue de C : $51 - 49 = 2$. Étendue de D : $58 - 42 = 16$.
4. Conclusion : même moyenne, mais C est bien plus **régulière**.
5. Piège : en ne regardant que le 1ᵉʳ lancement (50 contre 42), on aurait cru D meilleure. Elle a juste eu de la chance ce coup-là.

Erreurs classiques : prendre le meilleur ou le pire résultat à la place de la moyenne ; calculer l'étendue entre deux lancements voisins au lieu de « plus grand − plus petit ».

**À retenir :** compare sur plusieurs lancements (30), avec la moyenne **et** la dispersion ; un seul lancement peut tromper.

## À retenir

- PLNE : objectif et contraintes linéaires, variables entières. La relaxation continue donne une **borne** (46), pas la solution (45).
- Arrondir la solution continue n'est pas une méthode.
- La descente se bloque en (1, 4) à 42 ; le recuit (en acceptant une dégradation) ou le croisement d'un AG atteignent 45.
- Le branch & bound sépare sur une variable à virgule et coupe les branches dont la borne est trop faible : il **prouve** l'optimum.
- Comparer les méthodes sur plusieurs lancements, contre une descente multi-start.
