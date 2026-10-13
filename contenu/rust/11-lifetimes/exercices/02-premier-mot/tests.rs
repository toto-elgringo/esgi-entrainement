#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn premier() {
        assert_eq!(premier_mot("Bonjour tout le monde"), "Bonjour", "le premier mot est Bonjour");
        assert_eq!(premier_mot("   seul  "), "seul", "les espaces en trop sont ignorés");
        assert_eq!(premier_mot(""), "", "pas de mot : texte vide");
    }

    #[test]
    fn dernier() {
        assert_eq!(dernier_mot("Bonjour tout le monde"), "monde", "le dernier mot est monde");
        assert_eq!(dernier_mot("Rust  "), "Rust", "les espaces en trop sont ignorés");
        assert_eq!(dernier_mot("   "), "", "pas de mot : texte vide");
    }

    #[test]
    fn emprunte_a_une_string() {
        let phrase = String::from("Rust est rapide");
        let mot = premier_mot(&phrase);
        assert_eq!(mot, "Rust", "fonctionne aussi avec une String empruntée");
    }
}
