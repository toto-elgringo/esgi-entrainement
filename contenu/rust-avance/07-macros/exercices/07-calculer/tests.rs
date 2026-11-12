#[cfg(test)]
mod tests {
    #[test]
    fn addition() {
        assert_eq!(calculer!(2 plus 3), 5, "2 plus 3 vaut 5");
    }

    #[test]
    fn soustraction() {
        assert_eq!(calculer!(10 moins 4), 6, "10 moins 4 vaut 6");
    }

    #[test]
    fn multiplication() {
        let n = 6;
        assert_eq!(calculer!(n fois 7), 42, "6 fois 7 vaut 42");
    }

    #[test]
    fn division() {
        assert_eq!(calculer!(9 diviser 3), Some(3), "9 diviser 3 vaut Some(3)");
    }

    #[test]
    fn division_par_zero() {
        let zero = 0;
        assert_eq!(calculer!(9 diviser zero), None, "diviser par 0 donne None");
    }
}
