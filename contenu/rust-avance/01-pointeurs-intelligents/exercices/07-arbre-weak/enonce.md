# Un arbre avec parent faible

On veut un arbre où chaque nœud connaît ses enfants **et** son parent. Si les deux liens étaient des `Rc`, ils formeraient un cycle et la mémoire ne serait jamais libérée. La règle :

- le parent **possède** ses enfants : `Vec<Rc<Noeud>>` ;
- l'enfant **connaît** son parent par un lien faible : `Weak<Noeud>`.

Les champs sont dans des `RefCell` pour pouvoir être modifiés après la création : `borrow()` lit, `borrow_mut()` écrit.

Écris :

- `nouveau(nom)` : un nœud sans parent ni enfants, dans un `Rc` ;
- `ajouter_enfant(parent, enfant)` : ajoute l'enfant à la liste du parent **et** donne le parent à l'enfant ;
- `nom_du_parent(noeud)` : le nom du parent, ou `None` s'il n'y en a pas (ou s'il a disparu) ;
- `chemin(noeud)` : les noms depuis la racine, séparés par `/` (par exemple `racine/a/b`) ;
- `nombre_enfants(noeud)` : le nombre d'enfants.

> [!info] `upgrade`
> `weak.upgrade()` essaie de retrouver un `Rc`. Si la valeur a déjà été libérée, il renvoie `None`.
