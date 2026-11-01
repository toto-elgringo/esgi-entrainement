#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 134, "c + P + y + M + g + r = 3 + 42 + 25 + 39 + 7 + 18 = 134");
    }

    #[test]
    fn partie1_priorites() {
        assert_eq!(partie1("aa"), 1, "« a » a la priorité 1");
        assert_eq!(partie1("zz"), 26, "« z » a la priorité 26");
        assert_eq!(partie1("AA"), 27, "« A » a la priorité 27");
        assert_eq!(partie1("ZZ"), 52, "« Z » a la priorité 52");
    }

    #[test]
    fn partie1_majuscules_et_minuscules() {
        assert_eq!(partie1("aBbA"), 0, "aucun objet commun : « a » et « A » sont deux objets différents");
        assert_eq!(partie1("xaBcdeQqLxfg"), 24, "« x » est le seul objet présent dans les deux poches");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 50, "les badges K (37) et m (13) donnent 50");
    }

    #[test]
    fn partie2_un_groupe() {
        assert_eq!(partie2("abcQ\nQdef\nghQi"), 43, "« Q » est le seul objet commun aux trois sacs : priorité 43");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("abca\r\nXyzX\r\n"), 51, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
