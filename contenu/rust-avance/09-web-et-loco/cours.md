# Web et Loco

## 1. Pourquoi un framework ?

Un serveur web reçoit une **requête** (`GET /users/42`) et renvoie une **réponse** (un code comme 200 ou 404, plus du texte). Tout le reste est du travail répétitif : lire la configuration, parler à la base de données, vérifier qui est connecté, tester.

**Axum** est une bibliothèque pour faire un serveur : routes, extracteurs, réponses. Elle repose sur **Tokio** (l'exécuteur asynchrone) et **Hyper** (le protocole HTTP). Avec Axum seul, c'est à toi de :

- écrire le serveur et lire la configuration ;
- choisir un ORM et écrire les migrations ;
- coder l'authentification, les tests, les tâches de fond.

**Loco** ajoute tout cela avec des **conventions** et des **générateurs** de code. Tu écris la logique métier. C'est « le Rails de Rust », dans la même famille que Django (Python), Laravel (PHP) ou NestJS (TypeScript).

> [!info] Axum ou Loco ?
> - **Axum seul** : un petit service, quelques routes, tu veux tout choisir (exemple : exposer un modèle d'IA derrière une route `/predict`).
> - **Loco** : une vraie application avec base de données, utilisateurs et plusieurs ressources, ou une équipe qui doit retrouver les mêmes conventions.

**Exemple résolu : Axum seul ou Loco pour ces trois projets ?**

On pose la même question à chaque fois : « est-ce qu'il me faut une base, des comptes utilisateurs, plusieurs ressources ? ».

| Projet | Base ? | Comptes ? | Plusieurs ressources ? | Choix |
|---|---|---|---|---|
| Une route `/sante` qui répond `ok` pour la supervision | non | non | non | **Axum seul** : 10 lignes suffisent |
| Un service qui renvoie la météo calculée par un modèle | non | non | une seule route | **Axum seul** |
| Une appli de suivi de capteurs : capteurs, mesures, utilisateurs connectés | oui | oui | oui | **Loco** : base, auth, migrations et tests sont déjà prêts |

Ce qui fait pencher vers Loco, ce n'est pas la vitesse (les deux tournent sur le même Axum, donc à la même vitesse), c'est la quantité de **code répétitif** que tu n'as pas à écrire : config, base, auth, tests.

**À retenir :** Axum = la bibliothèque HTTP, tu branches tout toi-même. Loco = Axum + tout le reste déjà branché, avec des conventions. Petit service : Axum ; vraie appli avec base et utilisateurs : Loco.

## 2. Loco, c'est de l'Axum

Les gestionnaires Loco **sont** des gestionnaires Axum. Loco construit un `Router` Axum au démarrage, y ajoute tes routes et tes middlewares (lus dans le YAML), puis le lance.

| Tu écris (Loco) | C'est en réalité (Axum) |
|---|---|
| `get(list)`, `post(create)` | `axum::routing::get`, `post` |
| `State(ctx)` | l'état partagé du routeur |
| `Path(id)`, `Json(corps)` | les extracteurs d'Axum |
| options `cors:` dans le YAML | une couche `CorsLayer` de tower-http |
| `auth: auth::JWT` | un extracteur Axum |
| `cargo loco start` | `axum::serve(listener, router)` |

> [!tip] Redescendre d'un étage
> Loco ne t'enferme pas : tu peux ajouter n'importe quelle route ou couche Axum dans `after_routes` de `src/app.rs`.

**Exemple résolu : que se passe-t-il quand tu tapes `cargo loco start` ?**

1. Loco lit `config/development.yaml` (port, base, middlewares).
2. Il se connecte à la base avec **SeaORM** (l'ORM : la bibliothèque qui fait le lien entre les structures Rust et les tables SQL).
3. Il appelle tes fonctions `routes()` et construit **un `Router` Axum** avec toutes ces routes.
4. Il ajoute autour du routeur les middlewares activés dans le YAML (CORS, délai maximal…).
5. Il lance le serveur avec `axum::serve`, qui utilise **Tokio** (asynchrone) et **Hyper** (HTTP).

À aucun moment Loco ne remplace Axum ou Tokio : il les **utilise**. C'est pour cela qu'un gestionnaire écrit pour Loco ressemble trait pour trait à un gestionnaire Axum.

**À retenir :** Loco = Axum (HTTP) + SeaORM (base) + conventions. Tout ce que tu sais d'Axum reste vrai dans Loco.

## 3. Structure d'un projet Loco

```bash
cargo install loco sea-orm-cli
loco new --name capteurs-api --db sqlite --bg async --assets none
cargo loco start
```

`--db sqlite` : la base est un simple fichier. `--assets none` : une API JSON, pas de pages web. Le serveur écoute sur `localhost:5150`.

```text
capteurs-api/
├── config/            development.yaml, test.yaml, production.yaml
├── migration/src/     migrations SeaORM, écrites en Rust
├── src/app.rs         routes, workers, tâches, données de départ
├── src/controllers/   gestionnaires (auth.rs fourni)
├── src/models/        logique métier des modèles
├── src/models/_entities/  généré depuis le schéma : ne pas éditer
├── src/views/         forme du JSON renvoyé
├── src/workers/       jobs de fond
├── src/mailers/       e-mails
├── src/tasks/         commandes en ligne de commande
└── tests/             requêtes, modèles, tâches, workers
```

| Commande | Rôle |
|---|---|
| `cargo loco start` | lancer le serveur |
| `cargo loco generate scaffold ...` | table + modèle + contrôleur CRUD + test |
| `cargo loco generate model ...` | table + modèle, sans contrôleur |
| `cargo loco db migrate` | appliquer les migrations |
| `cargo loco routes` | lister toutes les routes |
| `cargo test` | lancer les tests |

Un **scaffold** (« échafaudage ») est un générateur : à partir d'un nom de ressource et de ses champs, il écrit d'un coup la migration (la table), le modèle, le contrôleur avec les routes CRUD (créer, lire, modifier, supprimer) et un test. Tu n'as plus qu'à ajuster.

**Exemple résolu : où va chaque morceau de code ?**

| Ce que tu veux faire | Où ? |
|---|---|
| Changer le port en production | `config/production.yaml` |
| Ajouter une colonne `unite` à la table des capteurs | une nouvelle migration dans `migration/src/`, puis `cargo loco db migrate` |
| Calculer la moyenne des mesures d'un capteur | `src/models/` (logique métier) |
| Choisir les champs envoyés en JSON | `src/views/` |
| Envoyer un e-mail de bienvenue sans faire attendre la réponse | un worker dans `src/workers/` |
| Corriger à la main un fichier de `src/models/_entities/` | **jamais** : il est régénéré depuis le schéma, ta modification serait écrasée |
| Voir toutes les routes de l'appli | `cargo loco routes` |

**À retenir :** config dans `config/`, schéma dans les migrations, logique dans `models/`, HTTP dans `controllers/`, JSON dans `views/`. Ne touche pas à `_entities/` : c'est du code généré.

## 4. Configuration et middlewares

Un fichier YAML par environnement. Les variables d'environnement l'emportent.

```yaml
server:
  port: 5150
  middlewares:
    cors:
      enable: true
      allow_origins: [http://localhost:3000]
    timeout_request: { enable: true, timeout: 5000 }
database:
  uri: sqlite://capteurs-api_development.sqlite?mode=rwc
  auto_migrate: true
```

Le CORS (qui a le droit d'appeler l'API depuis un navigateur), le délai maximal ou la taille maximale d'un corps se règlent donc **dans la config**, au lieu d'être câblés en Rust. Certains middlewares sont actifs par défaut : journaux, identifiant de requête, rattrapage des paniques.

Un **middleware** est un morceau de code qui passe sur **chaque** requête avant (et après) ton gestionnaire : vérifier l'origine, couper une requête trop longue, écrire un journal. On verra plus bas comment l'écrire en Rust simple.

**Exemple résolu : quel fichier lit Loco, et quelle valeur garde-t-il ?**

Loco choisit le fichier d'après l'environnement : `development.yaml` en local (par défaut), `test.yaml` pendant `cargo test`, `production.yaml` en production. Dans un fichier, une valeur peut venir d'une variable d'environnement :

```yaml
database:
  uri: {{ get_env(name="DATABASE_URL", default="sqlite://capteurs-api_development.sqlite?mode=rwc") }}
```

| Situation | Valeur utilisée |
|---|---|
| `DATABASE_URL` n'existe pas | la valeur `default`, le fichier SQLite local |
| `DATABASE_URL=postgres://serveur/capteurs` sur le serveur | l'adresse PostgreSQL : la variable l'emporte |

Ainsi, le même code part en production sans modifier une ligne de Rust ni écrire de mot de passe dans le dépôt.

**À retenir :** un YAML par environnement dans `config/` ; port, base, CORS, délais s'y règlent ; une variable d'environnement passe avant la valeur écrite dans le fichier.

## 5. Routes et contrôleurs

```text
pub fn routes() -> Routes {
    Routes::new()
        .prefix("/api")
        .add("/capteurs/{id}/mesures", post(ajouter))
        .add("/capteurs/{id}/stats", get(stats_capteur))
        .add("/stats", get(stats_globales))
}
```

Un contrôleur fait uniquement du HTTP : **extraire** les données de la requête, **appeler** la logique, **traduire** le résultat en code HTTP et en JSON.

```text
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<CreateCapteur>,
) -> Result<Response> {
    let item = ActiveModel { nom: Set(params.nom), ..Default::default() };
    let item = item.insert(&ctx.db).await?;
    Ok((StatusCode::CREATED, Json(CapteurDto::from(item))).into_response())
}
```

Les arguments (`State`, `Json`) sont des **extracteurs**. `CapteurDto::from(item)` utilise le trait `From`, et le `?` propage l'erreur. Tu retrouves ces idées en std plus bas.

> [!info] Architecture en couches
> Routes, contrôleur (HTTP seulement), service (la logique, ni HTTP ni SQL), repository (l'accès aux données, derrière un trait). Chaque couche ne connaît que celle du dessous. Un trait permet deux versions du repository : SQLite en production, une simple table en mémoire dans les tests.

**Exemple résolu : le trajet de `GET /api/capteurs/3/stats`**

| Étape | Couche | Ce qui se passe |
|---|---|---|
| 1 | routes | `.prefix("/api")` + `"/capteurs/{id}/stats"` donne le modèle `/api/capteurs/{id}/stats` : il correspond, avec `id = 3`. La route appelle `stats_capteur`. |
| 2 | contrôleur | Les extracteurs lisent la requête : `Path(id)` donne `3`, `State(ctx)` donne l'accès à la base. |
| 3 | service | `stats_capteur(&repo, 3)` calcule le nombre de mesures et la moyenne. Il ne sait rien du HTTP. |
| 4 | repository | `repo.valeurs_de(3)` lit les mesures (SQLite en vrai, une `BTreeMap` en test). |
| 5 | contrôleur | Le résultat revient : `Some(stats)` devient **200** + JSON, `None` (capteur inconnu) devient **404**. |

Si on demande `/api/capteurs/abc/stats`, l'étape 2 échoue (`abc` n'est pas un nombre) : la requête est refusée avec une erreur **400** avant même d'appeler le service.

**À retenir :** une route choisit le gestionnaire ; le contrôleur extrait, appelle, traduit ; le service calcule ; le repository lit les données. Un code HTTP (200, 400, 404) ne se décide que dans le contrôleur.

## 6. Modèles et migrations (SeaORM)

```bash
cargo loco generate scaffold capteur nom:string! unite:string!
cargo loco generate model mesure capteur:references valeur:double!
cargo loco db migrate
```

`!` = obligatoire, `double` = `f64`, `references` = clé étrangère. La migration décrit le schéma **en Rust** :

```text
create_table(m, "mesures",
    &[("id", ColType::PkAuto), ("valeur", ColType::Double)],
    &[("capteur", "")],
).await
```

Les requêtes sont typées :

```text
mesures::Entity::find()
    .filter(mesures::Column::CapteurId.eq(id))
    .order_by_asc(mesures::Column::Id)
    .all(db)
    .await?
```

Une faute dans un nom de colonne est une erreur **à la compilation**, pas à l'exécution comme avec du SQL écrit dans des chaînes.

**Exemple résolu : lire `cargo loco generate model mesure capteur:references valeur:double!` morceau par morceau**

| Morceau | Sens |
|---|---|
| `generate model` | table + modèle, **sans** contrôleur (avec `scaffold`, on aurait aussi le contrôleur CRUD et un test) |
| `mesure` | le nom de la ressource ; la table s'appelle `mesures` (au pluriel) |
| `capteur:references` | une colonne `capteur_id`, clé étrangère vers la table `capteurs` : chaque mesure appartient à un capteur |
| `valeur:double!` | une colonne `valeur` de type `f64`, et le `!` la rend **obligatoire** (pas de valeur vide) |

Une colonne `id` (clé primaire) est toujours ajoutée sans qu'on la demande. Ensuite `cargo loco db migrate` applique la migration : la table existe vraiment dans la base.

**À retenir :** `nom:type` décrit une colonne, `!` = obligatoire, `references` = clé étrangère ; `scaffold` génère aussi le contrôleur et le test, `model` non.

### Générer du code : construire un texte en Rust

Un générateur comme `scaffold` ne fait rien de magique : il **fabrique du texte** (du code Rust) à partir d'un nom et d'une liste de champs, puis l'écrit dans des fichiers. Trois outils suffisent en Rust :

- **une majuscule au début** : on prend le premier caractère avec `chars()`, on le passe en majuscule, et on recolle le reste ;
- **un `match` sur le type** avec un cas `_` pour « tout le reste » ;
- **une liste de lignes** `Vec<String>` assemblée avec `join("\n")` : pas de `\n` en trop à la fin.

**Exemple résolu :** générer l'ordre SQL qui crée la table d'une ressource.

```rust
fn majuscule(mot: &str) -> String {
    let mut lettres = mot.chars();
    match lettres.next() {
        Some(premiere) => premiere.to_uppercase().collect::<String>() + lettres.as_str(),
        None => String::new(),
    }
}

fn type_sql(genre: &str) -> &str {
    match genre {
        "int" => "INTEGER",
        "bool" => "BOOLEAN",
        _ => "TEXT",
    }
}

fn table_sql(nom: &str, champs: &[(&str, &str)]) -> String {
    let mut colonnes = vec!["  id INTEGER PRIMARY KEY".to_string()];
    for (champ, genre) in champs {
        colonnes.push(format!("  {} {}", champ, type_sql(genre)));
    }
    let lignes = [
        format!("-- table de {}", majuscule(nom)),
        format!("CREATE TABLE {}s (", nom),
        colonnes.join(",\n"),
        ")".to_string(),
    ];
    lignes.join("\n")
}

fn main() {
    println!("{}", table_sql("livre", &[("titre", "string"), ("pages", "int")]));
    println!("[{}]", majuscule(""));
}
```

Pas à pas pour `table_sql("livre", &[("titre", "string"), ("pages", "int")])` :

| Étape | Texte obtenu |
|---|---|
| l'`id` est la première colonne, avant les champs | `  id INTEGER PRIMARY KEY` |
| `("titre", "string")` : `"string"` tombe dans `_` | `  titre TEXT` |
| `("pages", "int")` | `  pages INTEGER` |
| `colonnes.join(",\n")` : une virgule **entre** deux colonnes, pas après la dernière (SQL l'exige) | les trois colonnes, séparées par une virgule et un retour à la ligne |
| `majuscule("livre")` : `'l'` devient `"L"`, on recolle `"ivre"` | `-- table de Livre` |
| le pluriel ajoute un `s` | `CREATE TABLE livres (` |
| `lignes.join("\n")` assemble les 4 morceaux | le texte complet |

`join` met son séparateur **entre** les éléments, jamais après le dernier : le texte ne finit pas par `\n`, c'est `println!` qui ajoute le retour à la ligne final. Avec un mot vide, `next()` renvoie `None` et `majuscule` rend une chaîne vide au lieu de planter.

> [!warning] Pièges
> - `to_uppercase()` renvoie un itérateur (une lettre peut donner plusieurs lettres, comme `ß` → `SS`) : il faut le `collect`.
> - Si tu termines chaque ligne par `\n` avec `push_str`, le texte finit par un `\n` de trop.

**À retenir :** pour générer du code, construis un `Vec<String>` ligne par ligne (avec `format!`), traduis les types avec un `match` et un cas `_`, puis assemble avec `join("\n")`.

## 7. Authentification JWT

Un JWT est un **jeton** signé que le client renvoie à chaque requête. Loco fournit l'inscription, la connexion, l'oubli de mot de passe et la vérification (`/api/auth/register`, `/login`, `/forgot`, `/reset`, `/verify`).

```text
async fn current(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
) -> Result<Response> { /* ... */ }
```

Protéger une route = ajouter `auth: auth::JWT` en argument. Jeton absent ou faux : réponse 401.

Le client envoie le jeton dans l'en-tête `Authorization: Bearer <jeton>`. Comme `auth::JWT` est un **extracteur**, il est lu **avant** que le corps du gestionnaire ne s'exécute : si l'extraction échoue, ton code n'est jamais appelé.

**Exemple résolu : trois appels à `GET /api/auth/current`**

| Requête | Ce que fait l'extracteur `auth::JWT` | Réponse |
|---|---|---|
| sans en-tête `Authorization` | aucun jeton à lire : échec | **401**, le gestionnaire n'est pas appelé |
| `Bearer abc123` inventé | la signature ne correspond pas à la clé secrète du serveur : échec | **401** |
| `Bearer <jeton reçu à /login>` | signature valide, jeton pas expiré : on obtient l'utilisateur | **200** + le JSON de l'utilisateur |

Le jeton est **signé** avec une clé que seul le serveur connaît : le client peut le lire, mais pas le modifier sans que la signature devienne fausse.

**À retenir :** pour protéger une route Loco, ajoute l'argument `auth: auth::JWT` ; sans jeton valide, la réponse est 401 et le gestionnaire ne tourne pas. Rien à écrire dans le YAML ni à déplacer dans un autre dossier.

## 8. Tâches, workers et tests

- **Workers** : jobs de fond (envoyer un e-mail, importer un fichier) lancés sans bloquer la réponse.
- **Tâches** : commandes en ligne de commande (`cargo loco task ...`).
- **Tests** : `request::<App, ...>` démarre l'application sur une base de test et appelle les routes comme un client, sans vrai serveur. Grâce au trait repository, le service se teste même sans base.

```bash
curl -s localhost:5150/api/capteurs/1/stats
```

**Exemple résolu : worker, tâche ou simple route ?**

| Besoin | Choix | Pourquoi |
|---|---|---|
| Après l'inscription, envoyer un e-mail de bienvenue | **worker** | l'envoi peut prendre plusieurs secondes : la réponse part tout de suite, l'e-mail part en fond |
| Chaque nuit, supprimer les mesures de plus d'un an, lancé par l'administrateur | **tâche** (`cargo loco task purger`) | c'est une commande, pas une requête HTTP |
| Renvoyer la liste des capteurs | **route** + contrôleur | c'est rapide et le client attend la réponse |

**À retenir :** worker = travail long lancé en fond par l'appli ; tâche = commande lancée à la main ; test de requête = l'appli démarrée sur une base de test, appelée comme un client.

## 9. Le routeur en Rust standard

### Avant le routeur : découper une ligne de texte

Une requête HTTP commence par une ligne comme `GET /users/42 HTTP/1.1`. Pour la lire, on la coupe en **mots** avec `split_whitespace()` : c'est un itérateur qui donne les morceaux séparés par des espaces (plusieurs espaces de suite comptent pour un seul). Chaque appel à `next()` donne le mot suivant, ou `None` quand il n'y en a plus.

Dans une fonction qui renvoie `Option`, le `?` placé après une `Option` veut dire : « si c'est `None`, sors tout de suite de la fonction avec `None` ; sinon, donne-moi la valeur ».

**Exemple résolu :** lire une commande de la forme `<nom> <nombre>`, comme `ajouter 5`.

```rust
#[derive(Debug)]
struct Commande {
    nom: String,
    valeur: u32,
}

fn lire_commande(ligne: &str) -> Option<Commande> {
    let mut mots = ligne.split_whitespace();
    let nom = mots.next()?;
    let valeur = mots.next()?.parse().ok()?;
    if mots.next().is_some() {
        return None;
    }
    if !nom.chars().all(|c| c.is_ascii_lowercase()) {
        return None;
    }
    Some(Commande { nom: nom.to_string(), valeur })
}

fn main() {
    for ligne in ["ajouter 5", "ajouter", "ajouter 5 6", "Ajouter 5", "ajouter x"] {
        println!("{ligne:?} -> {:?}", lire_commande(ligne));
    }
}
```

| Ligne | `nom` | `valeur` | mot en trop ? | nom en minuscules ? | Résultat |
|---|---|---|---|---|---|
| `ajouter 5` | `ajouter` | `5` | non | oui | `Some(Commande { nom: "ajouter", valeur: 5 })` |
| `ajouter` | `ajouter` | `next()` donne `None`, le `?` sort | | | `None` |
| `ajouter 5 6` | `ajouter` | `5` | oui (`6`) | | `None` |
| `Ajouter 5` | `Ajouter` | `5` | non | non (`A`) | `None` |
| `ajouter x` | `ajouter` | `"x".parse()` échoue, `.ok()` donne `None`, le `?` sort | | | `None` |

Trois vérifications sont faciles à oublier : qu'il **manque** un mot (le `?`), qu'il y en ait **trop** (un dernier `next()` qui doit rendre `None`), et la **forme** d'un mot (ici les minuscules ; pour un chemin, on vérifierait qu'il commence par `/` avec `starts_with('/')`).

**À retenir :** `split_whitespace()` + `next()?` pour chaque mot attendu, puis `if mots.next().is_some() { return None; }` pour refuser les mots en trop, puis les vérifications de forme.

### La table des routes

Un routeur est une **table** : (méthode, modèle de chemin) → gestionnaire. Un segment commençant par `:` est dynamique.

```rust
fn correspond(modele: &str, chemin: &str) -> Option<Vec<(String, String)>> {
    let m: Vec<&str> = modele.trim_matches('/').split('/').collect();
    let c: Vec<&str> = chemin.trim_matches('/').split('/').collect();
    if m.len() != c.len() {
        return None;
    }
    let mut params = Vec::new();
    for (a, b) in m.iter().zip(c.iter()) {
        if let Some(nom) = a.strip_prefix(':') {
            params.push((nom.to_string(), b.to_string()));
        } else if a != b {
            return None;
        }
    }
    Some(params)
}

fn main() {
    println!("{:?}", correspond("/users/:id", "/users/42"));
    println!("{:?}", correspond("/users/:id", "/posts/42"));
}
```

Ligne par ligne :

- `trim_matches('/')` enlève les `/` au début et à la fin : `"/users/42/"` devient `"users/42"`.
- `split('/')` coupe aux `/` : `["users", "42"]`.
- Si les deux listes n'ont pas la même longueur, ça ne peut pas correspondre : `None`.
- `zip` avance dans les deux listes en même temps, segment du modèle avec segment du chemin.
- `strip_prefix(':')` renvoie `Some(reste)` si le segment commence par `:` (c'est un paramètre, on le capture) et `None` sinon (c'est un segment fixe, il doit être identique).

**Exemple résolu :** `correspond("/livres/:id/avis/:n", "/livres/12/avis/3")`.

| Segment du modèle | Segment du chemin | Commence par `:` ? | Action |
|---|---|---|---|
| `livres` | `livres` | non | identiques, on continue |
| `:id` | `12` | oui | on capture `("id", "12")` |
| `avis` | `avis` | non | identiques, on continue |
| `:n` | `3` | oui | on capture `("n", "3")` |

Résultat : `Some([("id", "12"), ("n", "3")])`, dans l'ordre du modèle. D'autres cas :

| Modèle | Chemin | Résultat | Pourquoi |
|---|---|---|---|
| `/livres/:id` | `/auteurs/12` | `None` | `livres` ≠ `auteurs` |
| `/livres` | `/livres/12` | `None` | 1 segment contre 2 |
| `/` | `/` | `Some([])` | les deux deviennent `""`, et `"".split('/')` donne `[""]` : un segment vide identique de chaque côté, aucun paramètre |

**À retenir :** découpe les deux chemins en segments, compare les longueurs, puis segment par segment : `:nom` capture, sinon il faut l'égalité exacte.

## 10. Les gestionnaires : `Box<dyn Fn>`

Chaque closure a son propre type. Pour les ranger dans une même liste, on les cache derrière un **objet-trait** : `Box<dyn Fn(&Requete) -> Reponse>`.

```rust
struct Requete {
    chemin: String,
}

struct Reponse {
    statut: u16,
    corps: String,
}

type Gestionnaire = Box<dyn Fn(&Requete) -> Reponse>;

fn main() {
    let mut routes: Vec<(String, Gestionnaire)> = Vec::new();
    routes.push((
        "/salut".to_string(),
        Box::new(|r| Reponse { statut: 200, corps: format!("salut depuis {}", r.chemin) }),
    ));
    routes.push((
        "/vide".to_string(),
        Box::new(|_| Reponse { statut: 204, corps: String::new() }),
    ));
    for (chemin, gestionnaire) in &routes {
        let rep = gestionnaire(&Requete { chemin: chemin.clone() });
        println!("{} {} {:?}", chemin, rep.statut, rep.corps);
    }
}
```

C'est exactement ce que fait Axum, en plus général : `get(list)` range `list` dans une structure de ce genre.

Pourquoi une `Box` ? Deux closures différentes n'ont jamais le même type, même si elles ont la même signature, et un `Vec` ne contient qu'un seul type. `dyn Fn(&Requete) -> Reponse` veut dire « n'importe quoi qu'on peut appeler avec une `&Requete` et qui rend une `Reponse` ». Sa taille n'est pas connue à la compilation, donc on le met sur le tas, derrière une `Box`. Une `Box<dyn Fn…>` s'appelle comme une fonction : `gestionnaire(&requete)`.

### Une méthode générique qui range n'importe quelle closure

Pour que l'utilisateur écrive `ajouter("nom", |x| ...)` sans faire `Box::new` lui-même, la méthode prend un type générique `F` et fait la mise en boîte à sa place. La borne `'static` est obligatoire : la closure sera gardée dans la structure aussi longtemps qu'on veut, elle ne doit donc pas garder de référence vers une variable qui pourrait disparaître avant.

**Exemple résolu :** un registre de commandes qui choisit la **première** commande dont le nom correspond.

```rust
type Action = Box<dyn Fn(u32) -> String>;

#[derive(Default)]
struct Registre {
    actions: Vec<(String, Action)>,
}

impl Registre {
    fn ajouter<F>(&mut self, nom: &str, action: F)
    where
        F: Fn(u32) -> String + 'static,
    {
        self.actions.push((nom.to_string(), Box::new(action)));
    }

    fn lancer(&self, nom: &str, x: u32) -> String {
        for (n, action) in &self.actions {
            if n == nom {
                return action(x);
            }
        }
        format!("commande inconnue : {nom}")
    }
}

fn double(x: u32) -> String {
    format!("{}", x * 2)
}

fn main() {
    let mut registre = Registre::default();
    registre.ajouter("double", double);
    registre.ajouter("carre", |x| format!("{}", x * x));
    registre.ajouter("double", |_| "jamais atteint".to_string());
    println!("{}", registre.lancer("double", 4));
    println!("{}", registre.lancer("carre", 4));
    println!("{}", registre.lancer("cube", 4));
}
```

| Appel | Parcours de la liste | Résultat |
|---|---|---|
| `lancer("double", 4)` | 1re entrée `double` : même nom, on appelle la fonction et on **sort** avec `return` | `8` (la 2e entrée `double` n'est jamais regardée) |
| `lancer("carre", 4)` | `double` ≠ `carre`, puis `carre` : on appelle la closure | `16` |
| `lancer("cube", 4)` | aucune entrée ne correspond, la boucle se termine | `commande inconnue : cube` |

Une fonction nommée (`double`) et une closure (`|x| …`) passent toutes les deux : elles respectent `Fn(u32) -> String`.

**À retenir :** pour stocker des gestionnaires, `Vec<(clé, Box<dyn Fn…>)>` ; la méthode d'ajout prend un `F: Fn… + 'static` et fait `Box::new` ; la recherche parcourt la liste et fait `return` sur la **première** correspondance, avec une réponse par défaut après la boucle.

## 11. Middleware : envelopper un gestionnaire

Un middleware est une **fonction qui reçoit un gestionnaire et en rend un autre** : il fait quelque chose avant, appelle le gestionnaire, puis peut agir après.

```rust
struct Requete {
    chemin: String,
    jeton: Option<String>,
}

struct Reponse {
    statut: u16,
}

type Gestionnaire = Box<dyn Fn(&Requete) -> Reponse>;

fn avec_jeton(suivant: Gestionnaire) -> Gestionnaire {
    Box::new(move |r: &Requete| {
        if r.jeton.is_some() {
            suivant(r)
        } else {
            Reponse { statut: 401 }
        }
    })
}

fn avec_journal(suivant: Gestionnaire) -> Gestionnaire {
    Box::new(move |r: &Requete| {
        println!("début {}", r.chemin);
        let rep = suivant(r);
        println!("fin {} {}", r.chemin, rep.statut);
        rep
    })
}

fn main() {
    let page: Gestionnaire = Box::new(|_| Reponse { statut: 200 });
    let protegee = avec_journal(avec_jeton(page));
    protegee(&Requete { chemin: "/prive".into(), jeton: None });
    protegee(&Requete { chemin: "/prive".into(), jeton: Some("abc".into()) });
}
```

L'ordre compte : le dernier middleware ajouté est le premier à voir la requête. Dans Axum et Loco, ce sont les couches `layer` de Tower, activées dans le YAML pour Loco.

Le mot `move` devant la closure est indispensable : la closure **prend possession** de `suivant` et l'emporte avec elle. Sans lui, elle emprunterait `suivant`, qui disparaît à la fin de `avec_jeton` : le compilateur refuse.

**Exemple résolu :** `avec_journal(avec_jeton(page))`, comme des poupées russes : `avec_journal` est à l'extérieur, `avec_jeton` au milieu, `page` au centre.

| Étape | Requête sans jeton | Requête avec le jeton `abc` |
|---|---|---|
| 1. `avec_journal` (extérieur) | affiche `début /prive`, appelle le suivant | affiche `début /prive`, appelle le suivant |
| 2. `avec_jeton` | `jeton` vaut `None` : rend 401 **sans** appeler `page` | `Some("abc")` : appelle `page` |
| 3. `page` | jamais appelée | rend 200 |
| 4. retour dans `avec_journal` | affiche `fin /prive 401` | affiche `fin /prive 200` |

Le journal voit **toutes** les requêtes, même celles refusées, parce qu'il est à l'extérieur. Si on écrivait `avec_jeton(avec_journal(page))`, une requête sans jeton serait refusée avant d'arriver au journal : rien ne serait affiché.

**À retenir :** un middleware = `fn(suivant) -> Gestionnaire` qui renvoie `Box::new(move |r| { avant; let rep = suivant(r); après; rep })`. Pour refuser, il rend sa propre réponse sans appeler `suivant`.

### Un middleware avec un paramètre ou un état partagé

Deux difficultés arrivent vite :

1. **Un paramètre `&str`** (par exemple le préfixe à exiger). La closure renvoyée doit vivre aussi longtemps que voulu (`Box<dyn Fn>` sans durée de vie précisée veut dire `'static`), elle ne peut donc pas garder un `&str` emprunté. On en fait une copie possédée avec `to_string()` **avant** la closure, et `move` l'emporte.
2. **Un état que le middleware modifie et que le reste du programme relit** (un journal, un compteur). Une `Fn` ne peut pas modifier ce qu'elle capture directement. On partage la valeur avec `Rc` (plusieurs propriétaires) et on la modifie à travers `RefCell` (mutabilité intérieure, chapitre 2) : `etat.borrow_mut()` pour écrire, `etat.borrow()` pour lire.

**Exemple résolu :** un middleware qui refuse (403) les chemins hors d'un préfixe, et un autre qui compte les appels.

```rust
use std::cell::RefCell;
use std::rc::Rc;

struct Requete {
    chemin: String,
    langue: Option<String>,
}

type Gestionnaire = Box<dyn Fn(&Requete) -> u16>;

fn exiger_prefixe(suivant: Gestionnaire, prefixe: &str) -> Gestionnaire {
    let prefixe = prefixe.to_string();
    Box::new(move |r: &Requete| {
        if r.chemin.starts_with(&prefixe) {
            suivant(r)
        } else {
            403
        }
    })
}

fn compter(suivant: Gestionnaire, compteur: Rc<RefCell<u32>>) -> Gestionnaire {
    Box::new(move |r: &Requete| {
        *compteur.borrow_mut() += 1;
        suivant(r)
    })
}

fn main() {
    let compteur = Rc::new(RefCell::new(0));
    let page: Gestionnaire = Box::new(|r| if r.langue.as_deref() == Some("fr") { 200 } else { 406 });
    let appli = compter(exiger_prefixe(page, "/api"), Rc::clone(&compteur));
    let requetes = [
        Requete { chemin: "/api/a".to_string(), langue: Some("fr".to_string()) },
        Requete { chemin: "/admin".to_string(), langue: Some("fr".to_string()) },
        Requete { chemin: "/api/b".to_string(), langue: None },
    ];
    for r in &requetes {
        println!("{} -> {}", r.chemin, appli(r));
    }
    println!("appels comptés : {}", compteur.borrow());
}
```

| Requête | `compter` | `exiger_prefixe("/api")` | `page` | Réponse |
|---|---|---|---|---|
| `/api/a`, langue `fr` | compteur 0 → 1 | commence par `/api` : continue | `Some("fr") == Some("fr")` | 200 |
| `/admin`, langue `fr` | 1 → 2 | ne commence pas par `/api` : refuse | jamais appelée | 403 |
| `/api/b`, sans langue | 2 → 3 | continue | `None != Some("fr")` | 406 |

À la fin, `main` lit le compteur grâce à son propre `Rc` (le clone donné au middleware pointe sur la **même** valeur) : 3 appels.

Pour comparer une `Option<String>` à un texte, `as_deref()` la transforme en `Option<&str>` : `r.langue.as_deref() == Some("fr")`. Avec un `String` gardé dans la closure, on écrit `Some(attendu.as_str())`.

> [!warning] Pièges
> - Oublier `to_string()` sur le paramètre : erreur « borrowed data escapes » (la donnée empruntée sortirait de la fonction).
> - Donner `compteur` lui-même au middleware au lieu de `Rc::clone(&compteur)` : `main` ne peut plus le relire.

**À retenir :** paramètre `&str` → copie `String` avant la closure `move` ; état partagé → `Rc<RefCell<…>>`, cloné avec `Rc::clone` et modifié avec `borrow_mut()`.

## 12. Extracteurs, `From` et `TryFrom`

Un **extracteur** transforme une partie de la requête en valeur typée (`Path<i64>`, `Json<T>`...). S'il n'y arrive pas, la requête est refusée. En std, c'est `TryFrom` : une conversion qui peut échouer.

```rust
use std::num::ParseIntError;

#[derive(Debug)]
struct Identifiant(u32);

#[derive(Debug)]
enum ErreurWeb {
    Invalide(String),
}

impl From<ParseIntError> for ErreurWeb {
    fn from(_: ParseIntError) -> Self {
        ErreurWeb::Invalide("identifiant invalide".to_string())
    }
}

impl TryFrom<&str> for Identifiant {
    type Error = ErreurWeb;

    fn try_from(texte: &str) -> Result<Self, ErreurWeb> {
        let n: u32 = texte.parse()?;
        Ok(Identifiant(n))
    }
}

fn main() {
    println!("{:?}", Identifiant::try_from("42"));
    println!("{:?}", Identifiant::try_from("abc"));
}
```

`From` est une conversion qui réussit toujours (`CapteurDto::from(item)`). `TryFrom` renvoie un `Result`.

**Exemple résolu :** ce qui se passe dans `try_from` pour deux textes.

| Étape | `Identifiant::try_from("42")` | `Identifiant::try_from("abc")` |
|---|---|---|
| `texte.parse()` (vers `u32`, à cause de `let n: u32`) | `Ok(42)` | `Err(ParseIntError)` |
| le `?` | valeur bonne : `n = 42`, on continue | erreur : il appelle `ErreurWeb::from(ParseIntError)` puis **sort** de la fonction |
| résultat | `Ok(Identifiant(42))` | `Err(Invalide("identifiant invalide"))` |

Sans le `impl From<ParseIntError> for ErreurWeb`, le `?` ne compilerait pas : la fonction renvoie une `ErreurWeb`, et Rust ne saurait pas transformer une `ParseIntError` en `ErreurWeb`.

Dans `impl TryFrom<&str> for Identifiant`, la ligne `type Error = ErreurWeb;` dit quel type d'erreur la conversion renvoie. Une fois `TryFrom` écrit, on peut aussi écrire `let id: Identifiant = "42".try_into()?;` : `try_into` est fourni gratuitement.

**À retenir :** `From` = conversion qui ne rate jamais ; `TryFrom` = conversion qui peut refuser (`Result`), c'est l'idée d'un extracteur. Un `impl From<ErreurDeBase> for MonErreur` permet au `?` de convertir l'erreur tout seul.

## 13. Les erreurs avec `Result` et `?`

Le `?` fait deux choses : il sort de la fonction si le résultat est une erreur, et il convertit l'erreur avec `From`. Un contrôleur renvoie donc `Result<Reponse, ErreurWeb>` et un seul endroit transforme l'erreur en code HTTP.

```rust
#[derive(Debug)]
enum ErreurWeb {
    Introuvable,
    Invalide(String),
}

fn code(e: &ErreurWeb) -> u16 {
    match e {
        ErreurWeb::Introuvable => 404,
        ErreurWeb::Invalide(_) => 400,
    }
}

fn chercher(id: &str, base: &[(u32, &str)]) -> Result<String, ErreurWeb> {
    let id: u32 = id
        .parse()
        .map_err(|_| ErreurWeb::Invalide(format!("identifiant invalide : {id}")))?;
    let (_, nom) = base
        .iter()
        .find(|(i, _)| *i == id)
        .ok_or(ErreurWeb::Introuvable)?;
    Ok(nom.to_string())
}

fn main() {
    let base = [(1, "Alice"), (2, "Bob")];
    for entree in ["1", "9", "x"] {
        match chercher(entree, &base) {
            Ok(nom) => println!("200 {nom}"),
            Err(e) => println!("{} {:?}", code(&e), e),
        }
    }
}
```

Ici, `map_err` transforme l'erreur à la main (pas besoin de `From`), et `ok_or` change une `Option` en `Result` : `Some(x)` devient `Ok(x)`, `None` devient `Err(Introuvable)`. Le `?` peut alors l'utiliser.

**Exemple résolu :** les trois entrées du `main`.

| Entrée | `parse` | `find` dans la base | Résultat de `chercher` | Affiché |
|---|---|---|---|---|
| `"1"` | `Ok(1)` | `Some((1, "Alice"))` | `Ok("Alice")` | `200 Alice` |
| `"9"` | `Ok(9)` | `None` → `ok_or` → `Err(Introuvable)`, le `?` sort | `Err(Introuvable)` | `404 Introuvable` |
| `"x"` | `Err(…)` → `map_err` → `Err(Invalide(…))`, le `?` sort | jamais fait | `Err(Invalide("identifiant invalide : x"))` | `400 …` |

Le `?` arrête la fonction à la **première** erreur : pour `"x"`, on ne cherche même pas dans la base.

### Un seul endroit pour transformer l'erreur en réponse

Plutôt qu'une fonction `code` appelée à la main, on écrit `impl From<ErreurWeb> for Reponse` : toute erreur sait devenir une réponse. Ensuite, un `Result<Reponse, ErreurWeb>` se « termine » en une seule ligne : si c'est `Ok(rep)`, on garde `rep` ; si c'est `Err(e)`, on convertit `e`.

**Exemple résolu :** une caisse qui répond à une commande de panier.

```rust
#[derive(Debug)]
struct Message {
    code: u16,
    texte: String,
}

enum ErreurPanier {
    Vide,
    Rupture(String),
}

impl From<ErreurPanier> for Message {
    fn from(erreur: ErreurPanier) -> Self {
        match erreur {
            ErreurPanier::Vide => Message { code: 400, texte: "panier vide".to_string() },
            ErreurPanier::Rupture(article) => Message { code: 409, texte: format!("{article} épuisé") },
        }
    }
}

fn valider(panier: &[&str], stock: &[&str]) -> Result<Message, ErreurPanier> {
    if panier.is_empty() {
        return Err(ErreurPanier::Vide);
    }
    for article in panier {
        if !stock.contains(article) {
            return Err(ErreurPanier::Rupture(article.to_string()));
        }
    }
    Ok(Message { code: 200, texte: format!("{} article(s) validé(s)", panier.len()) })
}

fn conclure(resultat: Result<Message, ErreurPanier>) -> Message {
    resultat.unwrap_or_else(Message::from)
}

fn main() {
    let stock = ["pomme", "poire"];
    println!("{:?}", conclure(valider(&["pomme", "poire"], &stock)));
    println!("{:?}", conclure(valider(&[], &stock)));
    println!("{:?}", conclure(valider(&["pomme", "kiwi"], &stock)));
}
```

| Appel | `valider` rend | `conclure` rend |
|---|---|---|
| `["pomme", "poire"]` | `Ok(Message 200 …)` | le message tel quel : `200`, `2 article(s) validé(s)` |
| `[]` | `Err(Vide)` | `Message::from(Vide)` : `400`, `panier vide` |
| `["pomme", "kiwi"]` | `Err(Rupture("kiwi"))` | `409`, `kiwi épuisé` |

`unwrap_or_else(Message::from)` est la version courte de `match resultat { Ok(m) => m, Err(e) => Message::from(e) }`. Grâce au `From`, on peut aussi écrire `e.into()` à la place de `Message::from(e)`.

**À retenir :** la fonction métier renvoie `Result<Réponse, Erreur>` et utilise `?` ; `impl From<Erreur> for Réponse` dit une fois pour toutes quel code HTTP correspond à quelle erreur ; à la fin, `unwrap_or_else(Réponse::from)` donne toujours une réponse.

## 14. Un service générique sur un repository

Le **repository** est un trait : il dit ce dont le service a besoin, rien de plus. Le **service** est générique sur ce trait, il ne sait pas d'où viennent les données. En production, l'implémentation parle à SQLite (SeaORM) ; dans les tests, une simple `BTreeMap` suffit. Dans Loco les méthodes sont `async` (avec `#[async_trait]`) ; ici on garde la même idée en std.

```rust
use std::collections::BTreeMap;

trait Mesures {
    fn existe(&self, capteur: u32) -> bool;
    fn valeurs_de(&self, capteur: u32) -> Vec<f64>;
}

#[derive(Default)]
struct EnMemoire {
    donnees: BTreeMap<u32, Vec<f64>>,
}

impl Mesures for EnMemoire {
    fn existe(&self, capteur: u32) -> bool {
        self.donnees.contains_key(&capteur)
    }

    fn valeurs_de(&self, capteur: u32) -> Vec<f64> {
        self.donnees.get(&capteur).cloned().unwrap_or_default()
    }
}

fn moyenne_capteur<R: Mesures>(repo: &R, capteur: u32) -> Option<f64> {
    if !repo.existe(capteur) {
        return None;
    }
    let valeurs = repo.valeurs_de(capteur);
    if valeurs.is_empty() {
        return Some(0.0);
    }
    Some(valeurs.iter().sum::<f64>() / valeurs.len() as f64)
}

fn main() {
    let mut repo = EnMemoire::default();
    repo.donnees.insert(1, vec![21.5, 22.0, 19.5]);
    println!("{:?}", moyenne_capteur(&repo, 1));
    println!("{:?}", moyenne_capteur(&repo, 9));
}
```

Le contrôleur ne fait plus que traduire : `None` devient un **404**, `Some(stats)` devient un **200** avec du JSON. Le service se teste en quelques millisecondes, sans serveur ni base.

**Exemple résolu :** les deux appels du `main`.

| Appel | `existe` ? | `valeurs_de` | Calcul | Résultat |
|---|---|---|---|---|
| `moyenne_capteur(&repo, 1)` | oui | `[21.5, 22.0, 19.5]` | somme 63.0, 3 valeurs, 63.0 / 3 | `Some(21.0)` |
| `moyenne_capteur(&repo, 9)` | non : on sort tout de suite | jamais appelé | | `None` |

Deux choses à remarquer :

- `sum::<f64>()` a besoin du type : sinon Rust ne sait pas en quoi additionner. Et `len()` est un `usize` : il faut `as f64` pour diviser.
- Pour un capteur connu **sans** mesure, ce code rend `Some(0.0)`. C'est trompeur (« la moyenne vaut 0 ») : souvent on préfère dire « pas de moyenne » avec un `Option<f64>`, `None` quand la liste est vide.

`moyenne_capteur` est générique : `<R: Mesures>` veut dire « pour **n'importe quel** type `R` qui implémente `Mesures` ». Le même code marche avec `EnMemoire`, avec un repository SQLite, ou avec un faux repository écrit dans un test.

### Modifier les données : `&mut self` et `get_mut`

Une méthode qui **change** le repository prend `&mut self`. Pour modifier une valeur rangée dans une `BTreeMap` (ou une `HashMap`), `get_mut(&cle)` renvoie `Some(&mut valeur)` si la clé existe, `None` sinon. Contrairement à `entry(…).or_default()`, `get_mut` ne **crée** rien.

**Exemple résolu :** réapprovisionner un stock, sans inventer d'article inconnu.

```rust
use std::collections::BTreeMap;

trait Stock {
    fn quantite(&self, article: &str) -> Option<u32>;
    fn ajouter(&mut self, article: &str, arrivees: &[u32]) -> u32;
}

struct Entrepot {
    articles: BTreeMap<String, u32>,
}

impl Stock for Entrepot {
    fn quantite(&self, article: &str) -> Option<u32> {
        self.articles.get(article).copied()
    }

    fn ajouter(&mut self, article: &str, arrivees: &[u32]) -> u32 {
        match self.articles.get_mut(article) {
            Some(quantite) => {
                let total: u32 = arrivees.iter().sum();
                *quantite += total;
                total
            }
            None => 0,
        }
    }
}

fn main() {
    let mut entrepot = Entrepot { articles: BTreeMap::new() };
    entrepot.articles.insert("vis".to_string(), 10);
    println!("ajoutées : {}", entrepot.ajouter("vis", &[5, 3]));
    println!("ajoutés : {}", entrepot.ajouter("clou", &[7]));
    println!("vis : {:?}, clou : {:?}", entrepot.quantite("vis"), entrepot.quantite("clou"));
}
```

| Appel | `get_mut` | Ce qui change | Valeur rendue |
|---|---|---|---|
| `ajouter("vis", &[5, 3])` | `Some(&mut 10)` | 10 + 8 = 18 | `8` |
| `ajouter("clou", &[7])` | `None` | rien, `clou` n'est pas créé | `0` |
| `quantite("vis")` / `quantite("clou")` | | | `Some(18)` / `None` |

`*quantite += total` : le `*` écrit **dans** la valeur pointée par la référence `&mut`. Pour ajouter des éléments à la fin d'un `Vec` obtenu par `get_mut`, on utiliserait `extend_from_slice(&nouveaux)`.

**À retenir :** le repository est un trait, le service est générique `<R: MonTrait>` ; lire = `&self` + `get`, modifier = `&mut self` + `get_mut` (qui ne crée pas la clé), et `None` pour « inconnu » que le contrôleur traduit en 404.

> [!info] Pourquoi `Clone + Send + Sync + 'static` ?
> Dans Loco, le trait du repository demande ces bornes : chaque requête est une tâche tokio qui peut changer de thread, donc le repository doit pouvoir être copié et partagé entre threads sans risque.

> [!tip] À retenir
> Un framework web, c'est surtout : une **table de routes**, des **gestionnaires** rangés derrière `Box<dyn Fn>`, des **middlewares** qui enveloppent, des **extracteurs** (`TryFrom`) et des **erreurs** propagées avec `?` puis converties (`From`) en réponses. Loco range tout ça dans une structure commune et génère le code répétitif.
