#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn operations() {
        assert_eq!(calculer("12 + 30"), Ok(42), "12 + 30 = 42");
        assert_eq!(calculer("50 - 8"), Ok(42), "50 - 8 = 42");
        assert_eq!(calculer("7 * 6"), Ok(42), "7 * 6 = 42");
        assert_eq!(calculer("85 / 2"), Ok(42), "85 / 2 = 42 (division entière)");
        assert_eq!(calculer("-3 + 1"), Ok(-2), "les nombres négatifs sont acceptés");
        assert_eq!(calculer("  4   *   5  "), Ok(20), "les espaces en trop sont ignorés");
    }

    #[test]
    fn division_par_zero() {
        assert_eq!(calculer("8 / 0"), Err(ErreurCalcul::DivisionParZero), "on ne divise pas par zéro");
    }

    #[test]
    fn operateur_inconnu() {
        assert_eq!(
            calculer("2 ^ 3"),
            Err(ErreurCalcul::OperateurInconnu(String::from("^"))),
            "^ n'est pas un opérateur connu"
        );
    }

    #[test]
    fn nombres_invalides() {
        assert_eq!(
            calculer("deux + 2"),
            Err(ErreurCalcul::NombreInvalide(String::from("deux"))),
            "\"deux\" n'est pas un nombre"
        );
        assert_eq!(
            calculer("2 + trois"),
            Err(ErreurCalcul::NombreInvalide(String::from("trois"))),
            "\"trois\" n'est pas un nombre"
        );
    }

    #[test]
    fn formats_invalides() {
        assert_eq!(calculer("1 +"), Err(ErreurCalcul::FormatInvalide), "il manque un nombre");
        assert_eq!(calculer(""), Err(ErreurCalcul::FormatInvalide), "une expression vide est invalide");
        assert_eq!(calculer("1 + 2 + 3"), Err(ErreurCalcul::FormatInvalide), "un seul opérateur est accepté");
    }
}
