#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn division() {
        assert_eq!(diviser(10, 2), Some(5), "10 / 2 = 5");
        assert_eq!(diviser(-9, 3), Some(-3), "-9 / 3 = -3");
        assert_eq!(diviser(7, 0), None, "diviser par 0 est impossible : None");
    }

    #[test]
    fn division_ou_zero() {
        assert_eq!(diviser_ou_zero(9, 3), 3, "9 / 3 = 3");
        assert_eq!(diviser_ou_zero(7, 0), 0, "division impossible : 0");
    }

    #[test]
    fn premiere_lettre_du_mot() {
        assert_eq!(premiere_lettre("Rust"), Some('R'), "la première lettre de Rust est R");
        assert_eq!(premiere_lettre("été"), Some('é'), "la première lettre de été est é");
        assert_eq!(premiere_lettre(""), None, "un mot vide n'a pas de première lettre");
    }
}
