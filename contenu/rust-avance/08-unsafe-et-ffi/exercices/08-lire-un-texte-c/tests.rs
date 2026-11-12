#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn aller_retour() {
        let c = vers_c("salut").expect("salut est valide");
        let retour = unsafe { depuis_c(c.as_ptr()) };
        assert_eq!(retour, "salut", "le texte doit faire l'aller-retour");
    }

    #[test]
    fn accents() {
        let c = vers_c("café").expect("café est valide");
        assert_eq!(unsafe { depuis_c(c.as_ptr()) }, "café", "les accents doivent survivre");
    }

    #[test]
    fn zero_au_milieu() {
        assert!(vers_c("a\0b").is_none(), "un zéro au milieu doit donner None");
    }

    #[test]
    fn texte_vide() {
        let c = vers_c("").expect("le vide est valide");
        assert_eq!(unsafe { depuis_c(c.as_ptr()) }, "", "le texte vide reste vide");
    }
}
