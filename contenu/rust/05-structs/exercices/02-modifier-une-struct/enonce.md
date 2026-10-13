Le `Compteur` doit pouvoir avancer et être remis à zéro, mais le code **ne compile pas** :

- `compter_jusqua(n)` crée un compteur à 0, l'avance `n` fois et renvoie sa valeur ;
- `remettre_a_zero(compteur)` remet la valeur du compteur reçu à 0.

Corrige les deux erreurs **sans changer la logique**.

> [!warning] Rappel
> On ne peut pas rendre un seul champ modifiable : c'est toute la variable qui est `mut`, ou la référence qui est `&mut`.
