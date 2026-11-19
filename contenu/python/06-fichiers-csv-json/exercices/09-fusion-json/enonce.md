Plusieurs magasins relèvent les prix de leurs articles à des dates différentes. Chaque relevé est un fichier JSON de cette forme (date au format `jour-mois-année`, sans zéros devant) :

```json
{
  "articles": [
    {"nom": "pomme", "prix": 3.1, "date": "12-4-2008"},
    {"nom": "banane", "prix": 4.0, "date": "3-1-2009"}
  ]
}
```

Écris deux fonctions :

- `date_en_tuple(texte)` : transforme une date `"12-4-2008"` en tuple `(2008, 4, 12)`, qu'on peut comparer avec `<` et `>` ;
- `fusionner(chemins, cible)` : lit tous les fichiers de la liste `chemins` et écrit dans `cible` un **seul** relevé au même format, où chaque article n'apparaît qu'une fois : on garde la version dont la date est **la plus récente**. À date égale, c'est la version du fichier qui vient **le plus tard** dans la liste qui gagne. Les articles du résultat sont rangés par **nom** (ordre alphabétique). La fonction renvoie le nombre d'articles écrits.

```python
date_en_tuple("12-4-2008")                    # (2008, 4, 12)
fusionner(["mars.json", "avril.json"], "fusion.json")   # 3
```

Avec `mars.json` = pomme à 3.1 le `12-1-2010` et banane à 4.0 le `3-1-2009`, et `avril.json` = pomme à 2.9 le `3-1-2009` et kiwi à 0.5 le `1-2-2010`, la fusion garde la pomme de `mars.json` (2010 est plus récent que 2009), la banane et le kiwi.
