Écris deux fonctions :

**`statistiques(chemin)`** renvoie un dictionnaire avec ces clés :

| Clé | Ce qu'on compte |
|---|---|
| `lignes` | les lignes du fichier (une dernière ligne sans `\n` compte aussi) |
| `mots` | les mots, c'est-à-dire les morceaux séparés par des blancs (espaces, tabulations, retours à la ligne) |
| `mots_lettres` | les mots faits **uniquement** de lettres |
| `mots_chiffres` | les mots faits **uniquement** de chiffres |
| `caracteres` | tous les caractères, espaces et retours à la ligne compris |
| `lettres` | les lettres (accentuées comprises) |
| `minuscules`, `majuscules` | les lettres minuscules, les lettres majuscules |
| `chiffres` | les chiffres |
| `autres` | tout le reste : ni lettre, ni chiffre |

**`rapport(chemin)`** renvoie un texte avec une ligne `clé : valeur` par statistique, dans l'ordre de la liste `ORDRE` donnée dans le code de départ.

Avec un fichier qui contient :

```text
Acheter 12 Œufs
et du lait.
```

```python
statistiques("courses.txt")
# {'lignes': 2, 'mots': 6, 'mots_lettres': 4, 'mots_chiffres': 1, 'caracteres': 28,
#  'lettres': 19, 'minuscules': 17, 'majuscules': 2, 'chiffres': 2, 'autres': 7}

print(rapport("courses.txt"))
# lignes : 2
# mots : 6
# ...
# autres : 7
```

`lait.` n'est pas un mot « uniquement de lettres » à cause du point.
