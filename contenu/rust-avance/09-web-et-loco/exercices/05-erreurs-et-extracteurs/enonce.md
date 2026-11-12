Un contrôleur lit l'identifiant dans l'URL (`/users/42`), cherche l'utilisateur, et répond. Tout peut échouer : l'identifiant peut ne pas être un nombre, l'utilisateur peut ne pas exister. Écris :

1. `impl From<ParseIntError> for ErreurWeb` : donne `Invalide("identifiant invalide")`.
2. `impl TryFrom<&str> for IdUtilisateur` : lit le texte comme un `u32` (un « extracteur » qui peut refuser).
3. `impl From<ErreurWeb> for Reponse` : `Introuvable` donne `404` + `introuvable`, `Invalide(m)` donne `400` + `m`.
4. `afficher_utilisateur(texte, base)` : renvoie `Ok(Reponse 200, "utilisateur <nom>")`, ou une erreur. Utilise `?`.
5. `repondre(resultat)` : transforme n'importe quel `Result<Reponse, ErreurWeb>` en `Reponse`.

| Appel | Réponse |
|---|---|
| `/users/1` (Alice) | `200` `utilisateur Alice` |
| `/users/9` | `404` `introuvable` |
| `/users/abc` | `400` `identifiant invalide` |
