# Progression enregistrée sur hermes

## Pourquoi

Antoine fait maintenant ses exercices et quiz sur `http://hermes/esgi-entrainement/`. Les quiz envoyés par Hermes Agent (tâche « Quiz ESGI (8h / 20h) », script `~/.hermes/scripts/esgi-quiz.py`) doivent se baser **uniquement** sur l'avancement réel fait sur ce site.

Aujourd'hui la progression n'existe que dans le `localStorage` du navigateur. Le script des quiz lit un export manuel (`~/dev/esgi-entrainement/esgi-entrainement-*.json`, dernier : 24/11/2026) et ne voit rien de ce qui a été fait depuis.

## Objectifs

- Le site enregistre **toute** la progression (exercices, quiz, parties de quiz en cours, saisies, code, affichages) dans un fichier sur hermes, à chaque changement.
- Le script des quiz lit ce fichier et rien d'autre.
- Plusieurs appareils (PC, téléphone) partagent la même progression. On garde toujours le meilleur des deux : un exercice réussi reste réussi, et on garde le meilleur score de quiz.

## Hors sujet

- Aucun compte ni mot de passe : une seule personne utilise hermes (réseau Tailscale).
- Le thème, le menu rangé et la matière choisie restent propres à chaque appareil.
- Rien ne change pour la version locale (`npm start` sur le PC) ni pour les camarades de classe : la fonction n'est active que si le serveur est lancé avec `ESGI_PROGRESSION`.

## À éviter absolument

- Perdre de la progression : un envoi raté doit être retenté, jamais oublié.
- Faire revenir un exercice qu'on a remis à zéro (« ↺ Recommencer l'exercice »).
- Baisser un score ou repasser un exercice réussi en raté parce qu'un autre appareil avait une version plus ancienne.
- Bloquer le site si l'enregistrement sur hermes échoue : on continue avec le navigateur.

## Façons de faire envisagées

- **A (choisie)** : le serveur garde `~/.local/share/esgi-entrainement/progression.json` (hors du dépôt), la page l'envoie et le relit par `/api/progression`, et le script des quiz lit ce fichier.
- B : écrire un faux export dans le dossier du projet. Écartée, car le fichier vivrait dans le dossier git et serait exposé aux mises à jour.
- C : le script interroge le site en direct. Écartée, car il faudrait ouvrir une porte dans la protection par jeton, et le quiz échouerait si le site est arrêté.

## Conception

### Serveur (`esgi-entrainement`)

- Variable d'environnement `ESGI_PROGRESSION=<chemin du fichier>`. Le service hermes (`scripts/hermes/esgi-entrainement.service`) la règle à `%h/.local/share/esgi-entrainement/progression.json`. `installer.sh` crée le dossier.
- Format du fichier, le même que l'export : `{ format: "esgi-entrainement", version: 1, modifieLe: <ISO>, progression: { exercices, quiz, saisies, codes, partiesQuiz, affichages } }`.
- `GET /api/progression` (garde `lecture`) : `{ active: false }` sans variable ; sinon `{ active: true, progression }` (vide si le fichier n'existe pas encore).
- `POST /api/progression` (garde `ecriture`, celle du jeton) : corps `{ changements: [{ partie, cle, valeur, faitLe }] }`, où `faitLe` est l'heure du changement sur l'appareil (millisecondes). `partie` doit faire partie des six ci-dessus, sinon 400. Le fichier garde aussi `dates` (`"<partie>/<cle>"` → `faitLe` du dernier changement retenu) et `supprimes` (même clé → `faitLe` de la remise à zéro). Chaque changement est appliqué ainsi :
  - `valeur: null` : la clé est supprimée et sa date est notée dans `supprimes` (remise à zéro d'un exercice) ;
  - un changement plus ancien qu'une remise à zéro de la même clé est ignoré, pour qu'un exercice remis à zéro ne revienne jamais depuis un appareil resté ouvert ou hors ligne ;
  - `exercices` : `essais` = le plus grand des deux, `reussi` = vrai si l'un des deux l'est ;
  - `quiz` : on garde le meilleur rapport `score / total` ;
  - les autres parties : le changement le plus récent (`faitLe`) gagne.
- La réponse du `POST` renvoie les valeurs retenues pour les clés envoyées, et la page les recopie chez elle.
- `GET` indique aussi si le fichier existe (`existe: true/false`).
- Écriture par `ecrireJson` (`serveur/commun/json.js` : fichier temporaire puis renommage, écritures en file). La lecture, la fusion et l'écriture d'une requête se font sans qu'une autre requête s'intercale.
- Limite du corps : celle du serveur (512 Kio). La progression actuelle fait environ 50 Kio.

### Page (`js/stockage.js` et un module de synchronisation)

- Le serveur est la référence. Chaque changement fait par `modifier()` sur une des six parties note les clés touchées. Après l'écriture dans le `localStorage`, la page envoie leurs valeurs finales (regroupées, même délai de 300 ms, ou tout de suite pour une réussite ou un score). Pour un exercice, elle envoie la valeur entière `{ essais, reussi }`, jamais un « +1 » : renvoyer deux fois ne change rien.
- Les changements pas encore confirmés par le serveur sont gardés dans le `localStorage` (liste « en attente »). Ils sont renvoyés au prochain changement, au prochain chargement, et quand la page se cache (`pagehide` / `visibilitychange`, par `fetch` avec `keepalive`).
- À l'ouverture, et chaque fois que la page redevient visible : `GET /api/progression`. Si elle est active, les six parties locales sont **remplacées** par celles du serveur, puis les changements en attente sont réappliqués par-dessus et envoyés.
- Première synchronisation d'un appareil (marque `synchronise` absente de son `localStorage`), que le fichier existe ou non : tout son contenu local des six parties est d'abord envoyé comme changements avec les règles du « meilleur des deux ». Rien de ce que cet appareil avait n'est perdu. Ensuite l'appareil note `synchronise` et suit la règle normale.
- « Tout importer » ajoute avec les règles du « meilleur des deux » : il n'efface rien sur hermes. Importer un vieil export ne détruit donc pas le travail plus récent. *(choix du concepteur)*
- « Remettre ma progression à zéro » vide les six parties sur hermes, pour tous les appareils et pour les quiz (un `null` par clé). *(choix du concepteur)*
- Jeton périmé (le serveur a redémarré après un déploiement, réponse 403) : la page recharge en silence `./` pour recevoir le nouveau cookie, puis renvoie une fois. *(choix du concepteur)*
- Plusieurs onglets : l'événement `storage` existant recharge l'état, et la liste en attente est partagée par le `localStorage`.
- Si le serveur ne répond pas ou refuse : le site continue normalement. Une notification discrète (`js/notification.js`) s'affiche une fois, et la liste en attente est gardée.

### Script des quiz (`~/.hermes/scripts/esgi-quiz.py` sur hermes)

- Il lit seulement `~/.local/share/esgi-entrainement/progression.json` (chemin modifiable par `ESGI_QUIZ_PROGRESSION`, pour les essais).
- Il ne lit plus les exports `esgi-entrainement-*.json` et ne prend plus les chapitres « non fondamentaux » quand il n'y a rien.
- Les règles restent les mêmes : un chapitre compte s'il a une entrée `quiz` ou au moins un exercice `reussi: true` ; `anglais` est toujours autorisé ; `electif` jamais.
- Fichier absent ou vide : aucune matière travaillée, donc seulement `anglais`. La ligne `AVANCEMENT` le dit.
- La ligne `AVANCEMENT` indique « progression du site hermes du <modifieLe> ».
- Le script reste un fichier de Hermes Agent, hors dépôt. Il est modifié directement sur hermes par SSH (copie `esgi-quiz.py.bak-2026-11-25` avant), et testé par des essais à blanc, pas par `node:test`. Il n'est basculé qu'après le déploiement du site et un premier remplissage du fichier.
- Pas de remplissage à partir d'un export. Antoine a déjà importé son avancement dans le site hermes, donc il est dans le `localStorage` de son navigateur pour `http://hermes/`. La première synchronisation de ce navigateur remplit le fichier. Ensuite, les exports `~/dev/esgi-entrainement/esgi-entrainement-2026-11-23.json` et `esgi-entrainement-2026-11-24.json` sont mis à la corbeille (`gio trash`), à sa demande.
- Le besoin d'Antoine : un chapitre travaillé sur le site hermes entre tout seul dans les quiz suivants, sans export manuel. Le script relit le fichier à chaque tirage (8 h et 20 h).
- Mise à jour de `~/.hermes/skills/productivity/study-revision-quizzes/references/esgi-quiz-setup.md` (section « Only chapters the user has already worked on »). Copie de sauvegarde du script avant modification. Essai à blanc avec `ESGI_QUIZ_ETAT` sur un fichier temporaire, pour ne pas décaler la vraie rotation.

## Conflits vérifiés

- Déploiement (`scripts/deployer.mjs` : `git stash`, `pull --ff-only`) : le fichier est hors du dépôt, il n'est pas touché.
- Programmes des élèves (bwrap) : `/home` est remplacé par un dossier vide, ils ne voient pas le fichier.
- Tâche de quiz à 8 h / 20 h pendant une écriture : le renommage atomique fait qu'elle lit toujours un fichier complet.
- Version locale et camarades : sans `ESGI_PROGRESSION`, `GET` répond `active: false` et la page ne change rien.

## Laissé au constructeur

- Le nom et le découpage du module de synchronisation côté page.
- Les tests (`node:test`) : fusion côté serveur, routes, synchronisation de la page avec un faux `fetch` et un faux `localStorage` (liste en attente, remplacement à l'ouverture, remise à zéro qui ne revient pas).
