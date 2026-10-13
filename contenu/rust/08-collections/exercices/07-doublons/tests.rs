#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn detecter_doublons() {
        assert!(a_des_doublons(&[1, 2, 3, 2]), "2 apparaît deux fois");
        assert!(!a_des_doublons(&[1, 2, 3]), "aucune valeur répétée");
        assert!(!a_des_doublons(&[]), "une liste vide n'a pas de doublon");
    }

    #[test]
    fn compter_uniques() {
        assert_eq!(valeurs_uniques(&[1, 1, 2, 3, 3, 3]), 3, "trois valeurs différentes : 1, 2, 3");
        assert_eq!(valeurs_uniques(&[7, 7, 7]), 1, "une seule valeur différente");
        assert_eq!(valeurs_uniques(&[]), 0, "liste vide : 0");
    }

    #[test]
    fn communs() {
        assert_eq!(elements_communs(&[5, 1, 3, 3], &[3, 4, 5]), vec![3, 5], "3 et 5 sont dans les deux listes");
        assert_eq!(elements_communs(&[1, 2], &[3, 4]), Vec::<i32>::new(), "aucun élément commun");
        assert_eq!(elements_communs(&[9, 8, 7, 8], &[7, 8, 9, 9]), vec![7, 8, 9], "résultat trié, sans doublon");
    }
}
