#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn produits() {
        assert_eq!(produit(&[2, 3, 4]), 24, "2 × 3 × 4 = 24");
        assert_eq!(produit(&[-2, 3]), -6, "-2 × 3 = -6");
        assert_eq!(produit(&[5, 0, 7]), 0, "un 0 annule tout le produit");
        assert_eq!(produit(&[]), 1, "liste vide : 1");
    }

    #[test]
    fn plus_grand() {
        assert_eq!(maximum(&[3, 9, 2]), Some(9), "le plus grand de [3, 9, 2] est 9");
        assert_eq!(maximum(&[-4, -7]), Some(-4), "le plus grand de [-4, -7] est -4");
        assert_eq!(maximum(&[5]), Some(5), "un seul nombre : c'est le plus grand");
        assert_eq!(maximum(&[]), None, "liste vide : None");
    }

    #[test]
    fn croissante() {
        assert!(est_croissante(&[1, 2, 2, 5]), "[1, 2, 2, 5] est croissante (deux nombres égaux, c'est permis)");
        assert!(!est_croissante(&[1, 3, 2]), "3 puis 2 : [1, 3, 2] n'est pas croissante");
        assert!(!est_croissante(&[5, 4]), "[5, 4] n'est pas croissante");
        assert!(est_croissante(&[42]), "un seul nombre : croissante");
        assert!(est_croissante(&[]), "liste vide : croissante");
    }

    #[test]
    fn a_l_envers() {
        assert_eq!(inverser(&[1, 2, 3]), vec![3, 2, 1], "[1, 2, 3] à l'envers");
        assert_eq!(inverser(&[7]), vec![7], "un seul élément : rien ne change");
        assert_eq!(inverser(&[]), Vec::<i32>::new(), "liste vide : liste vide");
    }

    #[test]
    fn puissances() {
        assert_eq!(puissance(2, 10), 1024, "2 puissance 10 = 1024");
        assert_eq!(puissance(5, 3), 125, "5 puissance 3 = 125");
        assert_eq!(puissance(3, 0), 1, "tout nombre puissance 0 vaut 1");
        assert_eq!(puissance(10, 18), 1_000_000_000_000_000_000, "10 puissance 18");
        assert_eq!(puissance(2, 63), 9_223_372_036_854_775_808, "2 puissance 63");
    }
}
