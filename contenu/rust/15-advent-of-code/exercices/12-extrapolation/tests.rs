#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 261, "les valeurs suivantes de l'exemple sont 34, 50, -40 et 217");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 9, "les valeurs précédentes de l'exemple sont -1, 1, 9 et 0");
    }

    #[test]
    fn suite_constante() {
        assert_eq!(partie1("7 7 7 7"), 7, "une suite constante continue avec la même valeur");
        assert_eq!(partie2("7 7 7 7"), 7, "une suite constante commence aussi avec la même valeur");
    }

    #[test]
    fn nombres_negatifs() {
        assert_eq!(partie1("-3 -6 -9 -12"), -15, "les nombres négatifs sont lus correctement");
        assert_eq!(partie2("-3 -6 -9 -12"), 0, "avant -3, en remontant de 3, on trouve 0");
    }

    #[test]
    fn que_des_zeros() {
        assert_eq!(partie1("0 0 0"), 0, "une suite de zéros continue avec 0");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "1 2 3\r\n10 8 6\r\n";
        assert_eq!(partie1(entree), 8, "les fins de ligne Windows (\r\n) sont gérées : 4 + 4");
        assert_eq!(partie2(entree), 12, "0 + 12");
    }
}
