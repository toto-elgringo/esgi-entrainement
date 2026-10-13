#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn addition() {
        assert_eq!(additionner("2", "40"), Ok(42), "2 + 40 = 42");
        assert_eq!(additionner("-5", "5"), Ok(0), "-5 + 5 = 0");
    }

    #[test]
    fn addition_impossible() {
        assert!(additionner("2", "x").is_err(), "\"x\" n'est pas un nombre");
        assert!(additionner("deux", "2").is_err(), "\"deux\" n'est pas un nombre");
    }

    #[test]
    fn moyenne() {
        assert_eq!(moyenne_de_trois("10", "20", "30"), Ok(20), "(10 + 20 + 30) / 3 = 20");
        assert_eq!(moyenne_de_trois("1", "2", "4"), Ok(2), "(1 + 2 + 4) / 3 = 2 (division entière)");
    }

    #[test]
    fn moyenne_impossible() {
        assert!(moyenne_de_trois("1", "2", "oups").is_err(), "\"oups\" n'est pas un nombre");
    }
}
