#[cfg(test)]
mod tests {
    use super::*;

    fn requete(methode: &str, chemin: &str) -> Option<Requete> {
        Some(Requete {
            methode: methode.to_string(),
            chemin: chemin.to_string(),
        })
    }

    #[test]
    fn ligne_normale() {
        assert_eq!(analyser("GET /users/42"), requete("GET", "/users/42"), "méthode et chemin");
    }

    #[test]
    fn espaces_en_trop() {
        assert_eq!(analyser("  POST   /users  "), requete("POST", "/users"), "les espaces multiples sont ignorés");
    }

    #[test]
    fn sans_chemin() {
        assert_eq!(analyser("GET"), None, "il manque le chemin");
    }

    #[test]
    fn trop_de_mots() {
        assert_eq!(analyser("GET /a /b"), None, "trois mots : refusé");
    }

    #[test]
    fn chemin_sans_barre() {
        assert_eq!(analyser("GET users"), None, "le chemin commence par /");
    }

    #[test]
    fn vide() {
        assert_eq!(analyser(""), None, "ligne vide");
    }
}
