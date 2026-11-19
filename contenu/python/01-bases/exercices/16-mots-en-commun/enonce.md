Trois fonctions sur les mots d'un texte. Partout, les **majuscules ne comptent pas** (« Le » et « le » sont le même mot) et les mots peuvent être séparés par **plusieurs** espaces.

- `nb_mots_distincts(texte)` : le nombre de mots différents. `nb_mots_distincts("Le chat et le chien")` → `4` ;
- `vocabulaire_commun(texte1, texte2)` : la **liste triée** des mots (en minuscules) présents dans les deux textes. `vocabulaire_commun("Le chat dort", "le chien dort")` → `["dort", "le"]` ;
- `surligner(texte, mots_cles)` : renvoie le texte où chaque mot présent dans `mots_cles` est écrit en **MAJUSCULES**, et chaque autre mot en minuscules, séparés par **un seul** espace. Les mots-clés peuvent eux-mêmes contenir des majuscules.

```python
print(surligner("Le chat  et LE chien", ["le", "Loup"]))
# LE chat et LE chien
```

Le code de départ contient déjà une version de `nb_mots_distincts` et de `surligner`, mais elles se trompent dans certains cas (lance les tests pour les voir). Corrige-les.

> [!tip] Un seul passage
> Pas besoin de comparer chaque mot à chaque autre avec deux boucles imbriquées : les ensembles répondent tout de suite à la question « ce mot est-il dedans ? ».
