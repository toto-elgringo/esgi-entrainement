#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn coupe_au_milieu() {
        let mut t = [1, 2, 3, 4, 5];
        let (a, b) = couper_en_deux(&mut t, 2);
        assert_eq!(a, [1, 2], "le premier morceau a 2 éléments");
        assert_eq!(b, [3, 4, 5], "le second morceau a le reste");
    }

    #[test]
    fn les_deux_morceaux_sont_modifiables() {
        let mut t = [1, 2, 3, 4];
        {
            let (a, b) = couper_en_deux(&mut t, 2);
            a[0] = 10;
            b[1] = 40;
        }
        assert_eq!(t, [10, 2, 3, 40], "les modifications doivent toucher le tableau d'origine");
    }

    #[test]
    fn bords() {
        let mut t = [1, 2];
        let (a, b) = couper_en_deux(&mut t, 0);
        assert!(a.is_empty(), "milieu 0 : premier morceau vide");
        assert_eq!(b, [1, 2], "milieu 0 : tout dans le second");
        let (a, b) = couper_en_deux(&mut t, 2);
        assert_eq!(a, [1, 2], "milieu = longueur : tout dans le premier");
        assert!(b.is_empty(), "milieu = longueur : second vide");
    }

    #[test]
    #[should_panic]
    fn milieu_trop_grand() {
        let mut t = [1, 2, 3];
        let _ = couper_en_deux(&mut t, 4);
    }
}
