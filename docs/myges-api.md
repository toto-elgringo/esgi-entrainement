# Récupérer les supports de cours sur MyGES

Résultat de l'exploration du 9/11/2026. Les exemples sont inventés.

## L'API mobile ne suffit pas

- `GET https://api.kordis.fr/me/years` (jeton Kordis) renvoie les années, par exemple `[2026]`.
- `GET /me/{année}/courses` renvoie les cours avec `name`, `rc_id`, `trimester` et `has_documents`, mais aucun lien vers les fichiers.
- Aucune adresse de l'API ne donne la liste des supports (`/me/{année}/files` répond « Vous n'avez pas accès à cette ressource »).

On passe donc par le site web `myges.fr`, comme un navigateur.

## Connexion au site (CAS)

1. `GET https://myges.fr/student/courses-files` → redirection vers `https://ges-cas.kordis.fr/login?service=…`.
2. La page de connexion contient un `<form>` avec les champs `username`, `password`, `lt`, `execution`, `_eventId`, `submit`. On reprend les champs cachés tels quels, on remplit `username` et `password`, et on envoie le formulaire en `POST` (`application/x-www-form-urlencoded`) vers son `action` (de la forme `/login;jsessionid=…`).
3. Identifiants refusés : la réponse est la page de connexion (200) au lieu d'une redirection.
4. Identifiants acceptés : suite de redirections `ges-cas.kordis.fr` → `myges.fr/j_spring_cas_security_check` → `myges.fr/student/home`. Les cookies sont posés sur chaque domaine : il faut les garder **par domaine** et suivre les redirections à la main (`redirect: 'manual'`).

## Liste des supports

`GET https://myges.fr/student/courses-files` (avec les cookies) renvoie une page HTML qui contient déjà tous les fichiers, même dans les menus repliés.

- Période affichée : le `<select id="coursesFilesForm:…:periodSelect_input">`. L'option `selected` est la période en cours, par exemple `2026-2027 - ESGI - … - Semestre 1`. C'est la seule qu'on lit.
- Une matière = un `<h3 class="ui-accordion-header …">` qui contient :

  ```html
  <div class="mg_inherit_color">
      T1 - exemple de matière  <span …>M. PROF</span>  <span …>3 fichier(s)</span>
  </div>
  ```

  Le préfixe (`T1 - `, `We1 - `) dépend de la période : on le retire pour reconnaître la matière.
- Les fichiers sont les `<tr data-ri="…">` du tableau qui suit le `<h3>`, jusqu'au `<h3>` suivant :

  ```html
  <td role="gridcell" style="width:165px;">13/10/2026 10h17</td>
  <td role="gridcell"><img … src="/public/images/mimetypes/pdf.png?…" …/><a href="" onclick="window.open('https://ges-dl.kordis.fr/private/AbCdEf123'); return false;" …>
      Nom du document
  </a></td>
  ```

  - date d'ajout : `JJ/MM/AAAA HHhMM` ;
  - type : `pdf`, `docx` ou `default` (zip, archives…) ;
  - nom affiché : sans extension, entités HTML à décoder (`&amp;`) ;
  - adresse de téléchargement : `https://ges-dl.kordis.fr/private/<identifiant>`. L'identifiant sert d'identifiant du document.
- Une matière sans fichier n'a pas de tableau.

## Téléchargement

`GET https://ges-dl.kordis.fr/private/<identifiant>` avec les cookies : redirection vers `ges-cas.kordis.fr/login` (la session CAS donne le ticket sans redemander le mot de passe), puis `ges-dl.kordis.fr/j_spring_cas_security_check`, puis le fichier (200). Une étape passe par `http://` puis revient en `https://`.

En-têtes utiles de la réponse :

- `Content-Disposition: attachment; filename="Nom du document.pdf"` : vrai nom avec l'extension ;
- `Content-Type` ;
- `Content-Length` ;
- `Last-Modified` : sert à repérer un document mis à jour.
