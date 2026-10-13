#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sans_remise() {
        assert_eq!(total_panier(3, 5), 15, "5 articles à 3 € : 15 €, pas de remise");
        assert_eq!(total_panier(4, 9), 36, "9 articles à 4 € : 36 €, pas encore de remise");
    }

    #[test]
    fn avec_remise() {
        assert_eq!(total_panier(2, 10), 10, "10 articles à 2 € : 20 € - 10 € de remise");
        assert_eq!(total_panier(5, 20), 90, "20 articles à 5 € : 100 € - 10 € de remise");
    }
}
