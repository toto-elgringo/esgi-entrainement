Écris `unsafe fn echanger(a: *mut i32, b: *mut i32)` qui échange les valeurs pointées par `a` et `b`.

L'appelant doit garantir que les deux pointeurs sont valides : c'est pourquoi la fonction est `unsafe`.

| Avant | Après |
|---|---|
| `a = 1`, `b = 2` | `a = 2`, `b = 1` |

> [!warning] Édition 2024
> Même dans une `unsafe fn`, les opérations dangereuses doivent être dans un bloc `unsafe { ... }`.
