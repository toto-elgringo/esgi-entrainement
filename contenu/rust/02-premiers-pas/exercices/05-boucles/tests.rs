#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme_pairs() {
        assert_eq!(somme_des_pairs(0), 0, "aucun nombre pair jusqu'à 0");
        assert_eq!(somme_des_pairs(1), 0, "aucun nombre pair jusqu'à 1");
        assert_eq!(somme_des_pairs(6), 12, "2 + 4 + 6 = 12");
        assert_eq!(somme_des_pairs(10), 30, "2 + 4 + 6 + 8 + 10 = 30");
    }

    #[test]
    fn puissances() {
        assert_eq!(puissance(2, 10), 1024, "2 puissance 10 = 1024");
        assert_eq!(puissance(5, 0), 1, "tout nombre puissance 0 vaut 1");
        assert_eq!(puissance(3, 4), 81, "3 puissance 4 = 81");
        assert_eq!(puissance(10, 18), 1_000_000_000_000_000_000, "10 puissance 18");
    }

    #[test]
    fn diviseurs() {
        assert_eq!(plus_petit_diviseur(2), 2, "2 est divisible par 2");
        assert_eq!(plus_petit_diviseur(15), 3, "15 = 3 × 5");
        assert_eq!(plus_petit_diviseur(49), 7, "49 = 7 × 7");
        assert_eq!(plus_petit_diviseur(13), 13, "13 est premier");
        assert_eq!(plus_petit_diviseur(1_000_000), 2, "1 000 000 est pair");
    }
}
