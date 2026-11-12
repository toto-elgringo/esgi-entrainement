Un solde est partagé entre plusieurs propriétaires : c'est un `Rc<RefCell<i32>>`. Chaque propriétaire a son propre `Rc` (obtenu par `Rc::clone`), mais tous voient la même valeur.

1. `deposer(solde, montant)` ajoute `montant` au solde.
2. `retirer(solde, montant)` enlève `montant`. S'il n'y en a pas assez, ne change rien et renvoie `Err("solde insuffisant".to_string())`. Sinon `Ok(())`.
3. `virement(source, cible, montant)` retire de `source` puis dépose sur `cible`. Si le retrait échoue, `cible` ne change pas.

| Situation | Résultat |
|---|---|
| Solde `100`, `retirer(30)` | `Ok(())`, solde `70` |
| Solde `100`, `retirer(150)` | `Err("solde insuffisant")`, solde `100` |
| Virement de `40` entre deux comptes de `100` | `60` et `140` |

> [!warning] Une lecture et une écriture en même temps
> Écrire `if *solde.borrow() >= montant { *solde.borrow_mut() -= montant; }` est risqué : selon la forme, le garde de lecture peut rester vivant. Lis la valeur dans une variable d'abord.
