#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn petites_valeurs() {
        assert_eq!(fibonacci(0), 0, "F(0) = 0");
        assert_eq!(fibonacci(1), 1, "F(1) = 1");
        assert_eq!(fibonacci(10), 55, "F(10) = 55");
    }

    #[test]
    fn grandes_valeurs() {
        assert_eq!(fibonacci(50), 12_586_269_025, "F(50) = 12 586 269 025");
        assert_eq!(fibonacci(90), 2_880_067_194_370_816_120, "F(90)");
        assert_eq!(fibonacci(92), 7_540_113_804_746_346_429, "F(92), le plus grand calculable en u64 avec cette méthode");
    }
}
