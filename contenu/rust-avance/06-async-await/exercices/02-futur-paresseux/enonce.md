Dans ce programme, les futures sont créés, mais **jamais exécutés**. Corrige `main` pour obtenir exactement cette sortie :

```text
futur créé
préparation de Ada
Bonjour Ada
bloc créé
bloc async lancé
réponse : 42
```

Remarque l'ordre : « préparation de Ada » ne s'affiche **qu'après** « futur créé », car le code d'une `async fn` ne démarre qu'au moment où on l'exécute.

> [!tip] Ce qu'il faut modifier
> Seulement deux lignes dans `main` : celles qui fabriquent `message` et `reponse`.
