#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nombre_simple() {
        assert_eq!(doubler_texte("21"), 42, "le double de \"21\" est 42");
        assert_eq!(doubler_texte("0"), 0, "le double de \"0\" est 0");
    }

    #[test]
    fn avec_des_espaces() {
        assert_eq!(doubler_texte(" 21 "), 42, "les espaces autour doivent être ignorés");
        assert_eq!(doubler_texte("  5 \n"), 10, "les espaces et retours à la ligne doivent être ignorés");
    }
}
