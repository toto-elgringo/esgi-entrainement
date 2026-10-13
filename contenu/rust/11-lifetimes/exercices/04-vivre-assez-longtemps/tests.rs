#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn longueurs() {
        assert_eq!(longueur_du_plus_long("bonjour", "salut"), 7, "bonjour fait 7 lettres");
        assert_eq!(longueur_du_plus_long("a", "abcd"), 4, "abcd fait 4 lettres");
        assert_eq!(longueur_du_plus_long("", ""), 0, "deux textes vides : 0");
    }

    #[test]
    fn premiers_mots() {
        assert_eq!(premier_mot_en_majuscules("bonjour le monde"), "BONJOUR", "premier mot en majuscules");
        assert_eq!(premier_mot_en_majuscules("  rust  "), "RUST", "les espaces sont ignorés");
        assert_eq!(premier_mot_en_majuscules(""), "", "pas de mot : texte vide");
    }
}
