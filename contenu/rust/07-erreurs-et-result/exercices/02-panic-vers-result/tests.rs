#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn divisions_possibles() {
        assert_eq!(diviser(10, 2), Ok(5), "10 / 2 = Ok(5)");
        assert_eq!(diviser(-9, 3), Ok(-3), "-9 / 3 = Ok(-3)");
    }

    #[test]
    fn division_par_zero() {
        assert_eq!(
            diviser(1, 0),
            Err(String::from("division par zéro")),
            "diviser par 0 doit renvoyer Err(\"division par zéro\") au lieu de paniquer"
        );
    }
}
