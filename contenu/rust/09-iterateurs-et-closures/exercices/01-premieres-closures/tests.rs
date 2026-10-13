#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn positifs() {
        assert_eq!(nombre_de_positifs(&[-2, 0, 3, 5]), 2, "3 et 5 sont positifs (0 ne compte pas)");
        assert_eq!(nombre_de_positifs(&[-1, -2]), 0, "aucun positif");
    }

    #[test]
    fn pairs() {
        assert_eq!(nombre_de_pairs(&[1, 2, 4, 7]), 2, "2 et 4 sont pairs");
        assert_eq!(nombre_de_pairs(&[0, -2, 3]), 2, "0 et -2 sont pairs");
    }

    #[test]
    fn superieurs() {
        assert_eq!(nombre_superieurs_a(&[1, 5, 10, 20], 6), 2, "10 et 20 sont plus grands que 6");
        assert_eq!(nombre_superieurs_a(&[1, 5, 10, 20], 20), 0, "rien n'est strictement plus grand que 20");
        assert_eq!(nombre_superieurs_a(&[1, 5, 10, 20], 0), 4, "tout est plus grand que 0");
    }
}
