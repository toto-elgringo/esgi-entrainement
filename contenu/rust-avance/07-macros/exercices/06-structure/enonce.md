Écris la macro `structure!` qui définit une structure **et** une méthode d'accès (un *getter*) pour chaque champ.

```text
structure!(Personne {
    nom: String,
    age: u32,
});
```

doit produire :

- la structure `Personne` avec ses champs `nom` et `age` ;
- les méthodes `nom(&self) -> &String` et `age(&self) -> &u32`, qui renvoient une **référence** vers le champ.

La macro doit accepter n'importe quel nom de structure, de champs et de types, et une virgule finale.

> [!tip] Générer des noms
> `$champ:ident` sert à la fois de nom de champ et de nom de méthode. C'est ce qu'une fonction ne peut pas faire.
