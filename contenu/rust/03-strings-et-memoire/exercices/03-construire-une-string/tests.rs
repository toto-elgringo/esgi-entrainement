#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encadrement() {
        assert_eq!(encadrer("rust"), "[rust]", "encadrer(\"rust\") doit donner \"[rust]\"");
        assert_eq!(encadrer(""), "[]", "encadrer(\"\") doit donner \"[]\"");
        assert_eq!(encadrer("🦀"), "[🦀]", "encadrer(\"🦀\") doit donner \"[🦀]\"");
    }

    #[test]
    fn repetition() {
        assert_eq!(repeter("ab", 3), "ab-ab-ab", "repeter(\"ab\", 3) doit donner \"ab-ab-ab\"");
        assert_eq!(repeter("ab", 1), "ab", "un seul mot : pas de tiret");
        assert_eq!(repeter("ab", 0), "", "zéro fois : texte vide");
        assert_eq!(repeter("é", 2), "é-é", "repeter(\"é\", 2) doit donner \"é-é\"");
    }

    #[test]
    fn presentation() {
        assert_eq!(presenter("Alice", 20), "Alice a 20 ans", "presenter(\"Alice\", 20)");
        assert_eq!(presenter("Bob", 35), "Bob a 35 ans", "presenter(\"Bob\", 35)");
    }
}
