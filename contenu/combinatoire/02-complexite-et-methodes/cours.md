# Complexité et méthodes de résolution

Première idée devant un problème combinatoire : **tout énumérer** et garder la meilleure solution. C'est aussi la première idée à abandonner. Ce chapitre explique pourquoi, présente les classes P et NP (version simple) et les deux grandes stratégies de résolution.

## 1. L'explosion combinatoire

On compare quatre façons de grandir : $n^2$ et $n^3$ (des **puissances** de $n$, appelées fonctions **polynomiales**), $2^n$ (2 multiplié par lui-même $n$ fois, une fonction **exponentielle**) et $n!$ ($1 \times 2 \times \dots \times n$, la **factorielle**). Avec un ordinateur qui fait $10^9$ opérations par seconde :

| $f(n)$ | Valeur à $n = 10$ | Valeur à $n = 25$ | Temps à $n = 25$ ($10^9$ opérations/s) |
|---|---|---|---|
| $n^2$ | $100$ | $625$ | instantané |
| $n^3$ | $1\,000$ | $15\,625$ | instantané |
| $2^n$ | $1\,024$ | $\approx 3{,}4 \times 10^7$ | $\approx 0{,}03$ s |
| $n!$ | $3\,628\,800$ | $\approx 1{,}6 \times 10^{25}$ | $\approx 490$ millions d'années |

Ordre de croissance : $n^2 \ll n^3 \ll 2^n \ll n!$. Les fonctions **polynomiales** ($n^2$, $n^3$) restent raisonnables ; les fonctions **exponentielles** ($2^n$) et **factorielles** ($n!$) explosent.

Pourquoi cet ordre ? Quand $n$ augmente de 1 :

- $n^2$ passe de $n^2$ à $(n+1)^2$ : il grossit un peu (de 625 à 676 pour $n = 25$) ;
- $2^n$ est **multiplié par 2** à chaque fois ;
- $n!$ est **multiplié par $n + 1$** à chaque fois (par 26 en passant de $25!$ à $26!$) : de plus en plus fort.

Attention : à $n = 10$, $2^{10} = 1\,024$ est à peine plus grand que $n^3 = 1\,000$, mais ensuite l'écart devient énorme. Le classement parle de ce qui se passe quand $n$ **grandit**.

**Exemple résolu : calculer $2^{n}$ et $n^k$ sans calculatrice.**

- $n^3$ pour $n = 30$ : $30 \times 30 \times 30 = 900 \times 30 = 27\,000$. Piège : $3 \times 30 = 90$ n'est pas $30^3$ (la puissance répète la multiplication, elle ne multiplie pas par l'exposant).
- $2^{10} = 1\,024$ : à retenir par cœur, c'est environ $10^3$ (mille).
- $2^{30} = 2^{10} \times 2^{10} \times 2^{10} = 1\,024^3 = 1\,073\,741\,824 \approx 10^9$ (un milliard).
- Règle utilisée : $2^{a+b} = 2^a \times 2^b$. Donc chaque fois que l'exposant augmente de 10, on multiplie par $1\,024 \approx 1\,000$.

**À retenir :** polynômes ($n^2$, $n^3$) $\ll$ exponentielle ($2^n$) $\ll$ factorielle ($n!$) ; $2^{10} \approx 10^3$, donc $+10$ dans l'exposant $\approx \times 1\,000$.

```anim
croissance
```

### Calculer un temps

$$\text{temps (s)} = \frac{\text{nombre d'opérations}}{\text{opérations par seconde}}$$

Conversions utiles : 1 min = 60 s, 1 h = 3 600 s, 1 jour = 86 400 s, 1 an $\approx 3{,}15 \times 10^7$ s.

Diviser des puissances de 10 : on **soustrait les exposants**, $\dfrac{10^a}{10^b} = 10^{a-b}$. Par exemple $\dfrac{4 \times 10^{14}}{10^9} = 4 \times 10^{5}$.

**Exemple résolu : un algorithme en $2^n$ opérations, $n = 45$, à $10^9$ opérations par seconde. Combien d'heures ?**

1. **Nombre d'opérations** : $2^{45} = 2^{40} \times 2^5$. Or $2^{40} = (2^{10})^4 \approx 1{,}1 \times 10^{12}$ et $2^5 = 32$, donc $2^{45} \approx 3{,}5 \times 10^{13}$.
2. **En secondes** : $\dfrac{3{,}5 \times 10^{13}}{10^9} = 3{,}5 \times 10^{4} = 35\,000$ s (on a soustrait $13 - 9 = 4$).
3. **En heures** : $\dfrac{35\,000}{3\,600} \approx 9{,}7$ heures.

Erreurs fréquentes : s'arrêter aux secondes alors que l'énoncé demande des heures ; diviser par 60 au lieu de 3 600 (on obtiendrait des minutes).

**À retenir :** opérations ÷ vitesse = secondes, puis on convertit dans l'unité demandée (÷ 60, ÷ 3 600, ÷ 86 400 ou ÷ $3{,}15 \times 10^7$).

> [!tip] Exemple : 12 villes contre 18 villes
> - 12 villes : $12! \approx 4{,}8 \times 10^{8}$ ordres, soit $\dfrac{4{,}8 \times 10^{8}}{10^9} \approx 0{,}5$ s : instantané.
> - 18 villes : $18! \approx 6{,}4 \times 10^{15}$ ordres, soit $6{,}4 \times 10^6$ s, et $\dfrac{6{,}4 \times 10^6}{86\,400} \approx 74$ jours : déjà hors de portée.
> - Ajouter 6 villes multiplie le travail par $\dfrac{18!}{12!} = 13 \times 14 \times 15 \times 16 \times 17 \times 18 = 13\,366\,080$, soit plus de 13 millions.

Comment simplifier $\dfrac{18!}{12!}$ : on écrit $18! = (1 \times 2 \times \dots \times 12) \times 13 \times 14 \times \dots \times 18 = 12! \times 13 \times \dots \times 18$. Le $12!$ du haut et celui du bas s'annulent : il reste seulement les facteurs **de 13 à 18**. Six villes de plus ne font **pas** un travail 6 fois plus grand : chaque ville ajoutée multiplie le travail par le nouveau nombre de villes.

**À retenir :** $\dfrac{b!}{a!}$ (avec $a < b$) = produit des entiers de $a + 1$ à $b$.

> [!warning] Un ordinateur plus rapide ne sauve rien
> Vers $n = 20$, passer de $n$ à $n + 2$ villes multiplie déjà $n!$ par $21 \times 22 = 462$. Une machine 1 000 fois plus rapide ne fait donc gagner qu'environ **2 villes**. L'énumération n'est pas une stratégie.

### La plus grande taille traitable dans un budget

On a un **budget** d'opérations (temps disponible × vitesse) et on cherche le plus grand $n$ dont le nombre d'opérations **reste sous** ce budget.

**Exemple résolu : budget d'une minute** à $10^9$ opérations par seconde, soit $60 \times 10^9 = 6 \times 10^{10}$ opérations.

1. **Algorithme en $2^n$** : on essaie des valeurs autour de la bonne puissance. $2^{35} \approx 3{,}4 \times 10^{10}$ tient dans le budget ; $2^{36} = 2 \times 2^{35} \approx 6{,}9 \times 10^{10}$ dépasse. Plus grand $n$ : **35**.
2. **Algorithme en $n!$** : $13! \approx 6{,}2 \times 10^{9}$ tient ; $14! = 14 \times 13! \approx 8{,}7 \times 10^{10}$ dépasse. Plus grand $n$ : **13**.
3. **Algorithme en $n^2$** : il faut $n^2 \le 6 \times 10^{10}$, donc $n \le \sqrt{6 \times 10^{10}} = \sqrt{6} \times 10^5 \approx 244\,948{,}97$. On garde la **partie entière** (on enlève les chiffres après la virgule, sans arrondir au-dessus) : **244 948**. Avec 244 949, on dépasserait le budget.

Pour la racine d'une puissance de 10 paire : $\sqrt{10^{10}} = 10^5$ (on divise l'exposant par 2).

| Algorithme | Plus grand $n$ en une minute |
|---|---|
| $n!$ | 13 |
| $2^n$ | 35 |
| $n^2$ | 244 948 |

Erreur fréquente : arrondir vers le haut. Le dernier $n$ qui marche est celui **juste avant** le premier qui dépasse.

**À retenir :** teste $n$, puis $n + 1$ : le bon $n$ est le dernier qui reste sous le budget ; pour $n^2$, c'est la partie entière de $\sqrt{\text{budget}}$.

## 2. Les classes de complexité (version simple)

- **P** : les problèmes qu'un algorithme **résout** en temps **polynomial** (raisonnable).
- **NP** : les problèmes dont une solution proposée se **vérifie** en temps polynomial.
- **NP-difficile** : au moins aussi difficile que tout problème de NP. On ne connaît **aucun** algorithme polynomial pour eux (voyageur de commerce, sac à dos, coloration…).
- **NP-complet** : à la fois dans NP **et** NP-difficile : les problèmes les plus durs de NP.

« Temps polynomial » veut dire que le nombre d'opérations se comporte comme $n^2$, $n^3$… (une puissance de $n$), et pas comme $2^n$ ou $n!$. « Aucun algorithme connu » ne veut pas dire « prouvé impossible » : personne n'en a trouvé, mais personne n'a prouvé qu'il n'en existe pas.

> [!info] Vérifier est plus facile que trouver
> Pour le voyageur de commerce, si on te **donne** une tournée, tu vérifies vite qu'elle passe par chaque ville et qu'elle coûte moins de $K$ : il suffit d'additionner $n$ distances. **Trouver** une telle tournée est une autre histoire.

**Exemple résolu : vérifier une tournée proposée.** Quatre villes P, Q, R, S. Distances : PQ = 2, PR = 6, PS = 5, QR = 4, QS = 3, RS = 1. Question de décision : « existe-t-il une tournée de coût au plus $K = 13$ ? ». On propose P → Q → R → S → P.

1. **Lister les trajets** : une tournée de 4 villes a 4 trajets, retour compris : PQ, QR, RS, SP.
2. **Additionner** : $2 + 4 + 1 + 5 = 12$.
3. **Comparer** : $12 \le 13$, la réponse est **oui**, et cette tournée le **prouve**. On l'appelle un **certificat** : une solution qu'on montre pour convaincre, et qu'on vérifie vite (ici 4 additions, pas besoin de regarder les autres tournées).

Maintenant avec $K = 10$ : la tournée proposée coûte 12, elle ne prouve rien. Pour répondre « non », il faut examiner **toutes** les tournées : P-Q-R-S-P (12), P-Q-S-R-P ($2 + 3 + 1 + 6 = 12$), P-R-Q-S-P ($6 + 4 + 3 + 5 = 18$). Aucune ne fait au plus 10 : la réponse est non. Ici il n'y en avait que 3, mais avec 30 villes il y en aurait des milliards de milliards.

Erreur fréquente : oublier le trajet retour (S → P) et trouver $2 + 4 + 1 = 7$.

**À retenir :** un certificat (une solution proposée) se vérifie en $n$ additions : c'est l'idée de NP. Trouver une solution, ou prouver qu'il n'y en a pas, est bien plus long.

Ces classes portent sur des **problèmes de décision** (réponse oui/non) :

| Problème | Version décision |
|---|---|
| Voyageur de commerce | existe-t-il une tournée de coût au plus $K$ ? |
| Sac à dos | existe-t-il un chargement de valeur au moins $K$ ? |
| Coloration | $k$ couleurs suffisent-elles ? |

> [!warning] Deux pièges de vocabulaire
> - NP ne veut **pas** dire « non polynomial » mais « **non déterministe polynomial** » : ce sont les problèmes qu'on **vérifie** en temps polynomial.
> - Tout problème facile à résoudre est facile à vérifier : $P \subseteq NP$. Savoir si $P = NP$ est une **question ouverte** (personne ne sait).

**Exemple résolu : pourquoi $P \subseteq NP$ ?** Prenons le tri d'une liste, un problème de P (on sait trier en temps polynomial). On te propose une liste et on prétend qu'elle est la version triée. Pour vérifier, il suffit de **refaire le tri** (rapide, puisque le problème est dans P) et de comparer. Donc tout problème de P se vérifie vite : il est dans NP. L'inverse ($NP \subseteq P$, donc $P = NP$) n'a jamais été prouvé, et $P \neq NP$ non plus.

Pour s'y retrouver dans les quatre classes :

| Classe | Question à se poser | Exemple |
|---|---|---|
| P | sait-on **résoudre** vite ? | trier une liste, plus court chemin |
| NP | sait-on **vérifier** vite une solution proposée ? | voyageur de commerce (version décision) |
| NP-difficile | est-il au moins aussi dur que tout NP ? | voyageur de commerce, sac à dos, coloration |
| NP-complet | NP **et** NP-difficile | voyageur de commerce (version décision) |

**À retenir :** P = résoudre vite ; NP = vérifier vite ; $P \subseteq NP$ est certain, $P = NP$ est inconnu ; NP-complet = dans NP **et** NP-difficile.

## 3. Deux stratégies de résolution

| | Méthodes exactes | Méthodes approchées |
|---|---|---|
| Garantie | l'**optimum** est garanti | aucune garantie d'optimalité |
| Exemples | programmation linéaire, simplexe, branch & bound, programmation dynamique | recherche locale, recuit simulé, algorithmes génétiques |
| Défaut | le temps de calcul peut exploser | pas de preuve d'optimalité |
| Atout | solution optimale prouvée | bonne solution vite, souvent la seule option à grande échelle |

Le cours pratique les deux : les **métaheuristiques** (approché), la **programmation linéaire** (exact) et la **théorie des graphes**, qui structure la plupart des problèmes.

Le **branch & bound** (« séparer et évaluer ») est une méthode exacte : il découpe l'ensemble des solutions en morceaux et élimine d'un coup les morceaux dont on prouve qu'ils ne peuvent pas contenir mieux que la meilleure solution déjà trouvée. Il évite d'énumérer tout, mais garde la garantie d'optimum. Une **métaheuristique** (recherche locale, recuit simulé, algorithme génétique) est une méthode approchée générique : elle améliore une solution pas à pas et s'arrête quand le temps est écoulé.

Pour choisir, on se pose trois questions dans l'ordre :

1. **Faut-il une preuve d'optimalité ?** (par exemple pour mesurer l'écart d'une autre méthode à l'optimum) → exacte.
2. **L'instance est-elle petite et simple ?** (peu d'éléments, peu de contraintes) → exacte, souvent faisable.
3. **Le problème est-il gros, plein de contraintes, avec un délai court ?** → approchée.

> [!tip] Exemple : exact ou approché ?
> Le planning mensuel de 800 infirmières, avec repos obligatoires, compétences par service et souhaits de chacune, à refaire chaque soir en 10 minutes : **approché**. Aucune méthode exacte ne tient dans ce budget ; une métaheuristique donne un très bon planning à temps.

**Exemple résolu : trois situations.**

| Situation | Preuve nécessaire ? | Taille et contraintes | Délai | Choix |
|---|---|---|---|---|
| sac à dos de 10 objets, on veut **le** meilleur | oui | petit : $2^{10} = 1\,024$ choix | aucun souci | **exacte** (on peut même tout énumérer) |
| tournées de 5 000 clients avec horaires, en 20 minutes | non | énorme, beaucoup de contraintes | court | **approchée** |
| tester la qualité d'un recuit simulé sur une petite instance | oui : il faut connaître l'optimum pour mesurer l'écart | petit | aucun souci | **exacte** |

Pour la dernière ligne : si l'optimum vaut 100 et que le recuit trouve 104, l'écart est de $\dfrac{104 - 100}{100} = 4\,\%$. Sans l'optimum exact, impossible de calculer cet écart.

Erreur fréquente : choisir « exacte » dès qu'on veut une bonne solution. Une méthode approchée donne souvent une excellente solution ; ce qu'elle ne donne pas, c'est la **preuve** que c'est la meilleure.

**À retenir :** preuve ou petite instance → exacte ; grande instance + contraintes + délai court → approchée.

> [!warning] Ne pas généraliser
> Sur un voyageur de commerce **pur** (sans autres contraintes), les solveurs exacts modernes résolvent couramment des milliers de villes. Ce sont les **contraintes** et le **budget de temps** qui décident, pas seulement la taille. L'exact reste utile sur de petites instances ou pour mesurer la qualité d'une solution approchée.

La limite d'une vingtaine de villes vue au début du chapitre vaut pour l'**énumération** (tout essayer). Une méthode exacte intelligente comme le branch & bound n'essaie pas tout : elle va bien plus loin.

## À retenir

- Énumérer tout est impossible dès que $n$ grandit : $2^n$ et surtout $n!$ explosent.
- Temps = opérations ÷ vitesse ; penser à convertir (minutes, heures, années).
- $\dfrac{b!}{a!}$ = produit des entiers de $a + 1$ à $b$ ; plus grand $n$ dans un budget = le dernier qui reste dessous.
- P = facile à résoudre ; NP = facile à vérifier ; $P \subseteq NP$ ; $P = NP$ est une question ouverte.
- NP-difficile : aucun algorithme polynomial connu (TSP, sac à dos, coloration). NP-complet : NP-difficile **et** dans NP.
- Exact = optimum garanti mais parfois trop lent ; approché = rapide mais sans garantie.
