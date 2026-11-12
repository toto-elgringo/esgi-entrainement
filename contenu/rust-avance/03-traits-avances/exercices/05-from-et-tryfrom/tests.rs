#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ebullition() {
        assert_eq!(en_fahrenheit(Celsius(100.0)), 212.0, "100 °C font 212 °F");
    }

    #[test]
    fn congelation() {
        assert_eq!(en_fahrenheit(Celsius(0.0)), 32.0, "0 °C font 32 °F");
    }

    #[test]
    fn point_commun() {
        assert_eq!(en_fahrenheit(Celsius(-40.0)), -40.0, "-40 °C font -40 °F");
    }

    #[test]
    fn from_direct() {
        let f = Fahrenheit::from(Celsius(10.0));
        assert_eq!(f.0, 50.0, "Fahrenheit::from(Celsius(10.0)) doit valoir 50");
    }

    #[test]
    fn note_valide() {
        assert_eq!(Note::try_from(15), Ok(Note(15)), "15 est une note valide");
        assert_eq!(Note::try_from(0), Ok(Note(0)), "0 est une note valide");
        assert_eq!(Note::try_from(20), Ok(Note(20)), "20 est une note valide");
    }

    #[test]
    fn note_trop_grande() {
        assert_eq!(Note::try_from(25), Err("note invalide : 25".to_string()), "25 est refusé");
    }

    #[test]
    fn note_negative() {
        assert_eq!(Note::try_from(-1), Err("note invalide : -1".to_string()), "-1 est refusé");
    }

    #[test]
    fn avec_try_into() {
        let n: Result<Note, String> = 12.try_into();
        assert_eq!(n, Ok(Note(12)), "try_into() découle de TryFrom");
    }
}
