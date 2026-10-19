Écris trois fonctions sur les adresses e-mail :

- `est_valide(adresse)` : `True` si l'adresse respecte **toutes** ces règles :
  - aucun espace ;
  - exactement un `@` ;
  - au moins un caractère avant le `@` ;
  - après le `@`, un domaine qui contient un `.`, mais ne commence ni ne finit par un `.` ;
- `domaine(adresse)` : la partie après le `@`, en minuscules. `domaine("Ada@Exemple.FR")` → `"exemple.fr"` ;
- `masquer(adresse)` : garde la première lettre du nom, remplace le reste par `***`. `masquer("ada.lovelace@exemple.fr")` → `"a***@exemple.fr"`.

Les fonctions `domaine` et `masquer` ne reçoivent que des adresses valides.
