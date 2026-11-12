#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trois_valeurs() {
        assert_eq!(doubler(vec![1, 2, 3]), vec![2, 4, 6], "chaque valeur est doublée, dans l'ordre");
    }

    #[test]
    fn liste_vide() {
        assert_eq!(doubler(vec![]), Vec::<i32>::new(), "une liste vide donne une liste vide");
    }

    #[test]
    fn beaucoup_de_valeurs() {
        let valeurs: Vec<i32> = (0..50).collect();
        let attendu: Vec<i32> = (0..50).map(|v| v * 2).collect();
        assert_eq!(doubler(valeurs), attendu, "l'ordre des résultats suit l'ordre des valeurs");
    }

    #[test]
    fn valeurs_negatives() {
        assert_eq!(doubler(vec![-5, 0, 7]), vec![-10, 0, 14], "les négatifs sont doublés aussi");
    }
}
