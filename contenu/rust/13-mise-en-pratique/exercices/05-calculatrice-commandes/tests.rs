#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn analyser_les_commandes_valides() {
        assert_eq!(analyser("ajoute 5"), Ok(Commande::Ajoute(5)), "ajoute 5");
        assert_eq!(analyser("  retire   3 "), Ok(Commande::Retire(3)), "les espaces en trop sont ignorés");
        assert_eq!(analyser("multiplie -2"), Ok(Commande::Multiplie(-2)), "les nombres négatifs sont acceptés");
        assert_eq!(analyser("reset"), Ok(Commande::Reset), "reset n'a pas d'argument");
    }

    #[test]
    fn analyser_les_erreurs() {
        assert_eq!(analyser("divise 2"), Err(ErreurCommande::Inconnue("divise".to_string())), "divise n'existe pas");
        assert_eq!(analyser("ajoute"), Err(ErreurCommande::ArgumentManquant("ajoute".to_string())), "ajoute sans nombre");
        assert_eq!(analyser("ajoute deux"), Err(ErreurCommande::NombreInvalide("deux".to_string())), "« deux » n'est pas un nombre");
    }

    #[test]
    fn executer_un_programme() {
        assert_eq!(executer("ajoute 5\nmultiplie 3\nretire 1"), Ok(14), "(0 + 5) × 3 - 1 = 14");
        assert_eq!(executer("ajoute 2\nreset\najoute 7"), Ok(7), "reset remet à 0");
        assert_eq!(executer(""), Ok(0), "un programme vide donne 0");
    }

    #[test]
    fn lignes_vides_ignorees() {
        assert_eq!(executer("\najoute 4\n\n  \nmultiplie 2\n"), Ok(8), "les lignes vides sont ignorées");
    }

    #[test]
    fn erreur_avec_numero_de_ligne() {
        assert_eq!(
            executer("ajoute 1\n\nmultiplie x"),
            Err((3, ErreurCommande::NombreInvalide("x".to_string()))),
            "l'erreur est à la ligne 3 (la ligne vide compte)"
        );
        assert_eq!(
            executer("ajoute 1\nsaute 2\ndivise 3"),
            Err((2, ErreurCommande::Inconnue("saute".to_string()))),
            "on s'arrête à la première erreur, ligne 2"
        );
    }
}
