#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn carres() {
        assert_eq!(carre(5), 25, "carre(5) doit valoir 25");
        assert_eq!(carre(-3), 9, "carre(-3) doit valoir 9");
        assert_eq!(carre(0), 0, "carre(0) doit valoir 0");
    }

    #[test]
    fn parite() {
        assert!(est_pair(4), "4 est pair");
        assert!(!est_pair(7), "7 est impair");
        assert!(est_pair(-2), "-2 est pair");
        assert!(est_pair(0), "0 est pair");
    }
}
