#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn phrase_simple() {
        assert_eq!(premier_mot("bonjour le monde"), "bonjour", "le premier mot de \"bonjour le monde\" est \"bonjour\"");
    }

    #[test]
    fn un_seul_mot() {
        assert_eq!(premier_mot("salut"), "salut", "sans espace, tout le texte est le premier mot");
    }

    #[test]
    fn texte_vide() {
        assert_eq!(premier_mot(""), "", "le premier mot d'un texte vide est vide");
    }

    #[test]
    fn avec_accents_et_emojis() {
        assert_eq!(premier_mot("été chaud"), "été", "le premier mot de \"été chaud\" est \"été\"");
        assert_eq!(premier_mot("🦀🦀 crabes"), "🦀🦀", "le premier mot de \"🦀🦀 crabes\" est \"🦀🦀\"");
    }

    #[test]
    fn depuis_une_string() {
        let phrase = String::from("Rust est rapide");
        assert_eq!(premier_mot(&phrase), "Rust", "ça marche aussi avec une String empruntée");
    }
}
