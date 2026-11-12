#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn repeter() {
        assert_eq!(Repeter(2).appliquer("ab"), "abab", "Repeter(2) sur « ab » donne « abab »");
        assert_eq!(Repeter(0).appliquer("ab"), "", "Repeter(0) donne un texte vide");
    }

    #[test]
    fn entourer() {
        assert_eq!(Entourer('*').appliquer("hop"), "*hop*", "Entourer('*') sur « hop » donne « *hop* »");
    }

    #[test]
    fn enchainer_dans_l_ordre() {
        let etapes: Vec<Box<dyn Transformation>> = vec![Box::new(Majuscules), Box::new(Entourer('*'))];
        assert_eq!(enchainer(&etapes, "hop"), "*HOP*", "majuscules puis étoiles donne « *HOP* »");
    }

    #[test]
    fn enchainer_ordre_inverse() {
        let etapes: Vec<Box<dyn Transformation>> = vec![Box::new(Repeter(2)), Box::new(Entourer('-'))];
        assert_eq!(enchainer(&etapes, "ab"), "-abab-", "répéter puis entourer donne « -abab- »");
    }

    #[test]
    fn enchainer_sans_etape() {
        let etapes: Vec<Box<dyn Transformation>> = Vec::new();
        assert_eq!(enchainer(&etapes, "inchangé"), "inchangé", "sans étape, le texte ne change pas");
    }

    #[test]
    fn construire_connu() {
        let majuscules = construire("majuscules").expect("« majuscules » est un nom connu");
        assert_eq!(majuscules.appliquer("a"), "A", "« majuscules » met en majuscules");
        let doubler = construire("doubler").expect("« doubler » est un nom connu");
        assert_eq!(doubler.appliquer("a"), "aa", "« doubler » répète deux fois");
        let etoiles = construire("etoiles").expect("« etoiles » est un nom connu");
        assert_eq!(etoiles.appliquer("a"), "*a*", "« etoiles » entoure d'étoiles");
    }

    #[test]
    fn construire_inconnu() {
        assert!(construire("inconnu").is_none(), "un nom inconnu donne None");
    }
}
