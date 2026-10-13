Un robot reçoit des messages. L'enum `Message` utilise les trois formes de variantes : avec champs nommés, avec champs numérotés et sans donnée.

1. `Robot::new()` : position `(0, 0)`, texte vide, couleur `(0, 0, 0)`, actif ;
2. `traiter(&mut self, message)` applique le message :

| Message | Effet |
|---|---|
| `Avancer { x, y }` | ajoute `x` et `y` à la position |
| `Ecrire(texte)` | ajoute `texte` à la fin du texte du robot |
| `ChangerCouleur(r, g, b)` | remplace la couleur |
| `Arreter` | le robot n'est plus actif |

Un robot arrêté **ignore** tous les messages suivants.

> [!info] Tuples
> `position` est un tuple `(i32, i32)` : on lit ou modifie ses cases avec `self.position.0` et `self.position.1`.
