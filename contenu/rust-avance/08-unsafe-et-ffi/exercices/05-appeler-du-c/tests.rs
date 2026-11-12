#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn absolue() {
        assert_eq!(valeur_absolue(-7), 7, "abs(-7) vaut 7");
        assert_eq!(valeur_absolue(12), 12, "abs(12) vaut 12");
        assert_eq!(valeur_absolue(0), 0, "abs(0) vaut 0");
    }

    #[test]
    fn longueur() {
        assert_eq!(longueur_c("bonjour"), 7, "bonjour a 7 octets");
        assert_eq!(longueur_c(""), 0, "le texte vide a 0 octet");
        assert_eq!(longueur_c("é"), 2, "strlen compte des octets, é en fait 2");
    }
}
