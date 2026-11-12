Prépare du code Rust utilisable depuis C (ou Python avec `ctypes`).

1. `additionner(a: i32, b: i32) -> i32` : renvoie la somme. Elle doit avoir le nom exact `additionner` dans le binaire.
2. La structure `Point { x: i32, y: i32 }` doit avoir la **même disposition mémoire qu'en C**.
3. `distance_carree(p: Point) -> i32` : renvoie `x * x + y * y`, aussi visible par C.

Attributs à utiliser : `#[unsafe(no_mangle)]` et `#[repr(C)]`. Les fonctions sont `pub extern "C" fn`.

> [!info] Édition 2024
> On écrit `#[unsafe(no_mangle)]`, plus `#[no_mangle]`.
