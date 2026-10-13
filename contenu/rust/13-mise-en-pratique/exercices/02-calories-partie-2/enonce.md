Suite d'**Advent of Code 2022, jour 1**. Pour être tranquilles, les lutins veulent connaître le total des **trois** lutins les plus chargés.

1. `totaux_par_lutin(entree)` : la liste des totaux, dans l'ordre des lutins.
   Sur l'exemple : `vec![6000, 4000, 11000, 24000, 10000]`.
2. `top3_calories(entree)` : la somme des trois plus gros totaux.
   Sur l'exemple : 24000 + 11000 + 10000 = `45000`. S'il y a moins de trois lutins, on additionne ceux qui existent.

> [!info] Deux façons
> Le cours garde un « podium » de trois variables (`best_1`, `best_2`, `best_3`) qu'il décale à la main. Ici, on range tous les totaux dans un `Vec`, puis on trie : plus simple à écrire et à relire.
