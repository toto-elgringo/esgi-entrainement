Le programme suit la vie d'une valeur partagée avec `Rc` et `Weak`.

Écris la fonction `comptes` : elle renvoie le nombre de propriétaires (références **fortes**) et le nombre de références **faibles** d'un `Rc`.

La sortie attendue est :

```text
forts : 1, faibles : 0
forts : 2, faibles : 1
forts : 1, faibles : 1
valeur : Some(5)
valeur : None
```

Avant de lancer, essaie de deviner pourquoi les nombres changent à chaque étape (un `clone`, un `downgrade`, un `drop`).

> [!info] Pourquoi `None` à la fin ?
> La valeur est libérée quand le dernier propriétaire (compteur fort) disparaît. Les références faibles ne la gardent pas en vie : `upgrade()` renvoie alors `None`.
