#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 113332, "après 25 clignements, l'exemple compte 113332 cailloux");
    }

    #[test]
    fn partie1_zero() {
        assert_eq!(partie1("0"), 19778, "un seul caillou 0 donne 19778 cailloux après 25 clignements");
    }

    #[test]
    fn partie1_zeros_de_tete() {
        assert_eq!(partie1("1000"), 32954, "1000 se coupe en 10 et 0 (pas « 00 ») : 32954 cailloux après 25 clignements");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 135338965633660, "après 75 clignements, l'exemple compte 135338965633660 cailloux");
    }

    #[test]
    fn partie2_zero() {
        assert_eq!(partie2("0"), 22938365706844, "un seul caillou 0 donne 22938365706844 cailloux après 75 clignements");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("0 1000\r\n"), 52732, "la fin de ligne Windows (\r\n) est ignorée");
    }
}
