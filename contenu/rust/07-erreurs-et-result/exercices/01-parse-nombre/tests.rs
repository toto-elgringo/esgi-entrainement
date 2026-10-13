#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nombres_valides() {
        assert_eq!(lire_nombre("42"), Ok(42), "\"42\" donne Ok(42)");
        assert_eq!(lire_nombre("-15"), Ok(-15), "\"-15\" donne Ok(-15)");
        assert_eq!(lire_nombre(" 7 "), Ok(7), "les espaces autour doivent être ignorés");
    }

    #[test]
    fn textes_invalides() {
        assert!(lire_nombre("abc").is_err(), "\"abc\" n'est pas un nombre");
        assert!(lire_nombre("").is_err(), "un texte vide n'est pas un nombre");
        assert!(lire_nombre("3.5").is_err(), "\"3.5\" n'est pas un entier");
    }

    #[test]
    fn valeur_par_defaut() {
        assert_eq!(lire_ou_zero("12"), 12, "\"12\" donne 12");
        assert_eq!(lire_ou_zero("douze"), 0, "\"douze\" n'est pas un nombre : 0");
    }
}
