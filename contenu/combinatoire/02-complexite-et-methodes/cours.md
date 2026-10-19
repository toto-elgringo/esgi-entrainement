# Complexité et méthodes de résolution

Première idée devant un problème combinatoire : **tout énumérer** et garder la meilleure solution. C'est aussi la première idée à abandonner. Ce chapitre explique pourquoi, présente les classes P et NP (version simple) et les deux grandes stratégies de résolution.

## 1. L'explosion combinatoire

À $n = 20$, avec un ordinateur qui fait $10^9$ opérations par seconde :

| $f(n)$ | Valeur à $n = 20$ | Temps à $10^9$ opérations/s |
|---|---|---|
| $n^2$ | $400$ | instantané |
| $n^3$ | $8\,000$ | instantané |
| $2^n$ | $\approx 10^6$ | $\approx 1$ ms |
| $n!$ | $\approx 2{,}4 \times 10^{18}$ | $\approx 77$ ans |

Ordre de croissance : $n^2 \ll n^3 \ll 2^n \ll n!$. Les fonctions **polynomiales** ($n^2$, $n^3$) restent raisonnables ; les fonctions **exponentielles** ($2^n$) et **factorielles** ($n!$) explosent.

### Calculer un temps

$$\text{temps (s)} = \frac{\text{nombre d'opérations}}{\text{opérations par seconde}}$$

Conversions utiles : 1 min = 60 s, 1 h = 3 600 s, 1 jour = 86 400 s, 1 an $\approx 3{,}15 \times 10^7$ s.

> [!tip] Exemple : 15 villes contre 20 villes
> - 15 villes : $15! \approx 1{,}3 \times 10^{12}$ ordres, soit $\dfrac{1{,}3 \times 10^{12}}{10^9} \approx 1\,300$ s $\approx 22$ minutes : faisable.
> - 20 villes : $20! \approx 2{,}4 \times 10^{18}$ ordres, soit $2{,}4 \times 10^9$ s $\approx 77$ ans : impossible.
> - Ajouter 5 villes multiplie le travail par $16 \times 17 \times 18 \times 19 \times 20 \approx 1{,}9$ million.

> [!warning] Un ordinateur plus rapide ne sauve rien
> Vers $n = 20$, passer de $n$ à $n + 2$ villes multiplie déjà $n!$ par $21 \times 22 = 462$. Une machine 1 000 fois plus rapide ne fait donc gagner qu'environ **2 villes**. L'énumération n'est pas une stratégie.

## 2. Les classes de complexité (version simple)

- **P** : les problèmes qu'un algorithme **résout** en temps **polynomial** (raisonnable).
- **NP** : les problèmes dont une solution proposée se **vérifie** en temps polynomial.
- **NP-difficile** : au moins aussi difficile que tout problème de NP. On ne connaît **aucun** algorithme polynomial pour eux (voyageur de commerce, sac à dos, coloration…).
- **NP-complet** : à la fois dans NP **et** NP-difficile : les problèmes les plus durs de NP.

> [!info] Vérifier est plus facile que trouver
> Pour le voyageur de commerce, si on te **donne** une tournée, tu vérifies vite qu'elle passe par chaque ville et qu'elle coûte moins de $K$ : il suffit d'additionner $n$ distances. **Trouver** une telle tournée est une autre histoire.

Ces classes portent sur des **problèmes de décision** (réponse oui/non) :

| Problème | Version décision |
|---|---|
| Voyageur de commerce | existe-t-il une tournée de coût au plus $K$ ? |
| Sac à dos | existe-t-il un chargement de valeur au moins $K$ ? |
| Coloration | $k$ couleurs suffisent-elles ? |

> [!warning] Deux pièges de vocabulaire
> - NP ne veut **pas** dire « non polynomial » mais « **non déterministe polynomial** » : ce sont les problèmes qu'on **vérifie** en temps polynomial.
> - Tout problème facile à résoudre est facile à vérifier : $P \subseteq NP$. Savoir si $P = NP$ est une **question ouverte** (personne ne sait).

## 3. Deux stratégies de résolution

| | Méthodes exactes | Méthodes approchées |
|---|---|---|
| Garantie | l'**optimum** est garanti | aucune garantie d'optimalité |
| Exemples | programmation linéaire, simplexe, branch & bound, programmation dynamique | recherche locale, recuit simulé, algorithmes génétiques |
| Défaut | le temps de calcul peut exploser | pas de preuve d'optimalité |
| Atout | solution optimale prouvée | bonne solution vite, souvent la seule option à grande échelle |

Le cours pratique les deux : les **métaheuristiques** (approché), la **programmation linéaire** (exact) et la **théorie des graphes**, qui structure la plupart des problèmes.

> [!tip] Exemple : exact ou approché ?
> Des tournées pour 3 000 points de livraison, avec capacités et horaires, à recalculer chaque nuit en moins d'une heure : **approché**. Aucune méthode exacte ne tient dans ce budget ; une métaheuristique donne d'excellentes tournées à temps.

> [!warning] Ne pas généraliser
> Sur un voyageur de commerce **pur** (sans autres contraintes), les solveurs exacts modernes résolvent couramment des milliers de villes. Ce sont les **contraintes** et le **budget de temps** qui décident, pas seulement la taille. L'exact reste utile sur de petites instances ou pour mesurer la qualité d'une solution approchée.

## À retenir

- Énumérer tout est impossible dès que $n$ grandit : $2^n$ et surtout $n!$ explosent.
- Temps = opérations ÷ vitesse ; penser à convertir (minutes, heures, années).
- P = facile à résoudre ; NP = facile à vérifier ; $P \subseteq NP$ ; $P = NP$ est une question ouverte.
- NP-difficile : aucun algorithme polynomial connu (TSP, sac à dos, coloration). NP-complet : NP-difficile **et** dans NP.
- Exact = optimum garanti mais parfois trop lent ; approché = rapide mais sans garantie.
