#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn texte_simple() {
        assert_eq!(inverser("rust"), "tsur", "\"rust\" à l'envers donne \"tsur\"");
        assert_eq!(inverser("kayak"), "kayak", "un palindrome reste identique");
    }

    #[test]
    fn textes_courts() {
        assert_eq!(inverser(""), "", "un texte vide reste vide");
        assert_eq!(inverser("a"), "a", "un seul caractère reste identique");
    }

    #[test]
    fn accents_et_emojis() {
        assert_eq!(inverser("Hé🦀"), "🦀éH", "chaque caractère doit rester entier");
        assert_eq!(inverser("été"), "été", "\"été\" à l'envers donne \"été\"");
    }

    #[test]
    fn double_inversion() {
        let texte = "Bonjour 🦀 !";
        assert_eq!(inverser(&inverser(texte)), texte, "inverser deux fois redonne le texte de départ");
    }
}
