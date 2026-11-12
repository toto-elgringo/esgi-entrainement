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

## 7. Authentification JWT

Un JWT est un **jeton** signé que le client renvoie à chaque requête. Loco fournit l'inscription, la connexion, l'oubli de mot de passe et la vérification (`/api/auth/register`, `/login`, `/forgot`, `/reset`, `/verify`).

```text
async fn current(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
) -> Result<Response> { /* ... */ }
```

Protéger une route = ajouter `auth: auth::JWT` en argument. Jeton absent ou faux : réponse 401.

## 8. Tâches, workers et tests

- **Workers** : jobs de fond (envoyer un e-mail, importer un fichier) lancés sans bloquer la réponse.
- **Tâches** : commandes en ligne de commande (`cargo loco task ...`).
- **Tests** : `request::<App, ...>` démarre l'application sur une base de test et appelle les routes comme un client, sans vrai serveur. Grâce au trait repository, le service se teste même sans base.

```bash
curl -s localhost:5150/api/capteurs/1/stats
```

## 9. Le routeur en Rust standard

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

> [!tip] À retenir
> Un framework web, c'est surtout : une **table de routes**, des **gestionnaires** rangés derrière `Box<dyn Fn>`, des **middlewares** qui enveloppent, des **extracteurs** (`TryFrom`) et des **erreurs** propagées avec `?` puis converties (`From`) en réponses. Loco range tout ça dans une structure commune et génère le code répétitif.
