#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn port_valide() {
        assert_eq!(lire_port("3000"), 3000, "\"3000\" est un port valide");
        assert_eq!(lire_port("65535"), 65535, "65535 est le plus grand port possible");
    }

    #[test]
    fn port_invalide_par_defaut() {
        assert_eq!(lire_port("abc"), 8080, "\"abc\" n'est pas un port : 8080 par défaut");
        assert_eq!(lire_port("70000"), 8080, "70000 ne tient pas dans un u16 : 8080 par défaut");
        assert_eq!(lire_port(""), 8080, "un texte vide donne 8080 par défaut");
    }

    #[test]
    fn port_obligatoire_valide() {
        assert_eq!(lire_port_obligatoire("443"), 443, "\"443\" est un port valide");
    }

    #[test]
    #[should_panic(expected = "le port doit être un nombre entre 0 et 65535")]
    fn port_obligatoire_invalide() {
        lire_port_obligatoire("abc");
    }
}
