#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero() {
        assert_eq!(somme_jusqua(0), 0, "la somme jusqu'à 0 vaut 0");
    }

    #[test]
    fn petites_valeurs() {
        assert_eq!(somme_jusqua(1), 1, "somme_jusqua(1) doit valoir 1");
        assert_eq!(somme_jusqua(4), 10, "somme_jusqua(4) doit valoir 1 + 2 + 3 + 4 = 10");
    }

    #[test]
    fn grandes_valeurs() {
        assert_eq!(somme_jusqua(10), 55, "somme_jusqua(10) doit valoir 55");
        assert_eq!(somme_jusqua(100), 5050, "somme_jusqua(100) doit valoir 5050");
    }
}
