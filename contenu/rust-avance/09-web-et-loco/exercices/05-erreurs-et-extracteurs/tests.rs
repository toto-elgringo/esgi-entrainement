#[cfg(test)]
mod tests {
    use super::*;

    const BASE: [(u32, &str); 2] = [(1, "Alice"), (2, "Bob")];

    #[test]
    fn extracteur_valide() {
        assert_eq!(IdUtilisateur::try_from("42"), Ok(IdUtilisateur(42)), "42 est un identifiant");
    }

    #[test]
    fn extracteur_invalide() {
        assert_eq!(
            IdUtilisateur::try_from("abc"),
            Err(ErreurWeb::Invalide("identifiant invalide".to_string())),
            "abc n'est pas un nombre"
        );
    }

    #[test]
    fn extracteur_negatif() {
        assert!(IdUtilisateur::try_from("-3").is_err(), "un identifiant négatif est refusé");
    }

    #[test]
    fn erreur_vers_reponse() {
        assert_eq!(Reponse::from(ErreurWeb::Introuvable), Reponse::new(404, "introuvable"), "404");
        assert_eq!(
            Reponse::from(ErreurWeb::Invalide("oups".to_string())),
            Reponse::new(400, "oups"),
            "400 avec le message"
        );
    }

    #[test]
    fn utilisateur_trouve() {
        assert_eq!(
            afficher_utilisateur("2", &BASE),
            Ok(Reponse::new(200, "utilisateur Bob")),
            "l'utilisateur 2 est Bob"
        );
    }

    #[test]
    fn utilisateur_absent() {
        assert_eq!(afficher_utilisateur("9", &BASE), Err(ErreurWeb::Introuvable), "personne avec l'id 9");
    }

    #[test]
    fn identifiant_invalide() {
        assert_eq!(
            afficher_utilisateur("abc", &BASE),
            Err(ErreurWeb::Invalide("identifiant invalide".to_string())),
            "le ? convertit l'erreur de parse"
        );
    }

    #[test]
    fn repondre_toutes_les_issues() {
        assert_eq!(repondre(afficher_utilisateur("1", &BASE)), Reponse::new(200, "utilisateur Alice"), "succès");
        assert_eq!(repondre(afficher_utilisateur("9", &BASE)), Reponse::new(404, "introuvable"), "absent");
        assert_eq!(repondre(afficher_utilisateur("x", &BASE)), Reponse::new(400, "identifiant invalide"), "invalide");
    }
}
