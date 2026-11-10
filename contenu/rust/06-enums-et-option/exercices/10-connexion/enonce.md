Un client peut être **déconnecté**, **en cours de connexion** depuis un instant donné, ou **connecté** avec un numéro de session et un pseudo. Avec des booléens et des `Option`, on obtiendrait 16 combinaisons, dont la plupart absurdes. L'enum n'en permet que 3 :

```rust
enum Connexion {
    Deconnecte,
    EnCours { depuis_ms: u64 },
    Connecte { session: u64, pseudo: String },
}
```

Complète les méthodes. Une transition qui n'a pas de sens **ne change rien** (elle renvoie la connexion telle quelle).

| Méthode | Effet |
|---|---|
| `demarrer(self, maintenant_ms)` | `Deconnecte` → `EnCours { depuis_ms: maintenant_ms }` ; sinon rien ne change |
| `accepter(self, session, pseudo)` | `EnCours` → `Connecte { session, pseudo }` ; sinon rien ne change |
| `deconnecter(self)` | n'importe quel état → `Deconnecte` |
| `pseudo(&self) -> Option<&str>` | le pseudo si connecté, `None` sinon |
| `trop_longue(&self, maintenant_ms, limite_ms) -> bool` | `true` si on est **en cours** depuis **plus** de `limite_ms` millisecondes |

```rust
let c = Connexion::Deconnecte.demarrer(1_000);    // EnCours { depuis_ms: 1000 }
c.trop_longue(7_000, 5_000);                      // true : 6 000 ms d'attente
let c = c.accepter(42, "ferris");                 // Connecte { session: 42, pseudo: "ferris" }
c.pseudo();                                       // Some("ferris")
```

> [!info] Pourquoi `self` et pas `&mut self` ?
> Les transitions **consomment** l'ancien état et en fabriquent un nouveau : on ne peut plus utiliser l'ancien par erreur.
