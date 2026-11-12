#[cfg(test)]
mod tests {
    #[test]
    fn vide() {
        assert_eq!(compter!(), 0usize, "aucun jeton");
    }

    #[test]
    fn des_mots() {
        assert_eq!(compter!(a b c), 3usize, "trois jetons");
    }

    #[test]
    fn des_nombres() {
        assert_eq!(compter!(1 2 3 4 5), 5usize, "cinq jetons");
    }

    #[test]
    fn expression() {
        assert_eq!(compter!(1 + 2), 3usize, "1, + et 2 sont trois jetons");
    }

    #[test]
    fn groupe_parentheses() {
        assert_eq!(compter!((a b c) d), 2usize, "des parenthèses forment un seul jeton");
    }
}
