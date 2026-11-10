L'inventaire du cours : un `Objet` peut être une `Arme`, qui est elle-même une enum. Complète les trois fonctions.

| Fonction | Résultat |
|---|---|
| `degats(&objet) -> u8` | les dégâts si c'est une arme (épée, hache ou arc), `0` sinon |
| `portee(&objet) -> Option<u32>` | `Some(portee)` pour un arc, `None` pour tout le reste |
| `decrire(&objet) -> String` | le texte ci-dessous |

| Objet | `decrire` |
|---|---|
| `Objet::Rien` | `rien` |
| `Objet::Armure { defense: 3 }` | `armure (3 de défense)` |
| `Objet::Arme(Arme::Arc { degats: 7, portee: 40 })` | `arc : 7 dégâts à 40 m` |
| une épée ou une hache | `arme de corps à corps` |
| `Objet::Potion(Potion::Soin(20))` | `potion de soin (+20)` |
| `Objet::Potion(Potion::Force(-2))` | `potion de force (-2)` |

Pour la force, le signe est toujours affiché : `+3` ou `-2`. Le format `{:+}` le fait tout seul (`format!("{:+}", 3)` donne `+3`).

> [!tip] Motifs en profondeur
> `Objet::Arme(Arme::Arc { degats, portee })` ouvre `Objet` **et** `Arme` dans le même bras. `..` ignore les champs dont tu n'as pas besoin : `Arme::Arc { portee, .. }`.

> [!warning] Pas de `_` paresseux
> Le compilateur te dira si tu oublies une variante. Garde le `_` pour les cas qui sont vraiment « tout le reste ».
