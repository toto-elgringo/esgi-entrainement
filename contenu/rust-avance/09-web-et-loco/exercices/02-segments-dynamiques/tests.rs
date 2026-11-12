#[cfg(test)]
mod tests {
    use super::*;

    fn paires(liste: &[(&str, &str)]) -> Option<Vec<(String, String)>> {
        Some(liste.iter().map(|(a, b)| (a.to_string(), b.to_string())).collect())
    }

    #[test]
    fn un_parametre() {
        assert_eq!(correspond("/users/:id", "/users/42"), paires(&[("id", "42")]), "capture id");
    }

    #[test]
    fn autre_debut() {
        assert_eq!(correspond("/users/:id", "/posts/42"), None, "segment fixe différent");
    }

    #[test]
    fn deux_parametres() {
        assert_eq!(
            correspond("/users/:id/notes/:n", "/users/7/notes/3"),
            paires(&[("id", "7"), ("n", "3")]),
            "deux captures dans l'ordre"
        );
    }

    #[test]
    fn longueur_differente() {
        assert_eq!(correspond("/users", "/users/42"), None, "trop de segments");
        assert_eq!(correspond("/users/:id", "/users"), None, "pas assez de segments");
    }

    #[test]
    fn sans_parametre() {
        assert_eq!(correspond("/health", "/health"), paires(&[]), "chemin fixe identique");
    }

    #[test]
    fn racine() {
        assert_eq!(correspond("/", "/"), paires(&[]), "la racine correspond à la racine");
    }
}
