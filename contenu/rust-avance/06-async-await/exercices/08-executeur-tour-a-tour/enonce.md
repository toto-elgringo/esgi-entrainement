Trois tâches (`A`, `B`, `C`) ont respectivement 2, 1 et 3 étapes à faire. Chaque étape est un `poll` qui affiche un message puis répond `Pending`. La fonction `executer_tout` est à écrire : c'est le cœur d'un **exécuteur** qui fait avancer toutes les tâches **à tour de rôle**, dans un seul fil.

Principe : tant qu'il reste des tâches, on les interroge une par une dans l'ordre ; celles qui répondent `Ready` sont retirées.

La sortie doit être **exactement** :

```text
A : étape 1/2
B : étape 1/1
C : étape 1/3
A : étape 2/2
B terminée
C : étape 2/3
A terminée
C : étape 3/3
C terminée
toutes les tâches sont terminées
```

> [!tip] Concurrence sans thread
> Les tâches avancent en alternance, mais jamais en même temps : c'est de la concurrence, pas du parallélisme.
