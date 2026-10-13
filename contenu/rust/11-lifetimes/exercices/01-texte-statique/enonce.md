La fonction `message_erreur(code)` doit renvoyer un message selon un code HTTP :

| Code | Message |
|---|---|
| 200 | `"ok"` |
| 404 | `"page introuvable"` |
| 500 | `"erreur du serveur"` |
| tout le reste | `"code inconnu"` |

Le code **ne compile pas** (erreur E0106) : la fonction renvoie une référence, mais n'a aucun paramètre référence. Le compilateur ne sait pas combien de temps le texte renvoyé reste valable.

1. Corrige la signature.
2. Remplace `todo!()` par un `match`.

> [!tip] Rappel
> Un texte écrit dans le code, comme `"ok"`, existe pendant **tout** le programme.
