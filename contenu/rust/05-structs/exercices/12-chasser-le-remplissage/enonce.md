Un capteur envoie ses mesures dans un format binaire partagé avec un programme C : la struct doit garder `#[repr(C)]` (les champs restent dans l'ordre écrit). Mais telle qu'elle est déclarée, elle occupe **32 octets** pour seulement 16 octets de données !

```rust
#[repr(C)]
struct Mesure {
    actif: bool,       // 1 octet
    horodatage: u64,   // 8 octets
    niveau: u8,        // 1 octet
    valeur: u32,       // 4 octets
    numero: u16,       // 2 octets
}
```

**Réordonne les champs** (sans changer leurs noms ni leurs types, et en gardant `#[repr(C)]`) pour que `size_of::<Mesure>()` vaille **16**, sans aucun octet de remplissage. Les tests vérifient aussi la position de chaque champ avec `offset_of!`.

> [!tip] Lire la disposition
> Le bouton « Exécuter » affiche la taille et la position de chaque champ. Avec l'ordre actuel : `actif` à l'octet 0, puis 7 octets vides, car `horodatage` doit commencer à un multiple de 8…

> [!info] Règle simple
> Avec `#[repr(C)]`, ranger les champs **du plus grand alignement au plus petit** supprime presque tous les trous. Sans `repr(C)`, Rust réordonne tout seul, mais sans garantie sur l'ordre choisi.
