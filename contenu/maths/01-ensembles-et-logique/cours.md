# Ensembles et logique

> [!info] Pourquoi ce chapitre ?
> Une table SQL est un **ensemble de lignes**. Une jointure est une **opération sur des ensembles**. Une clause `WHERE` est une **proposition logique**. Ce chapitre donne le vocabulaire pour manipuler tout ça proprement.

## 1. Les ensembles

Un **ensemble** est une collection d'objets appelés **éléments**, **sans ordre et sans répétition**.

- On l'écrit en **extension** (on liste tout) : $E = \{1, 2, 3\}$.
- Ou en **compréhension** (on donne une propriété) : $E = \{x \in \mathbb{R} \mid x \ge 0\}$, qui se lit « les réels $x$ tels que $x \ge 0$ ».

| Notation | Lecture |
|---|---|
| $x \in E$ | $x$ appartient à $E$ |
| $x \notin E$ | $x$ n'appartient pas à $E$ |
| $\emptyset$ | l'ensemble vide (aucun élément) |
| $A \subset B$ | $A$ est inclus dans $B$ : tout élément de $A$ est aussi dans $B$ |

Le nombre d'éléments d'un ensemble fini s'appelle son **cardinal**, noté $|A|$ ou $\text{card}(A)$.

> [!tip] Sans ordre ni répétition
> $\{1, 2, 3\} = \{3, 1, 2\}$ et $\{1, 1, 2\} = \{1, 2\}$ : ce dernier ensemble a seulement **2** éléments.

### Égalité par double inclusion

Pour montrer que deux ensembles sont égaux, on montre les deux inclusions :

$$A = B \iff A \subset B \text{ et } B \subset A$$

Pour montrer $A \subset B$ : on prend un élément $x$ **quelconque** de $A$ et on montre que $x \in B$.

## 2. Les opérations

| Opération | Définition | En SQL |
|---|---|---|
| Union $A \cup B$ | les éléments de $A$ **ou** de $B$ (ou des deux) | `UNION` |
| Intersection $A \cap B$ | les éléments de $A$ **et** de $B$ | `INTERSECT` |
| Différence $A \setminus B$ | les éléments de $A$ qui ne sont **pas** dans $B$ | `EXCEPT` |
| Complémentaire $\overline{A}$ | les éléments de l'ensemble de référence $E$ qui ne sont pas dans $A$ | |

Exemple avec $A = \{1, 2, 3, 4\}$ et $B = \{3, 4, 5, 6\}$ :

- $A \cup B = \{1, 2, 3, 4, 5, 6\}$
- $A \cap B = \{3, 4\}$
- $A \setminus B = \{1, 2\}$ et $B \setminus A = \{5, 6\}$

> [!warning] La différence n'est pas symétrique
> $A \setminus B$ et $B \setminus A$ sont en général différents.

### Les lois de De Morgan

Le complémentaire **échange** union et intersection :

$$\overline{A \cup B} = \overline{A} \cap \overline{B} \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}$$

En SQL, c'est la règle pour nier une condition : `NOT (age < 18 OR pays = 'FR')` devient `age >= 18 AND pays <> 'FR'`. Le `OR` devient `AND` et chaque comparaison est inversée.

## 3. Le produit cartésien

Le **produit cartésien** de $A$ et $B$ est l'ensemble de tous les **couples** $(a, b)$ avec $a \in A$ et $b \in B$ :

$$A \times B = \{(a, b) \mid a \in A,\ b \in B\} \qquad |A \times B| = |A| \times |B|$$

Exemple : $\{x, y\} \times \{1, 2\} = \{(x, 1), (x, 2), (y, 1), (y, 2)\}$.

- `CROSS JOIN` en SQL = produit cartésien : 4 lignes croisées avec 3 lignes donnent 12 lignes.
- `INNER JOIN ... ON condition` = produit cartésien **filtré** par la condition.

> [!warning] Les couples sont ordonnés
> $(x, 1) \neq (1, x)$, donc $A \times B \neq B \times A$ en général, même s'ils ont le même nombre d'éléments.

## 4. Les relations binaires

Une **relation** $R$ sur un ensemble $E$ est un sous-ensemble de $E \times E$. On écrit $x \, R \, y$ quand le couple $(x, y)$ est dans la relation.

| Propriété | Définition | Exemple |
|---|---|---|
| Réflexive | $\forall x,\ x R x$ | « est égal à » |
| Symétrique | $x R y \Rightarrow y R x$ | « est collègue de » |
| Antisymétrique | $(x R y \text{ et } y R x) \Rightarrow x = y$ | $\le$ |
| Transitive | $(x R y \text{ et } y R z) \Rightarrow x R z$ | $\le$, « est ancêtre de » |

Deux familles à connaître :

- **Relation d'équivalence** = réflexive + symétrique + transitive. Elle découpe l'ensemble en **classes** (des groupes d'éléments équivalents). En SQL : `GROUP BY`.
- **Relation d'ordre** = réflexive + antisymétrique + transitive. Elle permet de classer. En SQL : `ORDER BY`.

Exemple d'équivalence : « avoir la même parité » sur $\mathbb{Z}$. Il y a **2 classes** : les pairs et les impairs.

Exemple d'ordre : « $x$ divise $y$ » sur $\mathbb{N}^*$. C'est un ordre **partiel** : 6 et 10 ne sont pas comparables (aucun ne divise l'autre). Au contraire, $\le$ sur $\mathbb{R}$ est un ordre **total** : deux réels sont toujours comparables.

> [!warning] $<$ n'est pas une relation d'ordre au sens du cours
> Elle n'est pas réflexive ($x < x$ est faux). On parle d'ordre **strict**.

## 5. Les fonctions

Une **fonction** $f : A \to B$ associe à **chaque** élément de $A$ **exactement une** image dans $B$.

- **Injective** : deux éléments différents ont des images différentes : $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$.
- **Surjective** : tout élément de $B$ est l'image d'au moins un élément de $A$.

En base de données : la fonction « employé $\mapsto$ identifiant » est injective grâce à la **clé primaire** (ou une contrainte `UNIQUE`). La fonction « employé $\mapsto$ département » ne l'est pas : plusieurs employés partagent un département.

## 6. La logique

Une **proposition** est un énoncé qui est soit vrai (V), soit faux (F), jamais les deux.

| Connecteur | Notation | Lecture |
|---|---|---|
| Négation | $\neg P$ | non $P$ |
| Conjonction | $P \wedge Q$ | $P$ et $Q$ |
| Disjonction | $P \vee Q$ | $P$ ou $Q$ (ou les deux) |
| Implication | $P \Rightarrow Q$ | si $P$ alors $Q$ |
| Équivalence | $P \Leftrightarrow Q$ | $P$ si et seulement si $Q$ |

### L'implication

| $P$ | $Q$ | $P \Rightarrow Q$ |
|---|---|---|
| V | V | V |
| V | F | **F** |
| F | V | V |
| F | F | V |

$P \Rightarrow Q$ est fausse **uniquement** quand $P$ est vraie et $Q$ fausse.

> [!warning] Une implication est vraie quand $P$ est fausse
> « S'il pleut, je prends mon parapluie » n'est pas contredite un jour sans pluie, quoi que je fasse.

- **Négation** d'une implication : $\neg(P \Rightarrow Q) \equiv P \wedge \neg Q$. On la contredit en trouvant un cas où $P$ est vraie et $Q$ fausse.
- **Contraposée** : $P \Rightarrow Q$ a la même valeur que $\neg Q \Rightarrow \neg P$.
- **Réciproque** : $Q \Rightarrow P$. Elle n'a **rien à voir** : elle peut être fausse quand l'implication est vraie.

### Les lois de De Morgan en logique

$$\neg(P \wedge Q) \equiv \neg P \vee \neg Q \qquad \neg(P \vee Q) \equiv \neg P \wedge \neg Q$$

### Les quantificateurs (aperçu)

- $\forall x,\ P(x)$ : « pour tout $x$, $P(x)$ est vraie ».
- $\exists x,\ P(x)$ : « il existe au moins un $x$ tel que $P(x)$ ».
- La négation échange les deux : $\neg(\forall x,\ P(x)) \equiv \exists x,\ \neg P(x)$ et $\neg(\exists x,\ P(x)) \equiv \forall x,\ \neg P(x)$.

Exemple : « tous les clients ont payé » se nie en « **il existe** un client qui **n'a pas** payé ».

## 7. Quatre méthodes de preuve

1. **Directe** : on part de l'hypothèse $P$ et on enchaîne jusqu'à $Q$.
2. **Par contraposée** : on montre $\neg Q \Rightarrow \neg P$, souvent plus simple.
3. **Par l'absurde** : on suppose le contraire de ce qu'on veut, et on arrive à une contradiction.
4. **Par contre-exemple** : pour montrer qu'un « pour tout » est **faux**, un seul cas qui ne marche pas suffit.

Exemples :

- **Directe** : si $n$ est pair, $n = 2k$, donc $n^2 = 4k^2 = 2(2k^2)$ est pair.
- **Contraposée** : pour montrer « $n^2$ pair $\Rightarrow n$ pair », on montre « $n$ impair $\Rightarrow n^2$ impair » : $n = 2k + 1$ donne $n^2 = 2(2k^2 + 2k) + 1$.
- **Absurde** : $\sqrt{2}$ n'est pas une fraction. Si $\sqrt{2} = \frac{p}{q}$ (fraction irréductible), alors $p^2 = 2q^2$, donc $p$ est pair, puis $q$ aussi : la fraction n'était pas irréductible, contradiction.
- **Contre-exemple** : « $x^2 > 4 \Rightarrow x > 2$ » est faux : $x = -3$ donne $x^2 = 9 > 4$ mais $-3 < 2$.

> [!tip] Choisir sa méthode
> Directe si ça s'enchaîne naturellement. Contraposée si la conclusion est plus simple à nier. Absurde pour « il n'existe pas » ou « est irrationnel ». Contre-exemple pour réfuter un « pour tout ».

> [!warning] Un exemple ne prouve pas un « pour tout »
> Vérifier une propriété sur 10, 100 ou 1 000 cas ne prouve rien. Mais **un seul** contre-exemple suffit à la réfuter.

## 8. Le pont vers SQL

| Mathématiques | SQL |
|---|---|
| $A \cup B$, $A \cap B$, $A \setminus B$ | `UNION`, `INTERSECT`, `EXCEPT` |
| $A \times B$ | `CROSS JOIN` |
| produit cartésien filtré | `INNER JOIN ... ON ...` |
| proposition logique | condition `WHERE` |
| relation d'équivalence | `GROUP BY` |
| relation d'ordre | `ORDER BY` |
| fonction injective | clé primaire, `UNIQUE` |
| $\neg \exists$ | `NOT EXISTS` |

Les clients qui n'ont jamais commandé : $\forall\, cmd \in Commandes,\ cmd.client \neq c$, soit :

```sql
SELECT * FROM Clients c
WHERE NOT EXISTS (
  SELECT 1 FROM Commandes cmd WHERE cmd.id_client = c.id_client
);
```

## À retenir

- Un ensemble n'a ni ordre ni répétition. $A = B$ se prouve par double inclusion.
- $\cup$ = ou, $\cap$ = et, $\setminus$ = sauf. De Morgan échange $\cup$ et $\cap$ (et `AND` / `OR`).
- $|A \times B| = |A| \times |B|$, et $A \times B \neq B \times A$.
- Équivalence (réflexive, symétrique, transitive) = classes = `GROUP BY`. Ordre (réflexive, antisymétrique, transitive) = `ORDER BY`.
- $P \Rightarrow Q$ est fausse seulement si $P$ vraie et $Q$ fausse. Sa négation est $P \wedge \neg Q$, sa contraposée $\neg Q \Rightarrow \neg P$.
- Un seul contre-exemple réfute un « pour tout ».
