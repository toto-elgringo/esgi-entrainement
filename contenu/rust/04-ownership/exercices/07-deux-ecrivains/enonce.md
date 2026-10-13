`construire()` doit renvoyer `"Hello, World!"`.

Le code ne compile pas (erreur **E0499**, *cannot borrow `s` as mutable more than once at a time*). Corrige-le en **réordonnant** les lignes, sans en supprimer ni en ajouter.

> [!tip] Un emprunt meurt à sa dernière utilisation
> Depuis 2018 (*non-lexical lifetimes*), un emprunt ne dure pas jusqu'à la fin du bloc : il s'arrête dès sa dernière utilisation. Deux `&mut` peuvent donc se suivre, tant qu'ils ne se **chevauchent** pas.
