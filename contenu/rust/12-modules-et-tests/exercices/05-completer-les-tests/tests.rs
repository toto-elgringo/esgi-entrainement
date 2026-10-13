#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn verifie_les_divisions() {
        assert_eq!(diviser(10, 2), 5, "10 / 2 = 5");
        assert_eq!(diviser(7, 2), 3, "7 / 2 = 3 en division entière");
        assert_eq!(diviser(0, 5), 0, "0 / 5 = 0");
    }

    #[test]
    #[should_panic(expected = "division par zéro")]
    fn verifie_la_panique() {
        diviser(1, 0);
    }
}
