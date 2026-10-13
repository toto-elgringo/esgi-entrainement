#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn enfants() {
        assert_eq!(tarif(0), 5, "un bébé paie 5 €");
        assert_eq!(tarif(11), 5, "à 11 ans on paie 5 €");
    }

    #[test]
    fn jeunes() {
        assert_eq!(tarif(12), 8, "à 12 ans on paie 8 €");
        assert_eq!(tarif(25), 8, "à 25 ans on paie encore 8 €");
    }

    #[test]
    fn adultes() {
        assert_eq!(tarif(26), 12, "à 26 ans on paie 12 €");
        assert_eq!(tarif(64), 12, "à 64 ans on paie 12 €");
    }

    #[test]
    fn seniors() {
        assert_eq!(tarif(65), 6, "à 65 ans on paie 6 €");
        assert_eq!(tarif(90), 6, "à 90 ans on paie 6 €");
    }
}
