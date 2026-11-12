# Les premières boîtes

Une `Box<T>` range une valeur sur le **tas** et en reste propriétaire. Complète les quatre fonctions.

- `envelopper(n)` : met l'entier dans une boîte.
- `incrementer(boite)` : ajoute 1 à l'entier (la fonction reçoit un `&mut i32` ; avec une boîte, on écrit `incrementer(&mut boite)`).
- `additionner(a, b)` : prend deux références vers des entiers (`&i32`, par exemple `&*boite` pour une boîte) et renvoie une nouvelle boîte contenant la somme.
- `choisir_operation(nom)` : renvoie une fonction rangée dans une `Box<dyn Fn(i32) -> i32>` :
  - `"double"` multiplie par 2 ;
  - `"carre"` élève au carré ;
  - `"oppose"` change le signe ;
  - tout autre nom : `None`.

> [!tip] Astuce
> Une fermeture (`|x| x * 2`) a un type unique. En la mettant dans une `Box<dyn Fn>`, on peut renvoyer des fermetures différentes depuis le même `match`.
