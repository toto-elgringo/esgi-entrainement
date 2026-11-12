#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adresse_valide() {
        let email = Email::new("alice@ecole.fr").unwrap();
        assert_eq!(email.adresse(), "alice@ecole.fr", "l'adresse complète");
        assert_eq!(email.domaine(), "ecole.fr", "le domaine");
    }

    #[test]
    fn sans_arobase() {
        assert_eq!(Email::new("alice.fr"), Err(ErreurEmail::SansArobase), "pas de @");
        assert_eq!(Email::new(""), Err(ErreurEmail::SansArobase), "texte vide");
    }

    #[test]
    fn partie_vide() {
        assert_eq!(Email::new("@ecole.fr"), Err(ErreurEmail::PartieVide), "rien avant le @");
        assert_eq!(Email::new("alice@"), Err(ErreurEmail::PartieVide), "rien après le @");
    }

    #[test]
    fn domaine_sans_point() {
        assert_eq!(Email::new("alice@ecole"), Err(ErreurEmail::DomaineSansPoint), "pas de point dans le domaine");
    }
}
