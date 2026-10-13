#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn double() {
        assert_eq!(doubler(Some(4)), Some(8), "Some(4) doublé donne Some(8)");
        assert_eq!(doubler(Some(-3)), Some(-6), "Some(-3) doublé donne Some(-6)");
        assert_eq!(doubler(None), None, "None reste None");
    }

    #[test]
    fn defaut() {
        assert_eq!(valeur_ou_defaut(Some(3), 10), 3, "il y a une valeur : 3");
        assert_eq!(valeur_ou_defaut(None, 10), 10, "pas de valeur : le défaut 10");
    }

    #[test]
    fn longueur_du_texte() {
        assert_eq!(longueur(Some("Rust")), 4, "\"Rust\" fait 4 octets");
        assert_eq!(longueur(Some("")), 0, "un texte vide fait 0 octet");
        assert_eq!(longueur(None), 0, "pas de texte : 0");
    }

    #[test]
    fn reduction() {
        assert_eq!(appliquer_reduction(Some(20), 5), Some(15), "20 - 5 = 15");
        assert_eq!(appliquer_reduction(Some(5), 8), Some(0), "5 - 8 s'arrête à 0");
        assert_eq!(appliquer_reduction(None, 5), None, "pas de prix : None");
    }
}
