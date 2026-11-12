#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn conversions() {
        assert_eq!(Metres::from(Kilometres(1.5)), Metres(1500.0), "1,5 km en mètres");
        assert_eq!(Kilometres::from(Metres(2500.0)), Kilometres(2.5), "2500 m en kilomètres");
    }

    #[test]
    fn addition() {
        assert_eq!(Metres(100.0) + Metres(50.5), Metres(150.5), "addition de mètres");
    }

    #[test]
    fn affichage() {
        assert_eq!(format!("{}", Metres(12.5)), "12.5 m", "affichage des mètres");
        assert_eq!(format!("{}", Kilometres(2.5)), "2.5 km", "affichage des kilomètres");
    }

    #[test]
    fn total() {
        let etapes = [Metres(10.0), Metres(20.0), Metres(5.5)];
        assert_eq!(distance_totale(&etapes), Metres(35.5), "somme des étapes");
        assert_eq!(distance_totale(&[]), Metres(0.0), "liste vide");
    }
}
