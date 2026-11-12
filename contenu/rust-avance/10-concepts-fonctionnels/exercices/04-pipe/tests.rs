#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pipe_nombres() {
        assert_eq!(5.pipe(|x| x + 1).pipe(|x| x * 2), 12, "(5 + 1) * 2 vaut 12");
    }

    #[test]
    fn pipe_change_de_type() {
        let n = 42.pipe(|x| x.to_string()).pipe(|s| s.len());
        assert_eq!(n, 2, "42 devient \"42\", dont la longueur est 2");
    }

    #[test]
    fn etiquette_simple() {
        assert_eq!(etiquette("  rust "), "<RUST>", "espaces retirés, majuscules, chevrons");
    }

    #[test]
    fn etiquette_vide() {
        assert_eq!(etiquette("   "), "<>", "un texte vide donne <>");
    }
}
