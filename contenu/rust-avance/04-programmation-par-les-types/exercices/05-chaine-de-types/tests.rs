#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lecture_valide() {
        assert_eq!(lire_pourcentage(" 45 "), Ok(Pourcentage(45)), "espaces ignorés");
        assert_eq!(lire_pourcentage("100"), Ok(Pourcentage(100)), "100 est valide");
    }

    #[test]
    fn lecture_invalide() {
        assert_eq!(
            lire_pourcentage("abc"),
            Err("« abc » n'est pas un nombre valide".to_string()),
            "texte qui n'est pas un nombre"
        );
        assert_eq!(
            lire_pourcentage("-5"),
            Err("« -5 » n'est pas un nombre valide".to_string()),
            "nombre négatif"
        );
        assert_eq!(lire_pourcentage("150"), Err("150 dépasse 100".to_string()), "nombre trop grand");
    }

    #[test]
    fn somme() {
        assert_eq!(somme_pourcentages(&["10", "20", "30"]), Ok(60), "somme de trois valeurs");
        assert_eq!(somme_pourcentages(&["100", "100", "100"]), Ok(300), "la somme dépasse 255 sans problème");
        assert_eq!(somme_pourcentages(&[]), Ok(0), "liste vide");
        assert_eq!(somme_pourcentages(&["10", "zz", "200"]), Err("« zz » n'est pas un nombre valide".to_string()), "première erreur renvoyée");
    }

    #[test]
    fn premier() {
        assert_eq!(premier_valide(&["x", "300", "40", "50"]), Some(Pourcentage(40)), "saute les invalides");
        assert_eq!(premier_valide(&["x", "y"]), None, "aucun valide");
    }
}
