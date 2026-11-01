#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 21, "7 + 3 + 5 + 4 + 2 = 21 points");
    }

    #[test]
    fn partie1_toutes_les_issues() {
        assert_eq!(partie1("A Y"), 8, "feuille contre pierre : 2 (feuille) + 6 (gagné) = 8");
        assert_eq!(partie1("B X"), 1, "pierre contre feuille : 1 (pierre) + 0 (perdu) = 1");
        assert_eq!(partie1("C Z"), 6, "ciseaux contre ciseaux : 3 (ciseaux) + 3 (nul) = 6");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 24, "2 + 8 + 5 + 3 + 6 = 24 points");
    }

    #[test]
    fn partie2_toutes_les_issues() {
        assert_eq!(partie2("A X"), 3, "perdre contre pierre : on joue ciseaux, 3 + 0 = 3");
        assert_eq!(partie2("B Y"), 5, "nul contre feuille : on joue feuille, 2 + 3 = 5");
        assert_eq!(partie2("C Z"), 7, "gagner contre ciseaux : on joue pierre, 1 + 6 = 7");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("A Y\r\nB X\r\n"), 9, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
