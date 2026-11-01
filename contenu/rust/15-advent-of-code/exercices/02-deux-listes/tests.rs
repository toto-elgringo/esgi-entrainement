#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 12, "la somme des écarts des colonnes triées vaut 12");
    }

    #[test]
    fn partie1_memes_nombres() {
        assert_eq!(partie1("1   2\n2   1"), 0, "une fois triées, les deux colonnes sont identiques : écart total 0");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 34, "4 et 9 apparaissent chacun 2 fois à droite : 8 + 18 + 8 = 34");
    }

    #[test]
    fn partie2_doublons_a_gauche() {
        assert_eq!(partie2("3   3\n3   3\n3   1"), 18, "chacun des trois 3 de gauche compte : 3 × 2, trois fois = 18");
    }

    #[test]
    fn partie2_aucun_commun() {
        assert_eq!(partie2("5   6\n7   8"), 0, "aucun nombre de gauche n'apparaît à droite : 0");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("1   5\r\n8   2\r\n"), 4, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
