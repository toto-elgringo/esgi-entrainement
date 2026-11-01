#[cfg(test)]
mod tests {
    use super::*;

    const DESCENTE: &str = "SbcdefghaabcdefghijklmnopqrstuvwxyE";

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 27, "il faut 27 pas pour aller de S à E dans l'exemple");
    }

    #[test]
    fn partie1_une_ligne() {
        assert_eq!(partie1("SabcdefghijklmnopqrstuvwxyE"), 26, "S compte comme a et E comme z : 26 pas sur cette ligne");
    }

    #[test]
    fn partie1_grande_descente() {
        assert_eq!(partie1(DESCENTE), 34, "on peut descendre de h à a d'un seul pas : 34 pas");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 25, "en partant de la meilleure case a, il ne faut que 25 pas");
    }

    #[test]
    fn partie2_grande_descente() {
        assert_eq!(partie2(DESCENTE), 25, "la meilleure case a est le second a du milieu : 25 pas");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie1(&entree), 27, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
