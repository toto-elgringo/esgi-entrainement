#[cfg(test)]
mod tests {
    use super::*;

    fn article() -> Article {
        Article {
            titre: "Les traits".to_string(),
            auteur: "Léa".to_string(),
        }
    }

    fn tweet(pseudo: &str, texte: &str) -> Tweet {
        Tweet {
            pseudo: pseudo.to_string(),
            texte: texte.to_string(),
        }
    }

    #[test]
    fn resumes() {
        assert_eq!(article().resumer(), "Les traits, par Léa", "résumé d'un article");
        assert_eq!(tweet("ana", "Bonjour").resumer(), "@ana : Bonjour", "résumé d'un tweet");
    }

    #[test]
    fn annonce_de_types_differents() {
        assert_eq!(annoncer(&article()), "Nouveau : Les traits, par Léa", "annoncer marche avec un Article");
        assert_eq!(annoncer(&tweet("ana", "Bonjour")), "Nouveau : @ana : Bonjour", "annoncer marche avec un Tweet");
    }

    #[test]
    fn tous_les_resumes() {
        let tweets = vec![tweet("ana", "Salut"), tweet("tom", "Coucou")];
        assert_eq!(tout_resumer(&tweets), "@ana : Salut | @tom : Coucou", "résumés séparés par « | »");
        let aucun: Vec<Tweet> = Vec::new();
        assert_eq!(tout_resumer(&aucun), "", "aucun élément : texte vide");
    }

    #[test]
    fn retour_impl_trait() {
        assert_eq!(tweet_du_jour().resumer(), "@rustlang : Rust 2024 est sorti", "le tweet du jour");
    }
}
