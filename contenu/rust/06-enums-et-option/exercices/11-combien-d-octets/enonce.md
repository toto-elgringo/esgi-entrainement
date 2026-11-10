Sans lancer `size_of`, **prédis** la taille en octets de chaque type (machine 64 bits) et écris-la dans les constantes. Les tests comparent tes réponses avec `std::mem::size_of`.

```rust
enum Potion { Soin(u8), Force(i8) }
enum Arme { Epee { degats: u8 }, Hache { degats: u8 }, Arc { degats: u8, portee: u32 } }
enum Objet { Rien, Arme(Arme), Armure { defense: u8 }, Potion(Potion) }
```

| Constante | Type |
|---|---|
| `POTION` | `Potion` |
| `ARME` | `Arme` |
| `OBJET` | `Objet` |
| `OPTION_U8` | `Option<u8>` |
| `OPTION_U32` | `Option<u32>` |
| `OPTION_NON_NUL` | `Option<NonZeroU32>` (un `u32` qui ne vaut jamais 0) |
| `OPTION_REFERENCE` | `Option<&u8>` |
| `OPTION_BOOL` | `Option<bool>` |

> [!tip] Les deux règles du cours
> 1. Une enum = sa **plus grosse variante + l'étiquette**, arrondie à l'**alignement** de son plus gros champ (`u8` : 1, `u32` : 4, référence : 8).
> 2. Si le type contient des valeurs jamais utilisées (des **niches**), l'étiquette s'y cache gratuitement : c'est le *niche filling*.

> [!info] Vérifier soi-même
> Une fois les tests réussis, essaie dans un exemple du cours : `println!("{}", std::mem::size_of::<Option<String>>());`.
