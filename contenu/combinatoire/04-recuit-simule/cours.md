# Le recuit simulé

La descente reste coincée dans le premier minimum local. Pour en sortir, il faut accepter **de temps en temps** une solution moins bonne que la solution courante. Le recuit simulé organise ces « remontées » avec une **température** qui baisse peu à peu.

## 1. L'idée venue de la métallurgie

| En métallurgie | En optimisation |
|---|---|
| **Recuit** : chauffer un métal puis le refroidir **lentement** ; les atomes se rangent en un cristal régulier, de basse énergie | refroidir lentement laisse la recherche s'échapper des minima locaux avant de se figer |
| **Trempe** : refroidir brutalement ; le métal se fige avec des défauts | refroidir trop vite = rester bloqué dans un minimum local |
| **Énergie** | **coût** (erreur) de la solution |
| **Température** | paramètre qui règle l'acceptation des dégradations |

Méthode proposée par Kirkpatrick, Gelatt et Vecchi en **1983** (*simulated annealing*).

**Principe** : **explorer d'abord** (accepter beaucoup de dégradations), **optimiser ensuite** (n'accepter presque plus rien). Au départ, la probabilité d'accepter une dégradation vaut presque 1 ; à la fin, presque 0 : la recherche est devenue une simple descente.

## 2. La règle d'acceptation (règle de Metropolis)

Une première idée, $P = e^{-1/T}$, ne convient pas : elle est très sensible au réglage quand $T < 1$, et pour $T$ grand elle accepte presque tout **quelle que soit la taille** de la dégradation. On tient donc compte de l'écart de coût.

On propose un voisin $s'$ de la solution courante $s$ et on note $\Delta E = \text{erreur}(s') - \text{erreur}(s)$.

$$P(\text{accepter } s') = e^{-\Delta E / T}$$

On tire $r$ au hasard dans $[0, 1[$ et on **accepte** si $r < P$.

- Voisin **meilleur** : $\Delta E \le 0$, donc $P \ge 1$ : **toujours accepté**.
- Voisin **moins bon** ($\Delta E > 0$) : accepté d'autant moins souvent que la dégradation est **grosse** et qu'il fait **froid** ($T$ petit).

| $\Delta E$ \ $T$ | 100 | 50 | 10 | 5 | 1 |
|---|---|---|---|---|---|
| 1 | 99,0 % | 98,0 % | 90,5 % | 81,9 % | 36,8 % |
| 5 | 95,1 % | 90,5 % | 60,7 % | 36,8 % | 0,7 % |
| 10 | 90,5 % | 81,9 % | 36,8 % | 13,5 % | 0,005 % |
| 50 | 60,7 % | 36,8 % | 0,7 % | 0,005 % | ≈ 0 |

> [!tip] Lire le tableau
> Tout dépend du rapport $\dfrac{\Delta E}{T}$. Quand $\Delta E = T$, $P = e^{-1} \approx 36{,}8$ %. À $T = 100$ la recherche **explore** (même une dégradation de 50 passe 6 fois sur 10) ; à $T = 1$ elle **exploite** (une dégradation de 5 passe 7 fois sur 1 000).

> [!warning] Le signe de ΔE
> En **minimisation**, $\Delta E > 0$ est une dégradation et on calcule $e^{-\Delta E/T}$. En **maximisation** (un profit), une dégradation est une **baisse** du profit : on utilise la taille de cette baisse à la place de $\Delta E$. Vérifie toujours si on minimise ou si on maximise.

## 3. Le refroidissement

Plusieurs façons de faire baisser $T$ :

- selon le **temps** écoulé ;
- selon le **nombre d'itérations** : décroissance **linéaire** $T(k) = T_0\left(1 - \dfrac{k}{k_{\max}}\right)$ ;
- selon une **loi géométrique** (la plus courante) : $T \leftarrow \alpha \times T$, soit $T(k) = T_0 \times \alpha^k$, avec $\alpha \in [0{,}95 ; 0{,}999]$.

Plus $\alpha$ est proche de 1, plus le refroidissement est **lent** (on explore plus longtemps). Avec $\alpha$ trop petit (par exemple 0,93), la recherche gèle trop tôt : c'est la **trempe**.

> [!tip] Combien de paliers ?
> Pour descendre de $T_0$ à $T_f$ avec $T(k) = T_0 \alpha^k$ : on cherche le plus petit $k$ tel que $T_0 \alpha^k \le T_f$, soit $k \ge \dfrac{\ln(T_f / T_0)}{\ln \alpha}$.

> [!info] Théorème de Hajek (1988)
> Avec un refroidissement **logarithmique** $T(k) = \dfrac{c}{\log(k+1)}$ (et $c$ assez grand), le recuit converge **en probabilité** vers l'optimum global. Mais c'est beaucoup trop lent : pour diviser $T$ par 2, il faut **élever au carré** le nombre d'itérations ($k + 1$ devient $(k+1)^2$). En pratique on refroidit géométriquement et on renonce à la garantie.

## 4. L'algorithme complet

```text
s ← solution initiale ;  T ← T0 ;  meilleure ← s
répéter :
    s' ← un voisin de s (une permutation)
    r  ← nombre au hasard dans [0, 1[
    si r < exp((erreur(s) − erreur(s')) / T) alors s ← s'
    si erreur(s) < erreur(meilleure) alors meilleure ← s
    mettre à jour T              (refroidissement)
jusqu'au critère d'arrêt
retourner meilleure
```

> [!warning] Mémoriser la meilleure solution
> Pendant les phases chaudes, la solution courante peut s'éloigner beaucoup. On retourne donc la **meilleure solution rencontrée**, pas la dernière.

Par rapport à la descente, **une seule chose change** : la décision de garder ou non le voisin. L'état, l'erreur et le voisinage (par exemple le 2-opt pour le TSP) restent les mêmes.

## 5. Bilan et réglages

| Avantages | Inconvénients |
|---|---|
| très simple : une boucle, un tirage, une exponentielle | une fois $T$ presque nulle, plus aucune échappatoire : retour aux défauts de la descente |
| générique : il suffit d'un voisinage et d'un coût | réglage délicat de $T_0$, de la loi de refroidissement et de l'arrêt |
| efficace sur de grandes instances (TSP de milliers de villes) | |

Conseils :
- choisir $T_0$ pour accepter environ **80 à 100 %** des dégradations au départ. Si une dégradation typique vaut $\Delta E$ et qu'on veut l'accepter avec la probabilité $P_0$ : $T_0 = \dfrac{-\Delta E}{\ln P_0}$ ;
- refroidissement géométrique avec $\alpha \in [0{,}95 ; 0{,}999]$, plusieurs itérations par palier ;
- mémoriser la meilleure solution ; s'arrêter quand tout est gelé.

## À retenir

- Recuit simulé = descente + acceptation **contrôlée** des dégradations.
- Accepter si $r < e^{-\Delta E/T}$ ; une amélioration est toujours acceptée.
- $T$ grand : on explore ; $T$ petit : on exploite. Tout dépend de $\Delta E / T$.
- Refroidissement géométrique $T \leftarrow \alpha T$ ; trop rapide = trempe.
- Hajek : garantie avec $T(k) = c / \log(k+1)$, mais inutilisable en pratique.
- Retourner la **meilleure** solution rencontrée.
