#[cfg(test)]
mod tests {
    use super::*;

    fn proche(a: f64, b: f64) -> bool {
        (a - b).abs() < 1e-9
    }

    #[test]
    fn aire_cercle() {
        assert!(proche(Forme::Cercle { rayon: 1.0 }.aire(), PI), "un cercle de rayon 1 a une aire de π");
        assert!(proche(Forme::Cercle { rayon: 2.0 }.aire(), 4.0 * PI), "un cercle de rayon 2 a une aire de 4π");
    }

    #[test]
    fn aire_rectangle() {
        assert!(proche(Forme::Rectangle { largeur: 3.0, hauteur: 4.0 }.aire(), 12.0), "3 × 4 = 12");
    }

    #[test]
    fn aire_triangle() {
        assert!(proche(Forme::Triangle(6.0, 4.0).aire(), 12.0), "6 × 4 / 2 = 12");
        assert!(proche(Forme::Triangle(3.0, 3.0).aire(), 4.5), "3 × 3 / 2 = 4,5");
    }

    #[test]
    fn noms() {
        assert_eq!(Forme::Cercle { rayon: 1.0 }.nom(), "cercle", "nom du cercle");
        assert_eq!(Forme::Rectangle { largeur: 1.0, hauteur: 1.0 }.nom(), "rectangle", "nom du rectangle");
        assert_eq!(Forme::Triangle(1.0, 1.0).nom(), "triangle", "nom du triangle");
    }
}
