#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn carres() {
        assert_eq!(somme_des_carres(&[1, 2, 3]), 14, "1 + 4 + 9 = 14");
        assert_eq!(somme_des_carres(&[-4]), 16, "le carré de -4 est 16");
        assert_eq!(somme_des_carres(&[]), 0, "liste vide : 0");
    }

    #[test]
    fn voyelles() {
        assert_eq!(compter_voyelles("programmation"), 5, "o, a, a, i, o : 5 voyelles");
        assert_eq!(compter_voyelles("rythme"), 2, "y et e : 2 voyelles");
        assert_eq!(compter_voyelles("xkcd"), 0, "aucune voyelle");
        assert_eq!(compter_voyelles(""), 0, "texte vide : 0");
    }

    #[test]
    fn envers() {
        assert_eq!(inverser("rust"), "tsur", "« rust » à l'envers donne « tsur »");
        assert_eq!(inverser("Noël"), "lëoN", "les lettres accentuées restent entières");
        assert_eq!(inverser("kayak"), "kayak", "un palindrome ne change pas");
        assert_eq!(inverser(""), "", "texte vide : texte vide");
    }

    #[test]
    fn plus_grand() {
        assert_eq!(maximum(&[3, -1, 8]), Some(8), "le plus grand de [3, -1, 8] est 8");
        assert_eq!(maximum(&[-5, -2, -9]), Some(-2), "le plus grand de [-5, -2, -9] est -2");
        assert_eq!(maximum(&[7]), Some(7), "un seul nombre : c'est le plus grand");
        assert_eq!(maximum(&[]), None, "liste vide : None");
    }

    #[test]
    fn moyennes() {
        assert_eq!(moyenne(&[12.0, 15.0, 9.0]), Some(12.0), "(12 + 15 + 9) / 3 = 12");
        assert_eq!(moyenne(&[7.5]), Some(7.5), "une seule note : c'est la moyenne");
        assert_eq!(moyenne(&[10.0, 11.0]), Some(10.5), "(10 + 11) / 2 = 10,5");
        assert_eq!(moyenne(&[]), None, "pas de note : pas de moyenne");
    }
}
