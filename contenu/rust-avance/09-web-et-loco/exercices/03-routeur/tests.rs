#[cfg(test)]
mod tests {
    use super::*;

    fn routeur() -> Routeur {
        let mut r = Routeur::new();
        r.ajouter("GET", "/users", |_| Reponse::new(200, "liste"));
        r.ajouter("GET", "/users/:id", |req| {
            Reponse::new(200, &format!("utilisateur {}", req.param("id").unwrap_or("?")))
        });
        r.ajouter("POST", "/users", |_| Reponse::new(201, "créé"));
        r
    }

    #[test]
    fn route_fixe() {
        assert_eq!(routeur().traiter("GET", "/users"), Reponse::new(200, "liste"), "GET /users");
    }

    #[test]
    fn route_dynamique() {
        assert_eq!(
            routeur().traiter("GET", "/users/42"),
            Reponse::new(200, "utilisateur 42"),
            "le paramètre id est transmis"
        );
    }

    #[test]
    fn meme_chemin_autre_methode() {
        assert_eq!(routeur().traiter("POST", "/users"), Reponse::new(201, "créé"), "POST /users");
    }

    #[test]
    fn methode_inconnue() {
        assert_eq!(routeur().traiter("DELETE", "/users"), Reponse::new(404, "introuvable"), "méthode absente");
    }

    #[test]
    fn chemin_inconnu() {
        assert_eq!(routeur().traiter("GET", "/autre"), Reponse::new(404, "introuvable"), "chemin absent");
    }

    #[test]
    fn la_premiere_route_gagne() {
        let mut r = Routeur::new();
        r.ajouter("GET", "/a/:x", |_| Reponse::new(200, "premier"));
        r.ajouter("GET", "/a/b", |_| Reponse::new(200, "second"));
        assert_eq!(r.traiter("GET", "/a/b"), Reponse::new(200, "premier"), "ordre d'enregistrement");
    }

    #[test]
    fn gestionnaire_avec_etat() {
        let mut r = Routeur::new();
        let salut = String::from("salut");
        r.ajouter("GET", "/", move |_| Reponse::new(200, &salut));
        assert_eq!(r.traiter("GET", "/"), Reponse::new(200, "salut"), "une closure peut capturer");
    }
}
