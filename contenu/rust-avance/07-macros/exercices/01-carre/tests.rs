#[cfg(test)]
mod tests {
    #[test]
    fn entier() {
        assert_eq!(carre!(4), 16, "le carré de 4 vaut 16");
    }

    #[test]
    fn decimal() {
        assert_eq!(carre!(1.5), 2.25, "le carré de 1,5 vaut 2,25");
    }

    #[test]
    fn expression_complete() {
        assert_eq!(carre!(2 + 3), 25, "carre!(2 + 3) vaut (2 + 3) * (2 + 3) = 25");
    }

    #[test]
    fn variable() {
        let n = 9;
        assert_eq!(carre!(n), 81, "le carré de la variable n (9) vaut 81");
    }
}
