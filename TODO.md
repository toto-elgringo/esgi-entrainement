# TODO

## Contenu

- [ ] Rust : ajouter les nouveaux chapitres du cours ESGI au fil de l'eau (passer leur `source` à `"cours"`)
- [x] Rust avancé : pointeurs intelligents, concurrence, async, macros, unsafe, Loco (matière `rust-avance`)
- [ ] Rust avancé : exercices avec tokio / rayon si les dépendances externes sont un jour acceptées
- [ ] Maths : séance 6 (PCA) et suivantes, uniquement le contenu des cours
- [ ] Combinatoire : chapitre 3 (théorie des graphes) et trimestre 2 (programmation linéaire, simplexe, PLNE) quand les supports arrivent
- [ ] Combinatoire : transformer en exercices Rust le code de la descente, du recuit et de l'algorithme génétique quand il sera distribué
- [x] Combinatoire : petites animations (recuit, roulette, tournoi) comme dans les slides
- [ ] Animations : en ajouter aux chapitres qui n'en ont pas (maths séries / Lagrange / PCA, Rust structs / enums / collections, Python chaînes, anglais 01-03)
- [ ] Algorithmique avancée : nouvelles séances (arbres, tables de hachage…) au fil du cours (complexité, tableaux, tris, tas, piles et files faits le 18/11/2026)
- [ ] Scripting Python : nouveaux diaporamas et séances Schooding au fil du cours
- [ ] Scripting Python : chapitre « fondamentaux » sur les scripts système (`sys.argv`, `pathlib`, `re`, `subprocess`) ; `csv` et `json` sont dans le chapitre 06
- [ ] Algorithmique avancée : listes doublement chaînées et circulaires
- [x] Schooding : transcriptions YouTube des séances (Algo 04 à 09, vidéo Python « listes en compréhension ») relues et intégrées le 18/11/2026 (récupérées avec `py -m yt_dlp --skip-download --write-auto-subs --sub-langs fr`)
- [ ] Anglais : séances 2 et 4 du semestre (absentes des sources), partie écoute du TOEIC et du mini test Sales (audios non fournis)
- [ ] Cours électif : compléter avec les vrais supports (chapitres 02 à 07 faits d après le chat ; vérifier les noms des champs BD TOPO et des extensions QGIS)
- [x] Explications « bêtes mais complètes » partout (23/11/2026) : `explication` dans chaque question d'exercice, explications de quiz et cours réécrits pas à pas avec « À retenir » (règle dans `CONTENU.md`, « Style des explications »)
- [ ] Rust 06 (enums) : plusieurs anciens blocs du cours sont des extraits qui ne compilent pas seuls avec « Essayer » (et l'inventaire du §5 donne des avertissements)
- [ ] Anglais : réponses acceptées discutables à revoir (`hereunder` au lieu de *hereinafter* dans `02/contrat-vocabulaire`, *in behalf of* dans `03/vocabulaire-mini-test`, *recorded* dans `04/le-courrier`, *up to* pour « jusqu'à » dans `01/vocabulary-review-2`)
- [ ] Rust Advent of Code : ajouter d'autres énigmes (PGCD/PPCM 2023 J8, Dijkstra avec contraintes 2023 J17, formule du lacet 2023 J18, graphes 2024 J23…)

## Site

- [ ] Hermes (relecture du 25/11/2026) : supprimer le dossier `esgi-entrainement-sondes-*` à l'arrêt ; `exit(139)` sous bwrap affiché comme une erreur de segmentation ; vérifier dans `installer.sh` que 3000 n'écoute que sur 127.0.0.1 ; cookie `esgi_jeton_3000` en `Path=/` (envoyé aux autres sites du hub)
- [ ] Linux : les tests « archives » / « téléchargement » de la synchro MyGES échouent (le tar GNU n'ouvre pas les .zip) et « arrête tout l'arbre de processus » échoue sans bwrap (seul le processus est tué). Sans effet sur hermes (synchro désactivée, programmes enfermés par bwrap qui tue tout l'arbre)
- [ ] Hermes : première mise en ligne sur http://hermes/esgi-entrainement/ (Rust installé, essai enfermé, fusion dans main), puis import de l'avancement
- [ ] Supports : ajouter ceux des nouveaux chapitres dans `chapitre.json` (`supports`) au fil du cours

- [x] Exporter / importer sa progression (pour changer d'ordinateur)
- [x] Héberger CodeMirror, KaTeX, marked et highlight.js dans le dépôt (`vendor/`, 19/11/2026)
- [ ] Synchro : essayer une vraie intégration avec la nouvelle liste d'outils de Claude (`OUTILS_AUTORISES_CLAUDE`) et l'ajuster si un outil manque
- [ ] Retirer les `sommaire.json` du dépôt et `npm run sommaire` (le serveur calcule le sommaire) en adaptant `verifier-contenu` et `/obsidian -esgi`
- [ ] Découper les gros fichiers d'animations (`js/animations/code.js` 2 390 lignes…) par chapitre
- [ ] Rust : signer aussi le bilan des tests avec un marqueur (aujourd'hui lu dans la sortie de `cargo test`)
- [ ] Clavier de symboles pour les maths sur téléphone (`^`, `√`, `π`)
- [ ] Anglais : partie écoute avec la synthèse vocale du navigateur (avant le CC Listening du 9/11)
- [ ] Anglais : mode « TOEIC blanc » chronométré qui pioche dans tous les chapitres
- [ ] Anglais : cartes de vocabulaire avec révision espacée pour les 397 mots
- [ ] Bouton « Essayer » du cours : permettre de taper une entrée (`input()`, `scanf`) ; aujourd'hui les exemples Python simulent la saisie avec `io.StringIO`
- [ ] Mélanger l'ordre des choix dans les exercices (aujourd'hui seulement dans les quiz)
- [ ] C : `VERIFIER_LISTE` pour comparer deux tableaux et afficher les valeurs (aujourd'hui `aide_egale` n'affiche que la condition)
- [ ] C : transformer les `VERIFIER` avec `&&` en plusieurs `VERIFIER_EGAL` pour avoir les valeurs de chaque côté
- [ ] MyGES : `/obsidian -esgi` utilise `~/.claude/scripts/esgi-sources.mjs`, qui n'existe plus sur l'ordinateur (la synchro donne quand même la liste des fichiers à Claude)
- [ ] MyGES : retélécharger un support remplacé par le prof (aujourd'hui seul un nouvel identifiant MyGES est vu comme nouveau)
- [ ] MyGES / Schooding : créer `.env.exemple` (bloqué par les réglages de Claude Code : `MYGES_IDENTIFIANT=`, `MYGES_MOT_DE_PASSE=`, `SCHOODING_IDENTIFIANT=` et `SCHOODING_MOT_DE_PASSE=`)
- [x] Schooding : installer `yt-dlp` (`py -m pip install --user "yt-dlp[default]"`, installé le 17/11/2026) pour télécharger les vidéos YouTube des séances
- [ ] Schooding : installer `ffmpeg` (`scoop install ffmpeg`) pour avoir les vidéos en 720p au lieu de 360p
- [ ] Schooding : retélécharger un document modifié par le prof (aujourd'hui un document n'est lu qu'une fois)
