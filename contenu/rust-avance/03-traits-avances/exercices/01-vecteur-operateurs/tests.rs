#[cfg(test)]
mod tests {
    use super::*;

    fn v(x: f64, y: f64) -> Vecteur {
        Vecteur { x, y }
    }

    #[test]
    fn addition() {
        assert_eq!(v(1.0, 2.0) + v(3.0, 4.0), v(4.0, 6.0), "(1, 2) + (3, 4) doit valoir (4, 6)");
    }

    #[test]
    fn soustraction() {
        assert_eq!(v(5.0, 5.0) - v(2.0, 1.0), v(3.0, 4.0), "(5, 5) - (2, 1) doit valoir (3, 4)");
    }

    #[test]
    fn oppose() {
        assert_eq!(-v(1.0, -2.0), v(-1.0, 2.0), "l'opposé de (1, -2) est (-1, 2)");
    }

    #[test]
    fn multiplication() {
        assert_eq!(v(1.5, 2.0) * 2.0, v(3.0, 4.0), "(1.5, 2) * 2 doit valoir (3, 4)");
    }

    #[test]
    fn combinaison() {
        let r = -(v(1.0, 1.0) + v(2.0, 3.0)) * 2.0;
        assert_eq!(r, v(-6.0, -8.0), "-((1, 1) + (2, 3)) * 2 doit valoir (-6, -8)");
    }
}
