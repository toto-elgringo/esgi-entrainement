#[derive(Debug, PartialEq)]
struct Reponse {
    statut: u16,
    corps: String,
}

impl Reponse {
    fn new(statut: u16, corps: &str) -> Self {
        Reponse {
            statut,
            corps: corps.to_string(),
        }
    }
}

struct Requete {
    methode: String,
    chemin: String,
    params: Vec<(String, String)>,
}

impl Requete {
    fn param(&self, nom: &str) -> Option<&str> {
        self.params
            .iter()
            .find(|(n, _)| n == nom)
            .map(|(_, v)| v.as_str())
    }
}

fn correspond(modele: &str, chemin: &str) -> Option<Vec<(String, String)>> {
    let segments_modele: Vec<&str> = modele.trim_matches('/').split('/').collect();
    let segments_chemin: Vec<&str> = chemin.trim_matches('/').split('/').collect();
    if segments_modele.len() != segments_chemin.len() {
        return None;
    }
    let mut params = Vec::new();
    for (m, c) in segments_modele.iter().zip(segments_chemin.iter()) {
        if let Some(nom) = m.strip_prefix(':') {
            params.push((nom.to_string(), c.to_string()));
        } else if m != c {
            return None;
        }
    }
    Some(params)
}

type Gestionnaire = Box<dyn Fn(&Requete) -> Reponse>;

#[derive(Default)]
struct Routeur {
    routes: Vec<(String, String, Gestionnaire)>,
}

impl Routeur {
    fn new() -> Self {
        Self::default()
    }

    fn ajouter<F>(&mut self, methode: &str, modele: &str, gestionnaire: F)
    where
        F: Fn(&Requete) -> Reponse + 'static,
    {
        todo!()
    }

    fn traiter(&self, methode: &str, chemin: &str) -> Reponse {
        todo!()
    }
}

fn main() {
    let mut routeur = Routeur::new();
    routeur.ajouter("GET", "/users/:id", |r| {
        Reponse::new(200, &format!("utilisateur {}", r.param("id").unwrap_or("?")))
    });
    println!("{:?}", routeur.traiter("GET", "/users/42"));
    println!("{:?}", routeur.traiter("GET", "/inconnu"));
}
