#[cfg(test)]
mod tests {
    use super::*;

    fn triple(x: i32) -> i32 {
        x * 3
    }

    #[test]
    fn deux_fois_avec_une_closure() {
        assert_eq!(appliquer_deux_fois(|x| x + 3, 10), 16, "10 + 3 + 3 = 16");
        assert_eq!(appliquer_deux_fois(|x| x * x, 3), 81, "3 au carré donne 9, puis 9 au carré donne 81");
    }

    #[test]
    fn deux_fois_avec_une_fonction() {
        assert_eq!(appliquer_deux_fois(triple, 2), 18, "le triple du triple de 2 vaut 18");
        assert_eq!(appliquer_deux_fois(double, -1), -4, "le double du double de -1 vaut -4");
    }

    #[test]
    fn a_tous() {
        assert_eq!(appliquer_a_tous(&[1, 2, 3], |x| x * x), vec![1, 4, 9], "les carrés de 1, 2 et 3");
        assert_eq!(appliquer_a_tous(&[5, -2], triple), vec![15, -6], "le triple de chaque nombre, dans l'ordre");
        assert_eq!(appliquer_a_tous(&[], triple), Vec::<i32>::new(), "liste vide : résultat vide");
    }

    #[test]
    fn compter() {
        assert_eq!(compter_si(&[3, -1, 8, 0], |x| x > 0), 2, "3 et 8 sont strictement positifs");
        assert_eq!(compter_si(&[2, 4, 6], |x| x % 2 == 0), 3, "les trois nombres sont pairs");
        assert_eq!(compter_si(&[1, 3], |x| x > 100), 0, "aucun nombre ne dépasse 100");
    }

    #[test]
    fn n_fois() {
        assert_eq!(appliquer_n_fois(|x| x * 2, 3, 1), 8, "1 doublé 3 fois donne 8");
        assert_eq!(appliquer_n_fois(|x| x + 10, 5, 0), 50, "ajouter 10 cinq fois à 0 donne 50");
        assert_eq!(appliquer_n_fois(triple, 0, 7), 7, "0 fois : 7 ne change pas");
    }
}
