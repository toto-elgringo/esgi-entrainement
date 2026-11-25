# Quantificateurs, prédicats et sommes

Ce chapitre donne deux outils très utilisés en informatique :

- les **quantificateurs** ($\forall$, $\exists$), pour écrire précisément des règles comme les contraintes d'une base de données ;
- les **sommes** ($\Sigma$) et les **produits** ($\Pi$), qui sont la version mathématique de `COUNT`, `SUM`, `AVG` et `GROUP BY`.

## 1. Les prédicats

Un **prédicat** est une phrase qui contient une variable. Elle n'est ni vraie ni fausse tant qu'on n'a pas choisi la valeur de la variable.

Exemple : $P(x) : x^2 \geq 4$.

- $P(3)$ est vrai, car $9 \geq 4$.
- $P(1)$ est faux, car $1 < 4$.

Un prédicat peut avoir plusieurs variables : $R(x, y)$ : « $x$ a acheté le produit $y$ ».

> [!info] Lien avec SQL
> Une clause `WHERE ville = 'Paris' AND age > 18` est un prédicat $P(\text{ville}, \text{age})$ : pour chaque ligne, il vaut vrai ou faux, et SQL ne garde que les lignes où il est vrai.

**Exemple résolu :** sur les entiers relatifs $\mathbb{Z}$ (les entiers positifs, négatifs et 0), on prend $Q(x) : x^2 \geq 16$. Pour quelles valeurs $Q(x)$ est-il vrai ? faux ?

On remplace $x$ par chaque valeur, on calcule $x^2$, puis on compare à 16 :

| $x$ | $x^2$ | $x^2 \geq 16$ ? | $Q(x)$ |
|---|---|---|---|
| 5 | 25 | $25 \geq 16$ | vrai |
| 4 | 16 | $16 \geq 16$ (égalité acceptée) | vrai |
| 3 | 9 | $9 < 16$ | faux |
| 0 | 0 | $0 < 16$ | faux |
| $-3$ | 9 | $9 < 16$ | faux |
| $-4$ | 16 | $16 \geq 16$ | vrai |

- Un carré n'est jamais négatif : $(-4)^2 = (-4) \times (-4) = 16$, comme $4^2$. Les négatifs se comportent comme leurs opposés positifs.
- Le signe $\geq$ veut dire « supérieur **ou égal** » : pour $x = 4$, l'égalité $16 = 16$ suffit à rendre $Q(4)$ vrai.
- $Q(x)$ est faux quand $x^2 < 16$, donc pour $-4 < x < 4$ (au sens strict). Les entiers concernés sont $\{-3, -2, -1, 0, 1, 2, 3\}$ : 7 valeurs.

**À retenir :** remplace la variable par la valeur, calcule, compare. Pense aux nombres négatifs et au cas d'égalité ($\geq$ l'accepte, $>$ non).

## 2. Les quantificateurs

| Symbole | Se lit | Sens |
|---|---|---|
| $\forall x,\ P(x)$ | « pour tout $x$ » | $P(x)$ est vrai pour **toutes** les valeurs de $x$ |
| $\exists x,\ P(x)$ | « il existe $x$ » | $P(x)$ est vrai pour **au moins une** valeur de $x$ |

On précise toujours l'ensemble dans lequel on prend la variable : $\forall p \in \text{Produits},\ \text{prix}(p) > 0$.

**Exemple résolu :** avec $E = \{1, 2, 3, 4\}$, que valent ces trois phrases ?

1. $\forall x \in E,\ x < 5$ : on teste **chaque** élément. $1 < 5$, $2 < 5$, $3 < 5$, $4 < 5$ : tous passent, c'est **vrai**.
2. $\forall x \in E,\ x \text{ est pair}$ : on teste 1, qui est impair. Un seul élément qui échoue (un **contre-exemple**) suffit : c'est **faux**, inutile de tester la suite.
3. $\exists x \in E,\ x > 3$ : on cherche **un** élément qui marche. $4 > 3$ : c'est **vrai**, un seul exemple suffit.

**À retenir :** un $\forall$ est faux dès qu'on trouve un contre-exemple ; un $\exists$ est vrai dès qu'on trouve un exemple.

### L'ordre des quantificateurs compte

Avec $R(x, y)$ : « $y$ est le manager de $x$ » :

- $\forall x\ \exists y\ R(x, y)$ : **chaque** employé a un manager (qui peut être différent d'un employé à l'autre) ;
- $\exists y\ \forall x\ R(x, y)$ : **une seule** personne manage tout le monde.

Le second est beaucoup plus fort. Si le second est vrai, le premier l'est aussi, mais pas l'inverse.

> [!warning] Piège
> On ne peut pas échanger $\forall$ et $\exists$ sans changer le sens de la phrase.

On lit les quantificateurs **de gauche à droite** : celui de gauche est choisi en premier, et celui de droite peut dépendre de lui.

- Dans $\forall x\ \exists y$, on choisit d'abord $x$, puis on cherche un $y$ **pour ce $x$** : chaque $x$ peut avoir son propre $y$.
- Dans $\exists y\ \forall x$, on doit choisir $y$ **avant** de connaître $x$ : ce même $y$ doit marcher pour tous les $x$ à la fois.

**Exemple résolu :** $V(x, y)$ : « la personne $x$ a vu le film $y$ ». Deux personnes (Léa, Tom) et trois films (F1, F2, F3).

*Situation 1 :* Léa a vu F1 et F3, Tom a vu F2.

| | F1 | F2 | F3 |
|---|---|---|---|
| Léa | oui | non | oui |
| Tom | non | oui | non |

- $\forall x\ \exists y\ V(x, y)$ (« chaque personne a vu au moins un film ») : Léa a vu F1, Tom a vu F2. Chaque **ligne** contient au moins un « oui » : **vrai**.
- $\exists y\ \forall x\ V(x, y)$ (« un même film a été vu par tout le monde ») : on cherche une **colonne** pleine de « oui ». F1 : Tom non. F2 : Léa non. F3 : Tom non. Aucune : **faux**.

*Situation 2 :* on ajoute que Tom a aussi vu F3. La colonne F3 est maintenant pleine de « oui » : $\exists y\ \forall x\ V(x, y)$ devient vrai (avec $y = $ F3). Et forcément $\forall x\ \exists y$ aussi : chacun a vu au moins F3.

**À retenir :** $\forall x\ \exists y$ = chaque ligne a un « oui » ; $\exists y\ \forall x$ = une colonne entière de « oui ». Le second entraîne le premier, jamais l'inverse.

### Nier une phrase « couche par couche »

Pour nier, on part de l'extérieur et on avance vers l'intérieur : chaque $\forall$ devient $\exists$, chaque $\exists$ devient $\forall$, puis on nie le prédicat à la fin.

$$\neg\big(\forall x\ \exists y\ R(x,y)\big) \iff \exists x\ \forall y\ \neg R(x,y)$$

Exemples :

- « Tout client a passé une commande » se nie en « **il existe** un client qui n'a passé **aucune** commande ».
- « Il existe un produit disponible dans tous les entrepôts » se nie en « **tout** produit est absent d'**au moins un** entrepôt ».

> [!tip] Méthode
> Nier « tous » donne « au moins un ne... pas ». Nier « il existe » donne « aucun » (ou « tous ne... pas »).

En SQL, nier « tout client a une commande » revient à chercher un client pour lequel il n'existe pas de commande : c'est le rôle de `NOT EXISTS`.

**Exemple résolu :** nier « chaque équipe a un joueur qui a marqué à tous les matchs ».

1. On écrit la forme : $M(j, m)$ : « le joueur $j$ a marqué au match $m$ ». La phrase est $\forall e\ \exists j \in e\ \forall m\ M(j, m)$.
2. Première couche : $\forall e$ devient $\exists e$.
3. Deuxième couche : $\exists j$ devient $\forall j$.
4. Troisième couche : $\forall m$ devient $\exists m$.
5. On nie le prédicat : $M(j, m)$ devient $\neg M(j, m)$.
6. Résultat : $\exists e\ \forall j \in e\ \exists m\ \neg M(j, m)$, soit « il existe une équipe dont **chaque** joueur a raté **au moins un** match (n'y a pas marqué) ».

L'ordre des variables ($e$, puis $j$, puis $m$) ne bouge pas : seuls les symboles changent. Un oubli classique : changer les quantificateurs mais garder $M$ au lieu de $\neg M$.

**À retenir :** chaque quantificateur change de sorte, l'ordre reste le même, et on nie le prédicat tout au bout.

### Nier « et », « ou » et les inégalités

Le prédicat à nier au bout contient souvent un « et », un « ou » ou une comparaison. On utilise les **lois de De Morgan** : la négation d'un « et » est un « ou » des négations, et la négation d'un « ou » est un « et » des négations.

$$\neg(A \text{ et } B) \iff \neg A \text{ ou } \neg B \qquad \neg(A \text{ ou } B) \iff \neg A \text{ et } \neg B$$

Pour nier une comparaison, on prend **exactement** son contraire, sans oublier le cas d'égalité :

| Comparaison | Sa négation |
|---|---|
| $x > a$ | $x \leq a$ |
| $x \geq a$ | $x < a$ |
| $x < a$ | $x \geq a$ |
| $x \leq a$ | $x > a$ |
| $x = a$ | $x \neq a$ |

**Exemple résolu :** nier « $x \geq 2$ ou $y < 5$ ».

1. C'est un « ou » : sa négation est un « et ».
2. $\neg(x \geq 2)$ donne $x < 2$.
3. $\neg(y < 5)$ donne $y \geq 5$ : le cas $y = 5$ rendait la phrase de départ fausse, il doit donc rendre la négation vraie.
4. Résultat : « $x < 2$ et $y \geq 5$ ».

On vérifie sur un point : $x = 0$, $y = 5$. Phrase de départ : $0 \geq 2$ faux, $5 < 5$ faux, donc fausse. Négation : $0 < 2$ vrai, $5 \geq 5$ vrai, donc vraie. C'est bien le contraire.

**À retenir :** « et » devient « ou » (et inversement), puis chaque comparaison devient son contraire exact ($>$ devient $\leq$, pas $<$).

### Traduire « aucun »

« **Aucun** $x$ n'a la propriété $P$ » veut dire « il n'existe pas de $x$ qui a $P$ », c'est-à-dire « **tous** les $x$ ont la propriété contraire » :

$$\neg\big(\exists x,\ P(x)\big) \iff \forall x,\ \neg P(x)$$

**Exemple résolu :** « aucun produit n'a un stock négatif ».

1. Version « il n'existe pas » : $\neg\big(\exists p \in \text{Produits},\ p.\mathrm{stock} < 0\big)$.
2. On fait entrer la négation : $\exists$ devient $\forall$ et $< 0$ devient $\geq 0$.
3. Version « pour tout » : $\forall p \in \text{Produits},\ p.\mathrm{stock} \geq 0$.

Les deux écritures sont justes. L'erreur classique est d'écrire $p.\mathrm{stock} > 0$ : un stock égal à 0 n'est pas négatif, il doit être accepté.

> [!warning] « Aucun » n'est pas la négation de « tous »
> La négation de « tous les tests passent » est « **au moins un** test échoue », pas « aucun test ne passe ». Avec un test qui passe et un qui échoue, « tous passent » et « aucun ne passe » sont fausses en même temps : « aucun » est beaucoup trop fort.

**À retenir :** « aucun $x$ n'a $P$ » s'écrit $\forall x,\ \neg P(x)$ (ou $\neg \exists x,\ P(x)$).

```anim
quantificateurs
```

### Écrire les contraintes d'une base de données

- **Clé étrangère** (chaque commande référence un client qui existe) :
$$\forall c \in \text{Commandes},\ \exists u \in \text{Clients},\ c.\mathrm{id\_client} = u.\mathrm{id\_client}$$
- **Unicité** (deux clients différents n'ont jamais le même email) :
$$\forall u_1, u_2 \in \text{Clients},\ u_1 \neq u_2 \Rightarrow u_1.\mathrm{email} \neq u_2.\mathrm{email}$$

> [!warning] Piège de l'unicité
> Écrire seulement $\forall u_1, u_2,\ u_1.\mathrm{email} \neq u_2.\mathrm{email}$ est faux : avec $u_1 = u_2$, un client aurait un email différent de lui-même. Il faut la condition $u_1 \neq u_2$.

**Exemple résolu : une clé étrangère.** Tables `Etudiants(id, nom)` et `Inscriptions(id, id_etudiant)`. On veut « toute inscription concerne un étudiant qui existe ».

1. On part de la table qui **contient** la référence (la colonne `id_etudiant`) : c'est `Inscriptions`. On veut que ce soit vrai pour **chaque** inscription : $\forall i \in \text{Inscriptions}$.
2. Pour cette inscription, on doit **trouver** un étudiant qui correspond : $\exists e \in \text{Etudiants},\ i.\mathrm{id\_etudiant} = e.\mathrm{id}$.
3. Formule : $\forall i \in \text{Inscriptions},\ \exists e \in \text{Etudiants},\ i.\mathrm{id\_etudiant} = e.\mathrm{id}$.

Deux mauvaises versions à reconnaître :

- $\exists e\ \forall i$ : un **seul** étudiant à qui appartiendraient toutes les inscriptions. Bien trop fort.
- $\forall e\ \exists i$ : « chaque étudiant a au moins une inscription ». C'est une autre règle (aucun étudiant sans inscription), pas une clé étrangère.

**Exemple résolu : l'unicité sur une petite table.** `Clients` contient : (1, `a@x.fr`), (2, `b@x.fr`), (3, `a@x.fr`).

- Paire $u_1 = 1$, $u_2 = 3$ : clients différents, même email. La contrainte est **violée** : la table ne la respecte pas.
- Paire $u_1 = 1$, $u_2 = 1$ : c'est le même client, son email est forcément égal au sien. Sans la condition $u_1 \neq u_2$, cette paire violerait la contrainte sur **n'importe quelle** table. Avec la condition, cette paire n'est pas testée.

**À retenir :** clé étrangère = « $\forall$ ligne qui référence, $\exists$ ligne référencée » ; unicité = « $\forall u_1, u_2$, si $u_1 \neq u_2$ alors valeurs différentes ».

## 3. Les sommes

### La notation $\Sigma$

$$\sum_{k=1}^{n} a_k = a_1 + a_2 + \dots + a_n$$

- $k$ est l'**indice**. C'est une variable **muette** : on peut l'appeler $i$, $j$ ou $k$, le résultat ne change pas.
- $1$ et $n$ sont les **bornes** : on prend toutes les valeurs entières de $k$ entre les deux.
- Le nombre de termes est $n - 1 + 1 = n$. De façon générale, de $k = p$ à $k = q$ il y a $q - p + 1$ termes.

Exemple : $\displaystyle\sum_{k=1}^{4} k^2 = 1 + 4 + 9 + 16 = 30$.

**Exemple résolu :** calculer $\displaystyle\sum_{k=3}^{6} (2k - 1)$.

1. Nombre de termes : de 3 à 6, il y a $6 - 3 + 1 = 4$ termes (3, 4, 5 et 6 : on compte les **deux** bornes, d'où le $+1$).
2. On calcule chaque terme en remplaçant $k$ :

| $k$ | $2k - 1$ |
|---|---|
| 3 | $6 - 1 = 5$ |
| 4 | $8 - 1 = 7$ |
| 5 | $10 - 1 = 9$ |
| 6 | $12 - 1 = 11$ |

3. On additionne : $5 + 7 + 9 + 11 = 32$.

**À retenir :** de $k = p$ à $k = q$, il y a $q - p + 1$ termes ; en cas de doute, écris-les tous dans un tableau.

### Les règles de calcul

$$\sum_{k=1}^{n} (a_k + b_k) = \sum_{k=1}^{n} a_k + \sum_{k=1}^{n} b_k \qquad \sum_{k=1}^{n} c\, a_k = c \sum_{k=1}^{n} a_k \qquad \sum_{k=1}^{n} c = n\,c$$

On dit que la somme est **linéaire** : on peut la couper en morceaux et sortir les constantes.

La dernière règle vient de ce qu'on écrit **une fois** la constante $c$ **par terme** : $\sum_{k=1}^{n} c = c + c + \dots + c$ ($n$ fois) $= n\,c$. Si la somme ne part pas de 1, on multiplie par le nombre de termes : $\sum_{k=3}^{7} 2 = 2 + 2 + 2 + 2 + 2 = 5 \times 2 = 10$ (de 3 à 7 : $7 - 3 + 1 = 5$ termes).

> [!warning] Piège
> $\displaystyle\sum a_k b_k \neq \Big(\sum a_k\Big)\Big(\sum b_k\Big)$ en général. Exemple : $1 \times 1 + 2 \times 2 = 5$ alors que $(1 + 2)(1 + 2) = 9$.

**Exemple résolu :** calculer $\displaystyle\sum_{k=1}^{6} (3k + 2)$ avec les règles.

1. On coupe : $\sum (3k + 2) = \sum 3k + \sum 2$.
2. On sort la constante 3 : $\sum 3k = 3 \sum_{k=1}^{6} k = 3 \times (1 + 2 + 3 + 4 + 5 + 6) = 3 \times 21 = 63$.
3. La constante 2 est ajoutée une fois par terme, donc 6 fois : $\sum_{k=1}^{6} 2 = 6 \times 2 = 12$.
4. Total : $63 + 12 = 75$.

Vérification en écrivant les termes : $5 + 8 + 11 + 14 + 17 + 20 = 75$. L'erreur classique est de n'ajouter le 2 qu'une seule fois ($63 + 2 = 65$).

**À retenir :** coupe la somme, sors les constantes qui multiplient, et une constante seule compte autant de fois qu'il y a de termes.

### Les formules à connaître

$$\sum_{k=1}^{n} k = \frac{n(n+1)}{2} \qquad\qquad \sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$$

**Exemple résolu :** calculer $\displaystyle\sum_{k=1}^{30} k$ et $\displaystyle\sum_{k=1}^{5} k^2$.

- Pour la première, $n = 30$ : $\frac{30 \times 31}{2} = \frac{930}{2} = 465$. On n'oublie pas de diviser par 2, et c'est bien $n + 1 = 31$ (pas $n - 1$).
- Pour la seconde, $n = 5$ : $\frac{5 \times 6 \times 11}{6} = \frac{330}{6} = 55$ (ici $2n + 1 = 11$). On vérifie en écrivant : $1 + 4 + 9 + 16 + 25 = 55$.
- Piège : la somme des carrés n'est **pas** le carré de la somme. $(1 + 2 + 3 + 4 + 5)^2 = 15^2 = 225$, très loin de 55.

**À retenir :** repère $n$ (la borne du haut, quand on part de $k = 1$), puis remplace-le dans la formule.

Exemple avec la linéarité :
$$\sum_{k=1}^{n} (2k + 3) = 2 \sum_{k=1}^{n} k + \sum_{k=1}^{n} 3 = n(n+1) + 3n = n^2 + 4n$$

Le détail : $2 \times \frac{n(n+1)}{2} = n(n+1)$ (le 2 et le $\frac{1}{2}$ s'annulent), puis $n(n+1) = n^2 + n$, et $n^2 + n + 3n = n^2 + 4n$. On vérifie avec $n = 2$ : la somme vaut $5 + 7 = 12$, et la formule $4 + 8 = 12$. Quand un terme est **soustrait**, comme dans $\sum (5k - 2)$, le moins porte sur toute la somme de la constante : $- \sum 2 = -2n$.

> [!info] Coût d'une double boucle
> Comparer chaque ligne d'une table avec toutes les suivantes demande $1 + 2 + \dots + (n-1) = \frac{(n-1)n}{2}$ comparaisons, soit environ $\frac{n^2}{2}$. C'est pour cela qu'une double boucle devient lente sur une grosse table.

```anim
somme-gauss
n: 6
```

### Le changement d'indice

On remplace $k$ par une nouvelle variable, par exemple $j = k - 2$. Les **bornes se décalent**, la valeur de la somme ne change pas.

$$S = \sum_{k=3}^{n+2} (k - 2)$$

Avec $j = k - 2$ : quand $k = 3$, $j = 1$ ; quand $k = n + 2$, $j = n$. Donc
$$S = \sum_{j=1}^{n} j = \frac{n(n+1)}{2}$$

> [!tip] Méthode
> Calcule la nouvelle variable pour la borne du bas **et** pour la borne du haut, puis réécris le terme général avec la nouvelle variable.

**Exemple résolu :** calculer $\displaystyle\sum_{k=2}^{11} (k - 1)$ en posant $j = k - 1$.

1. Borne du bas : $k = 2$ donne $j = 2 - 1 = 1$.
2. Borne du haut : $k = 11$ donne $j = 11 - 1 = 10$.
3. Terme général : $k - 1$ s'écrit simplement $j$.
4. Donc la somme vaut $\sum_{j=1}^{10} j = \frac{10 \times 11}{2} = 55$.

On vérifie le début : pour $k = 2, 3, 4$, les termes sont $1, 2, 3$, exactement les premiers $j$. Le nombre de termes ne change pas : $11 - 2 + 1 = 10$ avant, $10 - 1 + 1 = 10$ après. Erreurs classiques : changer les bornes mais garder $k - 1$ dans le terme, ou changer le terme mais garder les anciennes bornes 2 et 11.

**À retenir :** les trois morceaux changent ensemble (borne du bas, borne du haut, terme), et le nombre de termes reste le même.

### Les sommes doubles

$$\sum_{i=1}^{m} \sum_{j=1}^{n} a_{i,j}$$

On fixe $i$, on additionne sur $j$, puis on additionne les résultats sur $i$. C'est comme parcourir un tableau ligne par ligne.

Si les bornes de l'une ne dépendent pas de l'autre, on peut **inverser l'ordre** des deux sommes : le total ne change pas (comme additionner un tableau par lignes ou par colonnes).

Exemple : $v_{i,j}$ = ventes du magasin $i$ la semaine $j$. Le chiffre d'affaires total est $\sum_i \sum_j v_{i,j}$, celui du magasin 2 est $\sum_j v_{2,j}$.

**Exemple résolu :** $h_{i,j}$ = heures travaillées par l'employé $i$ le jour $j$.

| | Jour 1 | Jour 2 |
|---|---|---|
| Employé 1 | 7 | 8 |
| Employé 2 | 6 | 4 |
| Employé 3 | 5 | 9 |

- $\sum_{j=1}^{2} h_{3,j}$ : on **fixe** $i = 3$ (la ligne de l'employé 3) et on parcourt les jours : $5 + 9 = 14$.
- $\sum_{i=1}^{3} h_{i,1}$ : on **fixe** $j = 1$ (la colonne du jour 1) et on parcourt les employés : $7 + 6 + 5 = 18$.
- $\sum_{i=1}^{3} \sum_{j=1}^{2} h_{i,j}$ par lignes : $15 + 10 + 14 = 39$.
- Par colonnes : jour 1 $= 18$, jour 2 $= 8 + 4 + 9 = 21$, total $18 + 21 = 39$. Même total : inverser l'ordre ne change rien.
- $\sum_{i=1}^{3} \sum_{j=1}^{2} 1$ : on ajoute 1 par case, soit $3 \times 2 = 6$ cases.

**À retenir :** l'indice qu'on fixe désigne une ligne ou une colonne, celui qui varie la parcourt ; $\sum \sum 1$ compte les cases.

### Sommer sur un ensemble

On peut aussi additionner sur les éléments d'un **ensemble** au lieu d'un intervalle d'entiers. Si $A(c)$ est l'ensemble des achats du client $c$ :

$$\sum_{a \in A(c)} a.\mathrm{montant}$$

se lit « la somme des montants de tous les achats $a$ de $A(c)$ ». De même, $\sum_{a \in A(c)} 1$ compte les achats (on ajoute 1 par achat), et $\max_{a \in A(c)} a.\mathrm{montant}$ donne le plus gros.

**Exemple résolu :** le client Zoé a trois achats de 12, 30 et 8 euros.

- $\sum_{a \in A(\text{Zoé})} a.\mathrm{montant} = 12 + 30 + 8 = 50$ : son total.
- $\sum_{a \in A(\text{Zoé})} 1 = 1 + 1 + 1 = 3$ : son nombre d'achats.
- $\max_{a \in A(\text{Zoé})} a.\mathrm{montant} = 30$ : son plus gros achat.
- $\sum_{c} \sum_{a \in A(c)} a.\mathrm{montant}$ : pour **chaque** client on calcule son total (somme interne), puis on additionne tous ces totaux (somme externe). On obtient le total de tous les achats du magasin.

**À retenir :** la somme interne travaille pour un client fixé, la somme externe parcourt tous les clients.

### Les sommes télescopiques

Quand chaque terme est une **différence** de deux termes qui se suivent, presque tout s'annule :

$$\sum_{k=1}^{n} (u_{k+1} - u_k) = (u_2 - u_1) + (u_3 - u_2) + \dots + (u_{n+1} - u_n) = u_{n+1} - u_1$$

Exemple : $\dfrac{1}{k(k+1)} = \dfrac{1}{k} - \dfrac{1}{k+1}$, donc
$$\sum_{k=1}^{n} \frac{1}{k(k+1)} = 1 - \frac{1}{n+1} = \frac{n}{n+1}$$

Le détail : la somme s'écrit $\left(1 - \frac{1}{2}\right) + \left(\frac{1}{2} - \frac{1}{3}\right) + \dots + \left(\frac{1}{n} - \frac{1}{n+1}\right)$. Chaque $-\frac{1}{2}$, $-\frac{1}{3}$… est annulé par le $+$ du terme suivant. Il reste le tout premier morceau, $1$, et le tout dernier, $-\frac{1}{n+1}$. Puis $1 - \frac{1}{n+1} = \frac{n+1}{n+1} - \frac{1}{n+1} = \frac{n}{n+1}$. Vérification pour $n = 2$ : $\frac{1}{2} + \frac{1}{6} = \frac{3}{6} + \frac{1}{6} = \frac{4}{6} = \frac{2}{3}$, et la formule donne $\frac{2}{3}$.

**Exemple résolu :** calculer $\displaystyle\sum_{k=1}^{n} (2^{k+1} - 2^k)$.

1. On reconnaît $u_{k+1} - u_k$ avec $u_k = 2^k$.
2. On écrit les termes : $(2^2 - 2^1) + (2^3 - 2^2) + \dots + (2^{n+1} - 2^n)$. Chaque puissance du milieu apparaît une fois avec $+$ et une fois avec $-$.
3. Il reste $u_{n+1} - u_1 = 2^{n+1} - 2^1 = 2^{n+1} - 2$.
4. Vérification pour $n = 3$ : $(4 - 2) + (8 - 4) + (16 - 8) = 2 + 4 + 8 = 14$, et $2^4 - 2 = 14$.

Erreurs classiques : oublier le $-u_1$ du tout premier terme, ou garder $u_n$ au lieu de $u_{n+1}$ à la fin.

**À retenir :** $\sum_{k=1}^{n} (u_{k+1} - u_k) = u_{n+1} - u_1$ : « le dernier moins le premier ».

### Vérifier une décomposition

Avant de télescoper, il faut être sûr que la décomposition en différence est juste. On remet la différence **au même dénominateur** : on multiplie le haut et le bas de chaque fraction par le dénominateur de l'autre.

**Exemple résolu :** que vaut $\dfrac{1}{k} - \dfrac{1}{k+3}$ ?

1. Dénominateur commun : $k(k+3)$.
2. $\dfrac{1}{k} = \dfrac{k+3}{k(k+3)}$ et $\dfrac{1}{k+3} = \dfrac{k}{k(k+3)}$.
3. On soustrait les numérateurs, **avec des parenthèses** : $(k + 3) - k = k + 3 - k = 3$.
4. Donc $\dfrac{1}{k} - \dfrac{1}{k+3} = \dfrac{3}{k(k+3)}$.

Le numérateur n'est pas toujours 1 : il vaut l'**écart** entre les deux dénominateurs (ici 3). Vérification avec $k = 1$ : $1 - \frac{1}{4} = \frac{3}{4}$, et $\frac{3}{1 \times 4} = \frac{3}{4}$.

**À retenir :** au même dénominateur, puis soustraction des numérateurs entre parenthèses ; teste avec $k = 1$.

### Télescoper avec un écart de 2

Si les termes qui s'annulent sont séparés de **deux** places, il reste **deux** termes au début et **deux** à la fin :

$$\sum_{k=1}^{n} (u_{k+2} - u_k) = u_{n+1} + u_{n+2} - u_1 - u_2$$

**Exemple résolu :** $\displaystyle\sum_{k=1}^{4} \big((k+2)^2 - k^2\big)$, avec $u_k = k^2$.

| $k$ | Terme $u_{k+2} - u_k$ |
|---|---|
| 1 | $3^2 - 1^2 = 9 - 1$ |
| 2 | $4^2 - 2^2 = 16 - 4$ |
| 3 | $5^2 - 3^2 = 25 - 9$ |
| 4 | $6^2 - 4^2 = 36 - 16$ |

- Le $+9$ (ligne 1) s'annule avec le $-9$ (ligne 3), et le $+16$ (ligne 2) avec le $-16$ (ligne 4).
- Il reste les deux derniers positifs, $25 + 36$, et les deux premiers négatifs, $-1 - 4$.
- Total : $25 + 36 - 1 - 4 = 56$. Vérification directe : $8 + 12 + 16 + 20 = 56$.

**À retenir :** avec un écart de 2, il reste deux termes de chaque côté (l'erreur classique est d'en garder un seul, comme pour un écart de 1).

> [!tip] Retrouver la somme des carrés (méthode d'examen)
> On part de $(k+1)^3 - k^3 = 3k^2 + 3k + 1$ et on additionne pour $k$ de 1 à $n$.
> - À gauche, tout se télescope : $(n+1)^3 - 1$.
> - À droite : $3 \sum k^2 + 3 \frac{n(n+1)}{2} + n$.
>
> En isolant $\sum k^2$, on trouve $\dfrac{n(n+1)(2n+1)}{6}$.

**Exemple résolu : la même méthode pour retrouver $\sum k$.** On prend $u_k = k(k - 1)$.

1. On calcule la différence : $u_{k+1} - u_k = (k+1)k - k(k-1) = k^2 + k - k^2 + k = 2k$.
2. On additionne pour $k$ de 1 à $n$. À gauche, ça se télescope : $u_{n+1} - u_1 = (n+1)n - 1 \times 0 = n(n+1)$.
3. À droite : $\sum_{k=1}^{n} 2k = 2 \sum_{k=1}^{n} k$.
4. On égale les deux côtés : $2 \sum k = n(n+1)$, donc $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$.

Pour la somme des carrés, c'est le même plan : télescoper à gauche, couper la somme à droite avec la linéarité (sans oublier $\sum 1 = n$), puis isoler la somme cherchée en divisant par son coefficient.

**À retenir :** télescoper à gauche, linéarité à droite, puis isoler la somme cherchée.

### Les produits

$$\prod_{k=1}^{n} a_k = a_1 \times a_2 \times \dots \times a_n \qquad \prod_{k=1}^{n} k = n! \qquad \prod_{k=1}^{n} c = c^n$$

$n!$ se lit « factorielle $n$ » : $5! = 1 \times 2 \times 3 \times 4 \times 5 = 120$.

Les produits peuvent aussi se simplifier « en cascade » :
$$\prod_{k=2}^{n} \frac{k}{k-1} = \frac{2}{1} \times \frac{3}{2} \times \dots \times \frac{n}{n-1} = n$$

**Exemple résolu :** comparer somme et produit d'une constante, puis simplifier une cascade.

- $\prod_{k=1}^{4} 2 = 2 \times 2 \times 2 \times 2 = 2^4 = 16$, alors que $\sum_{k=1}^{4} 2 = 2 + 2 + 2 + 2 = 4 \times 2 = 8$. Le produit met la constante **en puissance**, la somme la **multiplie**.
- Attention à l'ordre dans la puissance : c'est $c^n$ (la constante en bas, le nombre de facteurs en haut). Avec 5 facteurs : $\prod_{k=1}^{5} 2 = 2^5 = 32$, et non $5^2 = 25$.
- Cascade pour $n = 4$ : $\frac{2}{1} \times \frac{3}{2} \times \frac{4}{3}$. Le 2 du haut s'annule avec le 2 du bas suivant, puis le 3 avec le 3. Il reste le dernier numérateur sur le premier dénominateur : $\frac{4}{1} = 4$, ce qui donne bien $n$.

**À retenir :** $\prod c = c^n$ et $\sum c = n\,c$ ; dans une cascade, il reste le dernier numérateur sur le premier dénominateur.

### Les sommes infinies (aperçu)

$\sum_{k=1}^{+\infty} a_k$ n'a de sens que si les termes deviennent assez vite négligeables. C'est le sujet des **séries**, vues plus tard.

## 4. Le pont vers SQL

| Maths | SQL |
|---|---|
| $\sum 1$ | `COUNT(*)` |
| $\sum a_k$ | `SUM(col)` |
| $\frac{1}{n} \sum a_k$ | `AVG(col)` |
| somme double (somme externe = un groupe) | `GROUP BY` |
| prédicat ligne par ligne, **avant** la somme | `WHERE` |
| prédicat sur le **résultat** d'une somme | `HAVING` |

```sql
SELECT magasin, SUM(montant) AS ca
FROM Ventes
WHERE statut = 'validee'
GROUP BY magasin
HAVING SUM(montant) > 5000;
```

`WHERE` enlève les ventes non validées **avant** de faire les sommes ; `HAVING` garde ensuite seulement les magasins dont la somme dépasse 5000.

> [!warning] Piège
> On ne peut pas écrire `WHERE SUM(montant) > 5000` : au moment où `WHERE` s'applique, la somme n'est pas encore calculée.

**Exemple résolu :** la table `Notes(eleve, note)` contient (Ali, 12), (Ali, 8), (Bea, 15), (Bea, 17), (Bea, 10), (Cy, 6).

1. `SELECT COUNT(*) FROM Notes;` : $\sum 1$, une par ligne, donc **6**.
2. `SELECT SUM(note) FROM Notes WHERE eleve = 'Bea';` : `WHERE` garde 15, 17 et 10, puis `SUM` donne $15 + 17 + 10 = 42$.
3. `SELECT AVG(note) FROM Notes;` : somme $12 + 8 + 15 + 17 + 10 + 6 = 68$, divisée par le nombre de lignes 6, soit environ $11{,}33$. Ne pas oublier la division.
4. `SELECT eleve, SUM(note) FROM Notes GROUP BY eleve HAVING SUM(note) > 25;` : on calcule d'abord un total par élève (Ali $= 20$, Bea $= 42$, Cy $= 6$), puis `HAVING` garde ceux au-dessus de 25 : seulement Bea, **1** ligne.
5. Même requête avec `WHERE note >= 10` avant le `GROUP BY` : le 8 et le 6 disparaissent **avant** les totaux. Ali $= 12$, Bea $= 42$, Cy n'a plus de ligne (il disparaît du résultat). Toujours seulement Bea au-dessus de 25 : 1 ligne, mais les totaux ont changé.

L'ordre de travail de SQL est toujours : `WHERE` (filtre les lignes), puis `GROUP BY` (forme les groupes et fait les sommes), puis `HAVING` (filtre les groupes).

**À retenir :** une condition sur une ligne va dans `WHERE`, une condition sur un total va dans `HAVING`.

### « Pour tout » et « il existe » en SQL

Un « pour tout » sur les lignes d'un groupe se traduit souvent avec `MIN` ou `MAX` :

- « **toutes** les valeurs sont $\leq s$ » est vrai exactement quand **la plus grande** l'est : `HAVING MAX(col) <= s` ;
- « **toutes** les valeurs sont $\geq s$ » : `HAVING MIN(col) >= s` ;
- « **il existe** une valeur $> s$ » est la négation de la première : `MAX(col) > s`.

**Exemple résolu :** les élèves dont **toutes** les notes sont au moins 10 (même table `Notes`).

1. En formule : $\forall n \in \mathrm{notes}(e),\ n \geq 10$.
2. Avec `MIN` : Ali a pour plus petite note 8 (exclu), Bea 10 (gardée), Cy 6 (exclu).

```sql
SELECT eleve
FROM Notes
GROUP BY eleve
HAVING MIN(note) >= 10;
```

3. Autre façon : on exclut les élèves pour qui la **négation** est vraie, c'est-à-dire « il existe une note $< 10$ », avec `NOT EXISTS`.

```sql
SELECT DISTINCT n1.eleve
FROM Notes n1
WHERE NOT EXISTS (
  SELECT 1 FROM Notes n2
  WHERE n2.eleve = n1.eleve AND n2.note < 10
);
```

Erreur classique : `WHERE note >= 10` sans regroupement. Il garde les **bonnes notes** d'Ali (son 12), donc Ali apparaîtrait alors qu'il a un 8.

**À retenir :** « toutes $\leq s$ » = `MAX <= s`, « toutes $\geq s$ » = `MIN >= s` ; ou bien `NOT EXISTS` sur la négation.

### Le coût d'une somme refaite à chaque ligne

Une **sous-requête corrélée** est une sous-requête qui utilise une colonne de la ligne en cours (par exemple `WHERE l2.agence = l1.agence`) : elle est relancée **pour chaque ligne**. Si elle recalcule un `SUM` sur toute la table de $n$ lignes, le travail est :

$$\underbrace{n}_{\text{exécutions}} \times \underbrace{n}_{\text{lignes lues à chaque fois}} = n^2 \text{ lignes lues}$$

C'est une somme double : la somme externe parcourt les lignes, la somme interne relit toute la table. Un seul `GROUP BY` lit la table **une** fois : $n$ lignes.

**Exemple résolu :** une table de $n = 3\,000$ lignes.

1. Sous-requête corrélée : $3\,000$ exécutions, chacune lit $3\,000$ lignes, soit $3\,000 \times 3\,000 = 9\,000\,000$ lignes lues. On **multiplie** (additionner donnerait $6\,000$, c'est faux).
2. Avec `GROUP BY` : $3\,000$ lignes lues, soit $3\,000$ fois moins.
3. Si la table double ($n = 6\,000$) : l'ancienne requête lit $6\,000^2 = 36\,000\,000$ lignes, soit $2^2 = 4$ fois plus. Le `GROUP BY` lit seulement 2 fois plus.

Un `DISTINCT` placé devant ne change rien à ce travail : il enlève les doublons **à la fin**, après toutes les exécutions.

**À retenir :** un coût en $n^2$ est multiplié par $c^2$ quand la table est $c$ fois plus grande ; un coût en $n$ seulement par $c$.

## À retenir

- Un prédicat devient vrai ou faux quand on fixe ses variables.
- L'ordre de $\forall$ et $\exists$ change le sens.
- Négation : de l'extérieur vers l'intérieur, $\forall \leftrightarrow \exists$, puis on nie le prédicat.
- $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$ et $\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$.
- Linéarité : on coupe les sommes et on sort les constantes, mais $\sum a_k b_k \neq \sum a_k \sum b_k$.
- Changement d'indice : les bornes bougent.
- Télescopage : $\sum (u_{k+1} - u_k) = u_{n+1} - u_1$.
- `WHERE` filtre avant la somme, `HAVING` après. `GROUP BY` = somme double.
