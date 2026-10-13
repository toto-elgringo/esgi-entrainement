#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn affichage_debug() {
        let p = Point { x: 1, y: 2 };
        assert_eq!(format!("{:?}", p), "Point { x: 1, y: 2 }", "affichage Debug d'un Point");
    }

    #[test]
    fn copie_avec_clone() {
        let a = Point { x: 3, y: 4 };
        let b = a.clone();
        assert_eq!(a, b, "la copie est égale à l'original");
    }

    #[test]
    fn comparaison() {
        assert_ne!(Point { x: 1, y: 2 }, Point { x: 2, y: 1 }, "(1, 2) et (2, 1) sont différents");
    }

    #[test]
    fn valeur_par_defaut() {
        assert_eq!(Point::default(), Point { x: 0, y: 0 }, "le point par défaut est (0, 0)");
    }
}
