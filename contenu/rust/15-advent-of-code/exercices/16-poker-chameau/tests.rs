#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 7630, "les gains de l'exemple sans joker valent 7630");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 7443, "les gains de l'exemple avec les jokers valent 7443");
    }

    #[test]
    fn le_type_passe_avant_les_cartes() {
        assert_eq!(
            partie1("AKQT9 1\n22345 10"),
            21,
            "une paire de 2 bat une carte haute, même avec un as : 1 × 1 + 10 × 2"
        );
    }

    #[test]
    fn departage_carte_par_carte() {
        assert_eq!(
            partie1("44443 1\n3KKKK 10"),
            12,
            "deux carrés : on compare la première carte (4 bat 3), pas le carré : 10 × 1 + 1 × 2"
        );
    }

    #[test]
    fn que_des_jokers() {
        let entree = "JJJJJ 5\n22222 7";
        assert_eq!(partie1(entree), 17, "sans joker, cinq J battent cinq 2 : 7 × 1 + 5 × 2");
        assert_eq!(partie2(entree), 19, "avec les jokers, J vaut moins que 2 pour départager : 5 × 1 + 7 × 2");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "KJJ23 2\r\n77723 3\r\n";
        assert_eq!(partie1(entree), 8, "les fins de ligne Windows (\r\n) sont gérées : brelan de 7 > paire de J");
        assert_eq!(partie2(entree), 7, "avec les jokers, KJJ23 devient un brelan de K, qui bat le brelan de 7");
    }
}
