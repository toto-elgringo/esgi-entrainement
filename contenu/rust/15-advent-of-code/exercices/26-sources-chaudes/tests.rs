#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 14, "les 7 lignes de l'exemple donnent 14 possibilités en tout");
    }

    #[test]
    fn partie1_une_ligne() {
        assert_eq!(partie1("?#?.#?? 2,1,1"), 2, "?#?.#?? 2,1,1 a 2 possibilités : ##..#.# et .##.#.#");
    }

    #[test]
    fn partie1_rien_d_inconnu() {
        assert_eq!(partie1("#.##..# 1,2,1"), 1, "sans ?, il y a exactement 1 possibilité");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 17967, "une fois dépliées, les lignes de l'exemple donnent 17967 possibilités");
    }

    #[test]
    fn partie2_une_ligne() {
        assert_eq!(partie2("??##?.?? 4,1"), 2500, "??##?.?? 4,1 dépliée (5 copies reliées par des ?) a 2500 possibilités");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie1(&entree), 14, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
