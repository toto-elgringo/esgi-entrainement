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

Deux mots à bien distinguer :

- **explorer** : se promener loin dans l'espace des solutions, quitte à passer par des solutions moins bonnes, pour découvrir d'autres vallées ;
- **exploiter** : rester dans la vallée où l'on est et descendre jusqu'à son fond, comme une descente.

**À retenir :** énergie = coût, température = tolérance aux dégradations ; chaud = on explore, froid = on exploite.

## 2. La règle d'acceptation (règle de Metropolis)

Une première idée, $P = e^{-1/T}$, ne convient pas : elle est très sensible au réglage quand $T < 1$, et pour $T$ grand elle accepte presque tout **quelle que soit la taille** de la dégradation. On tient donc compte de l'écart de coût.

On propose un voisin $s'$ de la solution courante $s$ et on note $\Delta E = \text{erreur}(s') - \text{erreur}(s)$.

$$P(\text{accepter } s') = e^{-\Delta E / T}$$

On tire $r$ au hasard dans $[0, 1[$ et on **accepte** si $r < P$.

- Voisin **meilleur** : $\Delta E \le 0$, donc $P \ge 1$ : **toujours accepté**.
- Voisin **moins bon** ($\Delta E > 0$) : accepté d'autant moins souvent que la dégradation est **grosse** et qu'il fait **froid** ($T$ petit).

> [!info] Rappel : l'exponentielle
> $e \approx 2{,}718$, et $e^x$ se calcule à la calculatrice (touche `exp`). Trois repères : $e^0 = 1$ ; si $x < 0$, $e^x$ est entre 0 et 1 (plus $x$ est négatif, plus c'est proche de 0) ; si $x > 0$, $e^x > 1$. Le logarithme $\ln$ fait l'inverse : $\ln(e^x) = x$, et $\ln P < 0$ dès que $P < 1$.

Pourquoi « tirer $r$ et accepter si $r < P$ » donne bien la probabilité $P$ : $r$ est tiré au hasard, de façon uniforme, entre 0 et 1. La chance qu'il tombe sous 0,3 est 30 %, sous 0,8 c'est 80 %, et ainsi de suite.

**Exemple résolu : calculer une probabilité d'acceptation.** Un voisin dégrade l'erreur de $\Delta E = 6$.

| Température | Rapport $\Delta E / T$ | $P = e^{-\Delta E/T}$ | Lecture |
|---|---|---|---|
| $T = 20$ | $6 / 20 = 0{,}3$ | $e^{-0{,}3} \approx 0{,}741$ | passe environ 3 fois sur 4 |
| $T = 6$ | $6 / 6 = 1$ | $e^{-1} \approx 0{,}368$ | passe environ 1 fois sur 3 |
| $T = 2$ | $6 / 2 = 3$ | $e^{-3} \approx 0{,}050$ | passe 1 fois sur 20 |

Méthode : (1) calculer $\Delta E$ ; (2) diviser par $T$ ; (3) mettre un signe moins et prendre l'exponentielle.

Erreurs fréquentes : donner le rapport (0,3) au lieu de la probabilité ; oublier de diviser par $T$ (calculer $e^{-6}$) ; inverser le rapport ($T / \Delta E$).

**À retenir :** $P = e^{-\Delta E/T}$ ne dépend que du rapport $\Delta E / T$ ; quand $\Delta E = T$, $P = e^{-1} \approx 0{,}368$.

**Exemple résolu : accepter ou refuser ?** Solution courante d'erreur 30, température $T = 10$.

1. **Voisin d'erreur 32, tirage $r = 0{,}70$.** $\Delta E = 32 - 30 = 2 > 0$ : dégradation. $P = e^{-2/10} = e^{-0{,}2} \approx 0{,}819$. Est-ce que $0{,}70 < 0{,}819$ ? Oui : **accepté**.
2. **Même voisin, tirage $r = 0{,}85$.** Même $P \approx 0{,}819$, mais $0{,}85 > 0{,}819$ : **refusé**. Le même voisin peut être gardé ou non : seul le hasard du tirage a changé.
3. **Voisin d'erreur 28, tirage $r = 0{,}99$.** $\Delta E = 28 - 30 = -2 \le 0$ : amélioration. $P = e^{2/10} = e^{0{,}2} \approx 1{,}22 > 1$. Tout $r$ de $[0, 1[$ est sous 1,22 : **accepté**, quel que soit le tirage.

Erreurs fréquentes : calculer $\Delta E$ à l'envers (courante − voisin) ; comparer à l'erreur de **départ** ou à la meilleure au lieu de la solution **courante** ; croire qu'un grand tirage fait refuser une amélioration.

**À retenir :** amélioration = toujours acceptée ; dégradation = acceptée seulement si $r < e^{-\Delta E/T}$ (inégalité stricte).

| $\Delta E$ \ $T$ | 100 | 50 | 10 | 5 | 1 |
|---|---|---|---|---|---|
| 1 | 99,0 % | 98,0 % | 90,5 % | 81,9 % | 36,8 % |
| 5 | 95,1 % | 90,5 % | 60,7 % | 36,8 % | 0,7 % |
| 10 | 90,5 % | 81,9 % | 36,8 % | 13,5 % | 0,005 % |
| 50 | 60,7 % | 36,8 % | 0,7 % | 0,005 % | ≈ 0 |

> [!tip] Lire le tableau
> Tout dépend du rapport $\dfrac{\Delta E}{T}$. Quand $\Delta E = T$, $P = e^{-1} \approx 36{,}8$ %. À $T = 100$ la recherche **explore** (même une dégradation de 50 passe 6 fois sur 10) ; à $T = 1$ elle **exploite** (une dégradation de 5 passe 7 fois sur 1 000).

Pour trouver la température qui donne exactement $P = e^{-1}$ à une dégradation donnée, il suffit que $\Delta E / T = 1$, donc $T = \Delta E$. Par exemple, une dégradation de 8 passe avec la probabilité $e^{-1}$ quand $T = 8$ (on prend l'**écart** de coût, pas l'erreur du voisin).

> [!warning] Le signe de ΔE
> En **minimisation**, $\Delta E > 0$ est une dégradation et on calcule $e^{-\Delta E/T}$. En **maximisation** (un profit), une dégradation est une **baisse** du profit : on utilise la taille de cette baisse à la place de $\Delta E$. Vérifie toujours si on minimise ou si on maximise.

Exemple en maximisation : profit courant 100, profit du voisin 94. C'est une baisse de 6 : on calcule $e^{-6/T}$. Un voisin de profit 105 est une amélioration, toujours accepté.

**Pourquoi la première idée $e^{-1/T}$ ne marche pas :** à $T = 10$, elle donne $e^{-0{,}1} \approx 0{,}905$ pour **toutes** les dégradations, qu'elles valent 1 ou 1 000. Une catastrophe passerait aussi souvent qu'un petit écart. Avec $e^{-\Delta E/T}$, une dégradation de 1 passe à 90 % et une de 50 presque jamais.

**À retenir :** la règle de Metropolis tient compte de la **taille** de la dégradation et de la température.

## 3. Le refroidissement

Plusieurs façons de faire baisser $T$ :

- selon le **temps** écoulé ;
- selon le **nombre d'itérations** : décroissance **linéaire** $T(k) = T_0\left(1 - \dfrac{k}{k_{\max}}\right)$ ;
- selon une **loi géométrique** (la plus courante) : $T \leftarrow \alpha \times T$, soit $T(k) = T_0 \times \alpha^k$, avec $\alpha \in [0{,}95 ; 0{,}999]$.

Plus $\alpha$ est proche de 1, plus le refroidissement est **lent** (on explore plus longtemps). Avec $\alpha$ trop petit (par exemple 0,93), la recherche gèle trop tôt : c'est la **trempe**.

Multiplier par $\alpha$, c'est perdre une fraction $1 - \alpha$ de la température à chaque palier : avec $\alpha = 0{,}98$, on perd 2 % de ce qui reste ; avec $\alpha = 0{,}999$, seulement 0,1 %.

**Exemple résolu : la loi géométrique.** $T_0 = 50$, $\alpha = 0{,}9$. Température après 5 paliers ?

1. Chaque palier **multiplie** par 0,9 : après 5 paliers, on a multiplié 5 fois, soit $0{,}9^5$.
2. $0{,}9^5 = 0{,}9 \times 0{,}9 \times 0{,}9 \times 0{,}9 \times 0{,}9 \approx 0{,}590$.
3. $T(5) = 50 \times 0{,}590 \approx 29{,}52$.

Erreurs fréquentes : calculer $50 \times 0{,}9 \times 5$ (on multiplie par le nombre de paliers au lieu d'élever à la puissance) ; retirer 10 % de $T_0$ à chaque fois (ça, c'est une baisse linéaire, qui donnerait 25).

**À retenir :** géométrique = $T_0 \times \alpha^k$, une **puissance**.

**Exemple résolu : linéaire ou géométrique ?** $T_0 = 80$, budget $k_{\max} = 400$ itérations. Loi linéaire $T(k) = 80\left(1 - \dfrac{k}{400}\right)$, loi géométrique $T(k) = 80 \times 0{,}995^k$.

| Itération $k$ | Linéaire | Géométrique |
|---|---|---|
| 100 | $80 \times (1 - 0{,}25) = 60$ | $80 \times 0{,}995^{100} \approx 48{,}46$ |
| 400 | $80 \times (1 - 1) = 0$ | $80 \times 0{,}995^{400} \approx 10{,}77$ |

- La linéaire enlève **la même quantité** à chaque itération ($80 / 400 = 0{,}2$) et atteint exactement 0 à la fin du budget.
- La géométrique enlève **un même pourcentage** : beaucoup au début (quand $T$ est grand), de moins en moins ensuite. Elle est plus froide au début, mais n'atteint **jamais** 0.

Erreur fréquente : donner la baisse (20 après 100 itérations) au lieu de la température restante (60).

**À retenir :** linéaire = même quantité retirée, arrive à 0 ; géométrique = même pourcentage retiré, chute vite au début puis ralentit.

> [!tip] Combien de paliers ?
> Pour descendre de $T_0$ à $T_f$ avec $T(k) = T_0 \alpha^k$ : on cherche le plus petit $k$ tel que $T_0 \alpha^k \le T_f$, soit $k \ge \dfrac{\ln(T_f / T_0)}{\ln \alpha}$.

**Exemple résolu : combien de paliers ?** De $T_0 = 50$ à $T_f = 5$ avec $\alpha = 0{,}9$.

1. On veut $50 \times 0{,}9^k \le 5$, soit $0{,}9^k \le \dfrac{5}{50} = 0{,}1$.
2. On prend le $\ln$ des deux côtés : $k \ln 0{,}9 \le \ln 0{,}1$.
3. $\ln 0{,}9 \approx -0{,}1054$ est **négatif** : diviser par un nombre négatif **retourne** l'inégalité. $k \ge \dfrac{\ln 0{,}1}{\ln 0{,}9} \approx \dfrac{-2{,}303}{-0{,}1054} \approx 21{,}85$.
4. $k$ est un entier : on arrondit **au-dessus**, $k = 22$.
5. Vérification : $50 \times 0{,}9^{21} \approx 5{,}47$ (encore au-dessus de 5) et $50 \times 0{,}9^{22} \approx 4{,}92$ (en dessous).

Erreurs fréquentes : arrondir au plus proche ou tronquer (21 ne suffit pas) ; oublier de retourner l'inégalité ; diviser $T_0$ par $T_f$ au lieu de $T_f$ par $T_0$ (le signe du résultat devient faux).

Avec un $\alpha$ plus proche de 1, $\ln \alpha$ est plus proche de 0, donc la division donne un $k$ **plus grand** : refroidir plus lentement demande plus de paliers.

**À retenir :** $k = \dfrac{\ln(T_f/T_0)}{\ln \alpha}$ arrondi **au-dessus**, puis vérifie avec $k - 1$ et $k$.

> [!info] Théorème de Hajek (1988)
> Avec un refroidissement **logarithmique** $T(k) = \dfrac{c}{\log(k+1)}$ (et $c$ assez grand), le recuit converge **en probabilité** vers l'optimum global. Mais c'est beaucoup trop lent : pour diviser $T$ par 2, il faut **élever au carré** le nombre d'itérations ($k + 1$ devient $(k+1)^2$). En pratique on refroidit géométriquement et on renonce à la garantie.

**Exemple résolu : pourquoi Hajek est trop lent.** On prend $T(k) = \dfrac{c}{\ln(k+1)}$ et on part de $k = 9$, donc $T = \dfrac{c}{\ln 10}$.

1. **Diviser $T$ par 2.** $c$ est fixe, donc il faut **doubler** le dénominateur : $\ln(k'+1) = 2 \ln 10$.
2. Règle du logarithme : $2 \ln 10 = \ln(10^2) = \ln 100$. Donc $k' + 1 = 100$ et $k' = 99$.
3. **Diviser $T$ par 3** : $\ln(k'+1) = 3 \ln 10 = \ln(10^3)$, donc $k' + 1 = 1\,000$ et $k' = 999$.

Pour diviser la température par 2, on est passé de 10 à 100 itérations (on a élevé $k + 1$ au **carré**) ; par 3, au **cube**. En partant de valeurs plus grandes, le nombre d'itérations devient vite astronomique.

Erreurs fréquentes : croire qu'il suffit de doubler $k$ ; oublier le « $+1$ » (et donc le « $-1$ » à la fin).

**À retenir :** avec Hajek, diviser $T$ par $m$ revient à élever $k + 1$ à la puissance $m$ : garantie réelle, mais inutilisable.

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

Dans la condition, $\text{erreur}(s) - \text{erreur}(s') = -\Delta E$ : c'est bien la règle $r < e^{-\Delta E/T}$.

> [!warning] Mémoriser la meilleure solution
> Pendant les phases chaudes, la solution courante peut s'éloigner beaucoup. On retourne donc la **meilleure solution rencontrée**, pas la dernière.

Par rapport à la descente, **une seule chose change** : la décision de garder ou non le voisin. L'état, l'erreur et le voisinage (par exemple le 2-opt pour le TSP) restent les mêmes.

**Exemple résolu : dérouler trois pas.** Solution courante d'erreur 30, $T = 4$, meilleure = 30. Après chaque pas, $T$ est divisée par 2 (4, puis 2, puis 1).

| Pas | $T$ | Courante avant | Voisin | $\Delta E$ | $P$ | Tirage $r$ | Décision | Courante après | Meilleure |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 4 | 30 | 34 | $+4$ | $e^{-1} \approx 0{,}368$ | 0,20 | $0{,}20 < 0{,}368$ : accepté | 34 | 30 |
| 2 | 2 | 34 | 27 | $-7$ | $> 1$ | 0,95 | amélioration : accepté | 27 | 27 |
| 3 | 1 | 27 | 29 | $+2$ | $e^{-2} \approx 0{,}135$ | 0,10 | $0{,}10 < 0{,}135$ : accepté | 29 | 27 |

On retourne la **meilleure** solution, d'erreur **27**, et pas la courante (29).

Points à surveiller à chaque ligne : $\Delta E$ se calcule par rapport à la courante **du moment** (au pas 3, $29 - 27$, pas $29 - 30$) ; la température est celle **du pas** ; la meilleure ne change que si la courante passe en dessous.

**À retenir :** à chaque pas, note la courante, $T$, $\Delta E$, $P$, la décision, puis mets à jour la meilleure ; à la fin, retourne la meilleure.

```anim
recuit
```

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

**Exemple résolu : calibrer $T_0$.** Une dégradation typique vaut $\Delta E = 20$ et on veut l'accepter 90 fois sur 100 au départ ($P_0 = 0{,}9$).

1. On veut $e^{-\Delta E / T_0} = P_0$, soit $e^{-20/T_0} = 0{,}9$.
2. On prend le $\ln$ : $-\dfrac{20}{T_0} = \ln 0{,}9 \approx -0{,}1054$.
3. On isole $T_0$ : $T_0 = \dfrac{-20}{\ln 0{,}9} = \dfrac{-20}{-0{,}1054} \approx 189{,}8$. Les deux signes moins s'annulent, la température est bien positive.

Si on voulait seulement $P_0 = 0{,}5$ : $T_0 = \dfrac{-20}{\ln 0{,}5} \approx \dfrac{20}{0{,}693} \approx 28{,}9$. Plus on veut accepter de dégradations au départ, plus $T_0$ doit être **grande**.

Erreur fréquente : oublier le logarithme et calculer $\dfrac{20}{0{,}9}$.

**À retenir :** $T_0 = \dfrac{-\Delta E}{\ln P_0}$ ; $P_0$ proche de 1 donne une $T_0$ grande.

## À retenir

- Recuit simulé = descente + acceptation **contrôlée** des dégradations.
- Accepter si $r < e^{-\Delta E/T}$ ; une amélioration est toujours acceptée.
- $T$ grand : on explore ; $T$ petit : on exploite. Tout dépend de $\Delta E / T$.
- Refroidissement géométrique $T \leftarrow \alpha T$ ; trop rapide = trempe.
- Hajek : garantie avec $T(k) = c / \log(k+1)$, mais inutilisable en pratique.
- Retourner la **meilleure** solution rencontrée.
