# Synchro Schooding

Schooding (`https://www.schooding.fr`) est la plateforme d'exercices de Scripting Python et d'Algorithmique avancée. C'est un site Django : tout passe par des pages HTML, sans API publique. Il faut être connecté pour voir quoi que ce soit.

## Connexion

1. `GET /accounts/login/?next=/` : donne le cookie `csrftoken` et le champ caché `csrfmiddlewaretoken`.
2. `POST /login/` (formulaire) : `csrfmiddlewaretoken`, `username` (le **login** Schooding, pas l'e-mail), `password`, `next`. Les en-têtes `Referer` et `Origin` sont obligatoires (contrôle CSRF de Django).
3. Réussite : redirection vers `/home/` avec le cookie `sessionid`. Échec : la page de connexion revient.

Le site limite le nombre de requêtes (nginx répond `429` après une vingtaine de requêtes rapides) : une pause d'1 s entre deux pages, puis 5 s, 15 s, 30 s et 60 s d'attente en cas de `429`.

## Pages lues

| Page | Contenu |
|---|---|
| `/home/` | menu `#navStudentCourseDrop` : un lien `/course/<id>/` par cours |
| `/course/<id>/` | liste des séances (`a.session[data-session]`, `#N : titre`). Après le titre « Examens passés » : les QCM déjà faits |
| `/session/<id>/` | description, documents (`generateDocBox(…, [{ id, title }])`), cartes « Exercices » et « Devoirs Maison » (liens `/codingtest/<id>/?next=…`, lien « Solution » pour les exercices de cours). Une séance verrouillée affiche une icône `lock` |
| `/codingtest/<id>/` | énoncé (`#wording`), outils fournis (`generateDoc({...})`), mon code (`initCodingTestIDE(taille, thème, "code", "mode")`), historique (`addHistory(id, date, progression, langage)`) |
| `/codingtest/solution/exocourse/<exo>/<cours>/` | solution officielle, même appel `initCodingTestIDE` |
| `/lastresult/<élève>/<exo>` | correction d'un QCM : chaque choix est vert (`success`) si mon choix était juste, rouge (`danger`) sinon. Bonne réponse = cochée et verte, ou non cochée et rouge |
| `/documents/show/<id>/` | redirige vers le document : vidéo YouTube (`youtube.com/embed/…`), slides Google publiées (`docs.google.com/presentation/d/e/…/embed`), ou page Markdown du site (`md_update("…")`) |

Les textes multilingues s'écrivent `défaut$TR$fr texte français` : on garde la version `fr`, sinon le texte par défaut.

Les slides Google publiées ne s'exportent pas en PDF, mais la page `embed` contient le SVG de chaque diapo (`SK_svgData = '…'`). Le texte de chaque forme est dans les attributs `aria-label` du SVG.

À éviter : `/examen/fake/<séance>/` (« Tester en mode exam ») et `/exercice/reinit/` (efface le code), qui modifient le compte. `/user/language/<langue>` change la langue du compte.

## Ce qui est écrit dans le vault

`<Matière>/Sources/Schooding/` (matière trouvée avec `schooding-matieres.json`) :

- `NN - Titre de la séance/Séance.md` : description et liste des documents et exercices ;
- `…/Documents/NN - Titre.md` (Markdown du site, vidéo YouTube : lien, et la vidéo `.mp4` si `yt-dlp` est installé), `…/Documents/NN - Titre/` (slides : un `.md` avec le texte de chaque diapo et un `diapo-NNN.svg` par diapo), ou le fichier lui-même (PDF…) ;
- `…/Exercices/NN - Titre.md` et `…/Devoirs Maison/NN - Titre.md` : énoncé, outils, mon code (ou le code de départ), mon avancement, solution officielle ;
- `Examens/Séance - QCM.md` : questions, bonnes réponses `[x]`, mes erreurs `✘`.

Vidéos : `yt-dlp` avec ses composants (`py -m pip install --user "yt-dlp[default]"`) et Node comme moteur JavaScript (`--js-runtimes node:<chemin>`), sans quoi YouTube ne donne aucun format complet. Sans `ffmpeg`, seul le format 360p (image + son dans un seul fichier) est disponible ; avec `ffmpeg`, la vidéo 720p et le son sont assemblés.

## Suivi (`schooding-suivi.json`, non versionné)

Une entrée par élément (`seance-<id>`, `doc-<id>`, `exo-<id>`, `qcm-<élève>-<exo>`) : chemin, empreinte du contenu et indice.

- Documents : téléchargés une seule fois. Une vidéo gardée en lien est retéléchargée dès que `yt-dlp` est installé.
- Exercices et QCM : l'indice est l'état affiché dans la séance (classe et icône de l'exercice, score du QCM). La page n'est relue que si cet état change ; le fichier n'est réécrit et redonné à Claude que si son contenu a changé.
- Séances verrouillées : ignorées, récupérées à la synchro suivante une fois débloquées.

Ensuite, comme pour MyGES : `schooding-a-integrer.json`, Claude lancé avec `/obsidian -esgi` et la liste des fichiers, reprise automatique (tronc commun `serveur/synchro.js`). Une seule intégration Claude tourne à la fois : la seconde synchro attend la fin de la première.
