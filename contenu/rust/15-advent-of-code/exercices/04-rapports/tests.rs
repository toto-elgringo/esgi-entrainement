#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 2, "seuls les rapports 1 et 4 sont sûrs");
    }

    #[test]
    fn partie1_ecarts_interdits() {
        assert_eq!(partie1("1 1 2 3"), 0, "deux niveaux égaux (écart 0) : pas sûr");
        assert_eq!(partie1("1 5 6 7"), 0, "un écart de 4 : pas sûr");
        assert_eq!(partie1("1 2 1 0"), 0, "monte puis descend : pas sûr");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 6, "en retirant un niveau, 4 rapports de plus deviennent sûrs : 6");
    }

    #[test]
    fn partie2_retirer_le_premier() {
        assert_eq!(partie2("15 11 12 13 14"), 1, "en retirant le premier niveau (15), le rapport devient sûr");
    }

    #[test]
    fn partie2_un_seul_retrait() {
        assert_eq!(partie2("1 5 6 10"), 0, "il faudrait retirer deux niveaux : pas sûr");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("1 2 3\r\n9 7 4\r\n"), 2, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
