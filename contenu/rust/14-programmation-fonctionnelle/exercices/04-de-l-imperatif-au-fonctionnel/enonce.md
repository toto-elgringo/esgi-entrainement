Voici quatre fonctions écrites en style **impératif**, avec des boucles et des variables `mut`. Réécris-les en style **fonctionnel** : une chaîne d'itérateurs, sans `for`, sans `while` et sans `mut`. Elles doivent donner exactement les mêmes résultats (les tests ne vérifient que les résultats : à toi de jouer le jeu).

### 1. Les mots longs, en majuscules

```rust
fn mots_longs_en_majuscules(phrase: &str, taille_min: usize) -> Vec<String> {
    let mut resultat = Vec::new();
    for mot in phrase.split_whitespace() {
        if mot.chars().count() >= taille_min {
            resultat.push(mot.to_uppercase());
        }
    }
    resultat
}
```

### 2. L'indice du premier nombre négatif

```rust
fn indice_du_premier_negatif(nombres: &[i32]) -> Option<usize> {
    let mut i = 0;
    while i < nombres.len() {
        if nombres[i] < 0 {
            return Some(i);
        }
        i += 1;
    }
    None
}
```

### 3. La plus forte hausse

Des mesures sont relevées toutes les heures. La fonction renvoie la plus forte hausse entre deux relevés qui se suivent, ou `0` s'il n'y a aucune hausse (moins de deux mesures, ou des mesures qui ne font que baisser).

```rust
fn plus_forte_hausse(mesures: &[i32]) -> i32 {
    let mut meilleure = 0;
    let mut precedente = None;
    for &mesure in mesures {
        if let Some(avant) = precedente {
            let hausse = mesure - avant;
            if hausse > meilleure {
                meilleure = hausse;
            }
        }
        precedente = Some(mesure);
    }
    meilleure
}
```

### 4. Les paires qui donnent une somme

Toutes les paires `(a, b)` où `a` est placé avant `b` dans la liste et `a + b == cible`, dans l'ordre où les boucles les trouvent.

```rust
fn paires_de_somme(nombres: &[i32], cible: i32) -> Vec<(i32, i32)> {
    let mut paires = Vec::new();
    for i in 0..nombres.len() {
        for j in (i + 1)..nombres.len() {
            if nombres[i] + nombres[j] == cible {
                paires.push((nombres[i], nombres[j]));
            }
        }
    }
    paires
}
```

| Appel | Résultat |
|---|---|
| `mots_longs_en_majuscules("le petit chat dort", 4)` | `["PETIT", "CHAT", "DORT"]` |
| `indice_du_premier_negatif(&[3, 7, -2, 5, -8])` | `Some(2)` |
| `plus_forte_hausse(&[10, 12, 11, 15, 20])` | `5` |
| `paires_de_somme(&[1, 4, 3, 2, 5], 5)` | `[(1, 4), (3, 2)]` |

> [!tip] La méthode
> 1. Ce que la boucle produit → le consommateur (`collect`, `position`, `max`, `fold`...).
> 2. Un `if` qui écarte des éléments → `filter`.
> 3. Une transformation → `map`.
> 4. Une variable « précédente » → `windows(2)`. Deux boucles imbriquées → `flat_map`.
