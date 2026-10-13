#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cas_de_base() {
        assert_eq!(fibonacci(0), 0, "F(0) = 0");
        assert_eq!(fibonacci(1), 1, "F(1) = 1");
    }

    #[test]
    fn petites_valeurs() {
        assert_eq!(fibonacci(2), 1, "F(2) = 1");
        assert_eq!(fibonacci(7), 13, "F(7) = 13");
        assert_eq!(fibonacci(10), 55, "F(10) = 55");
    }

    #[test]
    fn valeurs_moyennes() {
        assert_eq!(fibonacci(20), 6765, "F(20) = 6765");
        assert_eq!(fibonacci(25), 75025, "F(25) = 75025");
    }
}
