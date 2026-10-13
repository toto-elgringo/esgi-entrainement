#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn negatifs() {
        assert!(contient_negatif(&[3, -1, 4]), "-1 est négatif");
        assert!(!contient_negatif(&[3, 0, 4]), "aucun négatif (0 n'est pas négatif)");
        assert!(!contient_negatif(&[]), "liste vide : aucun négatif");
    }

    #[test]
    fn majeurs() {
        assert!(!tous_majeurs(&[18, 40, 17]), "17 ans n'est pas majeur");
        assert!(tous_majeurs(&[18, 40, 65]), "tout le monde a au moins 18 ans");
        assert!(tous_majeurs(&[]), "personne : « tout le monde est majeur » est vrai");
    }

    #[test]
    fn multiples() {
        assert_eq!(premier_multiple(&[5, 9, 12, 18], 3), Some(9), "9 est le premier multiple de 3");
        assert_eq!(premier_multiple(&[5, 7], 3), None, "aucun multiple de 3");
    }

    #[test]
    fn mots_longs() {
        assert_eq!(position_premier_mot_long(&["a", "abc", "abcd"], 3), Some(1), "« abc » (indice 1) a 3 lettres");
        assert_eq!(position_premier_mot_long(&["a", "b"], 3), None, "aucun mot de 3 lettres");
    }
}
