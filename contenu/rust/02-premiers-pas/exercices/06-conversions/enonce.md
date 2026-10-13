Rust ne convertit **jamais** un nombre tout seul d'un type à un autre. Écris :

1. `additionner(petit: u8, grand: u32) -> u32` : la somme des deux, avec une conversion **sûre**.
2. `vers_u8(n: u32) -> Option<u8>` : `Some(valeur)` si `n` tient dans un `u8` (0 à 255), sinon `None`.
3. `garder_octet_bas(n: u32) -> u8` : garde seulement les 8 bits du bas (300 donne 44, 256 donne 0).

> [!info] `Option`
> `Option<u8>` veut dire « peut-être un `u8` » : soit `Some(42)`, soit `None` (rien). On le verra en détail plus tard.
