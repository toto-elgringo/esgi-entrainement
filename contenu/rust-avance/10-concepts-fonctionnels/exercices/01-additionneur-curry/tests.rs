#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn addition() {
        assert_eq!(additionneur(3)(4), 7, "additionneur(3)(4) vaut 7");
    }

    #[test]
    fn addition_negative() {
        assert_eq!(additionneur(-2)(1), -1, "additionneur(-2)(1) vaut -1");
    }

    #[test]
    fn multiplication() {
        assert_eq!(multiplieur(5)(6), 30, "multiplieur(5)(6) vaut 30");
    }

    #[test]
    fn reutilisation() {
        let triple = multiplieur(3);
        assert_eq!(triple(1) + triple(2), 9, "la même fonction sert plusieurs fois : 3 + 6");
    }
}
