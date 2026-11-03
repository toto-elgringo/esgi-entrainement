# Synchronisation avec MyGES — design

Date : 2026-11-03

## Intention

Les supports de cours de l'ESGI sont publiés sur MyGES (`https://myges.fr/student/courses-files`). Aujourd'hui, Antoine les télécharge à la main, les range dans son vault Obsidian (`Cours - ESGI\<Matière>\Sources\`), puis lance `/obsidian -esgi` pour créer les notes Obsidian et les cours / quiz / exercices du site.

Le but : **un bouton « Synchroniser avec MyGES » sur le site** qui fait tout ça seul. Il récupère les nouveaux supports, les range dans le vault, puis lance Claude en arrière-plan avec `/obsidian -esgi`. Chaque nouveau document est ainsi tracé dans Obsidian et donne des exercices pour s'entraîner.

## Objectifs

- Deux clics suffisent (« Synchroniser » puis « Valider » l'aperçu) : connexion à MyGES, repérage des nouveaux supports, téléchargement dans le bon dossier `Sources\` du vault, puis lancement de `/obsidian -esgi` par Claude en arrière-plan.
- Une matière présente sur MyGES mais absente du vault est créée automatiquement : son dossier, plus son dossier `Sources\`. Le reste (hub de la matière, domaine du site) est déjà géré par `/obsidian -esgi`.
- La page montre l'avancement : connexion, documents trouvés et téléchargés, Claude au travail, bilan final. On peut fermer la page puis revenir, le suivi reprend.
- Les identifiants MyGES restent sur l'ordinateur, dans un fichier `.env` non versionné. Ils ne passent jamais par la page ni par Claude.

## Hors sujet

- Pas de synchronisation automatique planifiée : seul le bouton la déclenche.
- Ni commit ni push : `/obsidian -esgi` ne les fait déjà pas.
- Pas d'autres données MyGES (notes, planning, absences).
- Pas de suppression : un document retiré de MyGES reste dans le vault.

## Ce qui serait un échec même si « ça marche »

- Un mot de passe, un jeton ou un support de cours se retrouve dans le dépôt public (versionné ou servi par le site).
- Une autre page web ouverte dans le navigateur peut déclencher la synchro, ou lire le `.env` à travers le serveur local.
- Les supports déjà présents dans le vault sont retéléchargés en double, et Claude refait du contenu qui existe déjà.
- Un document est rangé dans la mauvaise matière sans que personne s'en aperçoive.

## Contraintes

- Celles du projet (`CLAUDE.md`) : Node 20+, **aucune dépendance npm**, modules ES, code et textes en français, pas de commentaires, tests `node:test` écrits au fur et à mesure.
- Serveur local seulement (`127.0.0.1`), comme aujourd'hui.
- Windows 11. Claude Code est installé (`claude` dans le PATH).
- Vault : `C:\Users\totoa\Obsidian\Claude Note\Cours - ESGI\`. Chemin modifiable par la variable `ESGI_DOSSIER`, comme dans `~/.claude/scripts/esgi-sources.mjs`.

## Décisions prises avec Antoine

1. **Déclencheur** : un bouton sur le site, rien de planifié.
2. **Après le téléchargement** : s'il y a au moins un nouveau document, le serveur lance Claude en arrière-plan avec `/obsidian -esgi`, qui crée les notes Obsidian et les exercices du site.
3. **Matière inconnue** : on la crée dans le vault.
4. **Connexion** : identifiant + mot de passe MyGES (pas de connexion Google), saisis une fois par Antoine dans `.env`.
5. **Rien n'est supprimé**, ni commité, ni poussé.
6. Le règlement de l'école autorise ce téléchargement.
7. **Aperçu à valider à chaque synchro** : le bouton se connecte et liste ce qui sera fait (documents à télécharger, matières à créer, supports du vault encore non traités par Claude). Rien n'est téléchargé ni lancé avant le clic sur « Valider ».
8. **Seulement l'année scolaire en cours**, trouvée automatiquement (l'année MyGES la plus récente qui contient des cours). Les années précédentes sont ignorées.

## Comment ça marche

### Connexion à MyGES

D'après la documentation non officielle ([myges-documentation](https://github.com/SebPautot/myges-documentation)) :

- `GET https://authentication.kordis.fr/oauth/authorize?response_type=token&client_id=skolae-app` avec l'en-tête `Authorization: Basic base64(identifiant:motdepasse)`.
- La réponse est une redirection : le jeton est `access_token` dans la partie après `#` de l'adresse de redirection (`comreseaugesskolae:/oauth2redirect#...`). Ne pas suivre la redirection, lire l'en-tête `Location`.
- Les appels suivants vers `https://api.kordis.fr/...` portent `Authorization: bearer <jeton>`.

**Inconnue** : aucune source publique ne décrit comment lister les supports de cours ni les télécharger. La première étape du plan est donc une **exploration** avec le vrai compte : un script local, qui lit `.env` et n'affiche jamais les identifiants ni le jeton, parcourt les liens renvoyés par l'API (par exemple `/me/{année}/courses` ou les liens `links` des réponses) jusqu'à trouver la liste des fichiers par matière et leur adresse de téléchargement. Si l'API ne donne pas accès aux supports, on passe au plan B : se connecter au site web `myges.fr` (formulaire de connexion, cookies de session) et lire la page `student/courses-files`. Le reste du design ne change pas : seul le module « source MyGES » change.

Le résultat de l'exploration (les adresses et la forme des réponses) est noté dans `CONTENU.md` ou un court document, **sans aucune donnée personnelle**.

Mes choix pour l'exploration :
- Claude lance lui-même le script d'exploration. Ce script masque les champs personnels (nom, e-mail, identifiants d'élève, notes) et n'affiche que la forme des réponses, les noms des matières et ceux des fichiers.
- Le plan B fait partie du même plan. Si ni l'API ni le site web ne donnent accès aux supports, on s'arrête et on revient vers Antoine.

### Identifiants

- Fichier `.env` à la racine du projet, avec `MYGES_IDENTIFIANT=...` et `MYGES_MOT_DE_PASSE=...`. Il est ajouté au `.gitignore`, et un `.env.exemple` vide est versionné.
- Le serveur lit `.env` lui-même (petit lecteur maison, sans dépendance).
- `.env` absent ou incomplet : le bouton reste visible et affiche comment le remplir.

### Ce qui est « nouveau »

- Fichier de suivi `myges-suivi.json` à la racine du projet, non versionné : pour chaque document MyGES (identifié par son identifiant MyGES, sinon par matière + nom), le chemin où il a été rangé et sa date de téléchargement.
- Un document est nouveau s'il n'est pas dans le suivi **et** qu'aucun fichier du même nom n'existe déjà dans le `Sources\` de la matière. La comparaison des noms ignore la casse, les accents et les espaces en trop. Elle considère comme identiques `[Slides] X` et `Slides - X` (même mot, deux écritures). Elle ne retire **jamais** le mot lui-même : `Slides - Ownership` et `Support - Ownership` restent deux documents différents.
- **Premier lancement** : les supports déjà rangés à la main sont reconnus par leur nom et ajoutés au suivi sans être retéléchargés. Un document dont le nom diffère trop sera proposé dans l'aperçu : Antoine le voit avant de valider.
- Les fichiers gardent leur nom MyGES (mon choix), nettoyé : caractères interdits sous Windows remplacés, et jamais de `..` ni de chemin en dehors du dossier de la matière.
- Une archive `.zip` est extraite dans un dossier du même nom (sans `.zip`), parce que `/obsidian -esgi` sait lire un dossier de code mais pas une archive (mon choix). L'extraction se fait sans dépendance (PowerShell `Expand-Archive` ou `tar`, présent sur Windows 11) et refuse les chemins qui sortent du dossier.
- **Document mis à jour sur MyGES** (même document, date ou taille différente, si l'API donne cette information) : il est retéléchargé et remplace l'ancien fichier, pour que `/obsidian -esgi` le voie comme « modifié » (mon choix). L'aperçu le signale comme « mis à jour ».

### Supports en attente

- L'aperçu appelle aussi `node ~/.claude/scripts/esgi-sources.mjs etat` : les supports déjà dans le vault mais jamais traités par Claude (par exemple après une synchro arrêtée ou ratée) sont listés comme « en attente ».
- Claude est lancé à la validation s'il y a au moins un document à télécharger **ou** un support en attente (mon choix). Rien de tout ça : « Tout est à jour ».

### Correspondance des matières

- Fichier versionné `myges-matieres.json` : nom de la matière sur MyGES → nom du dossier dans le vault, par exemple `"Programmation Rust": "Rust"`. Il est rempli au départ avec les huit matières actuelles, une fois les noms MyGES connus grâce à l'exploration.
- Matière MyGES absente du fichier : on crée un dossier au nom MyGES nettoyé, on l'ajoute au fichier, et le bilan le signale (« nouvelle matière : X »).

### Lancement de Claude

- Commande : `claude -p "/obsidian -esgi" --add-dir "<vault>" --permission-mode bypassPermissions --output-format stream-json --verbose`, lancée depuis le dossier du projet.
- `bypassPermissions` (Claude écrit sans demander) ne sert que pour ce lancement-là, jamais pour le reste du projet. C'est accepté par Antoine.
- Pas de limite de 10 s comme pour les exercices : la synchro peut durer longtemps (plusieurs dizaines de minutes). On garde quand même une limite haute (2 h, mon choix).
- La sortie de Claude est enregistrée dans un journal (dans le dossier temporaire du système). Les messages « assistant » du flux servent à montrer l'avancement. Le bilan final de `/obsidian -esgi` est affiché à la fin.
- Commande remplaçable par la variable `ESGI_CLAUDE`, pour les tests (faux Claude).

### API du serveur

- `POST /api/myges/synchroniser` : se connecte et prépare l'aperçu, sans rien télécharger. Si une synchro est déjà en cours, elle n'en lance pas une deuxième et renvoie l'état actuel.
- `POST /api/myges/valider` : lance le téléchargement de ce qui est dans l'aperçu, puis Claude. Refusé s'il n'y a pas d'aperçu prêt.
- `GET /api/myges/etat` : renvoie l'état de la synchro, en cours ou dernière terminée : étape (`connexion`, `liste`, `apercu`, `telechargement`, `claude`, `terminee`, `erreur`), contenu de l'aperçu (documents nouveaux ou mis à jour par matière, matières à créer, supports en attente), dernières lignes de Claude, bilan, erreur éventuelle, heures de début et de fin.
- `POST /api/myges/arreter` : arrête Claude ou le téléchargement en cours. Les documents déjà téléchargés restent.
- L'état est gardé en mémoire par le serveur. La page interroge `etat` toutes les 2 s pendant une synchro et au chargement : fermer puis rouvrir la page reprend l'affichage.

### Sécurité du serveur local

- **Pas de déclenchement par un autre site** : les routes `myges` refusent toute requête dont l'en-tête `Origin` (ou, à défaut, `Host`) n'est pas `localhost:<port>` ou `127.0.0.1:<port>`. Elles n'acceptent que du JSON (`Content-Type: application/json`).
- **Fichiers cachés jamais servis** : le serveur de fichiers refuse tout chemin dont un morceau commence par `.` (`.env`, `.git`…), et aussi les fichiers de suivi (`myges-suivi.json`, `synchro-obsidian.json`).
- Les messages d'erreur ne contiennent jamais l'identifiant, le mot de passe ni le jeton.

### Interface

- Encadré « MyGES » sur la page de choix de la matière, à côté de « Sauvegarde », dans le même style (mon choix).
- Bouton « Synchroniser avec MyGES ». Puis l'aperçu : documents nouveaux ou mis à jour par matière, matières à créer, supports en attente, et les boutons « Valider » / « Annuler ».
- Après validation : étape en cours, dernières lignes de Claude et bouton « Arrêter ».
- À la fin : bilan (documents ajoutés, matières créées, résumé de Claude). Rien de nouveau : « Tout est à jour ».
- Erreurs expliquées simplement : identifiants manquants ou refusés, MyGES injoignable, `claude` introuvable, serveur arrêté.
- Une fois Claude terminé, la page propose de recharger pour voir les nouveaux chapitres.

## Tests

- Lecture de `.env`, normalisation et nettoyage des noms, détection des nouveautés (dont le premier lancement), correspondance des matières : tests unitaires.
- Connexion et liste des documents : tests contre un faux serveur MyGES local (`http`), adresses de base modifiables pour les tests.
- Lancement de Claude : faux Claude (`ESGI_CLAUDE` pointe vers un petit script Node qui écrit un flux `stream-json`).
- Routes du serveur : une seule synchro à la fois, `valider` refusé sans aperçu, refus d'un `Origin` étranger, refus de `/.env` et `/.git/...`, arrêt.
- Choix de l'année en cours, extraction des `.zip` (dont le refus des chemins qui sortent du dossier), document mis à jour, supports en attente.
- Aucun test n'appelle le vrai MyGES ni le vrai Claude.

## Laissé au constructeur

- Le découpage en modules (par exemple `serveur/myges/connexion.js`, `source.js`, `synchro.js`, `claude.js`) et le format exact de `myges-suivi.json`.
- Le détail de la normalisation des noms.
- Le texte exact de l'interface, dans le ton du site.
- La mise à jour de `README.md`, `CLAUDE.md`, `TODO.md` et `.gitignore` (`.env`, `myges-suivi.json`, et aussi `synchro-obsidian.json`, qui n'y est pas encore).
