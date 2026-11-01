#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 5977, "après 80 jours, l'exemple compte 5977 poissons");
    }

    #[test]
    fn partie1_un_bebe() {
        assert_eq!(partie1("8"), 768, "un seul poisson au minuteur 8 donne 768 poissons après 80 jours");
    }

    #[test]
    fn partie1_minuteur_zero() {
        assert_eq!(partie1("0"), 1421, "un poisson au minuteur 0 donne naissance dès le premier jour : 1421 poissons après 80 jours");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 27125064097, "après 256 jours, l'exemple compte 27125064097 poissons");
    }

    #[test]
    fn partie2_un_bebe() {
        assert_eq!(partie2("8"), 3369186778, "un seul poisson au minuteur 8 donne 3369186778 poissons après 256 jours");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("1,2\r\n"), 2592, "la fin de ligne Windows (\r\n) est ignorée");
    }
}
