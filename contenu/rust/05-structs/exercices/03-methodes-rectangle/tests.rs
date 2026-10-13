#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn aire() {
        assert_eq!(Rectangle { largeur: 3, hauteur: 4 }.aire(), 12, "3 × 4 = 12");
        assert_eq!(Rectangle { largeur: 0, hauteur: 7 }.aire(), 0, "une largeur de 0 donne une aire de 0");
    }

    #[test]
    fn perimetre() {
        assert_eq!(Rectangle { largeur: 3, hauteur: 4 }.perimetre(), 14, "2 × (3 + 4) = 14");
        assert_eq!(Rectangle { largeur: 5, hauteur: 5 }.perimetre(), 20, "2 × (5 + 5) = 20");
    }

    #[test]
    fn contenir() {
        let grand = Rectangle { largeur: 10, hauteur: 8 };
        let petit = Rectangle { largeur: 3, hauteur: 4 };
        let trop_large = Rectangle { largeur: 11, hauteur: 2 };
        let identique = Rectangle { largeur: 10, hauteur: 8 };
        assert!(grand.peut_contenir(&petit), "10 × 8 peut contenir 3 × 4");
        assert!(!petit.peut_contenir(&grand), "3 × 4 ne peut pas contenir 10 × 8");
        assert!(!grand.peut_contenir(&trop_large), "10 × 8 ne peut pas contenir 11 × 2");
        assert!(grand.peut_contenir(&identique), "un rectangle peut contenir un rectangle identique");
    }

    #[test]
    fn carre() {
        let c = Rectangle::carre(5);
        assert_eq!(c.largeur, 5, "la largeur du carré doit valoir 5");
        assert_eq!(c.hauteur, 5, "la hauteur du carré doit valoir 5");
        assert_eq!(c.aire(), 25, "l'aire d'un carré de côté 5 vaut 25");
    }
}
