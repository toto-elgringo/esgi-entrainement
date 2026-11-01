#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 10, "la grille de l'exemple contient 10 fois XMAS");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 4, "la grille de l'exemple contient 4 croix de MAS");
    }

    #[test]
    fn a_l_envers_et_chevauchement() {
        assert_eq!(partie1("XMASAMX"), 2, "XMAS à l'endroit puis à l'envers, avec le S en commun : 2 mots");
    }

    #[test]
    fn verticale_et_diagonale() {
        assert_eq!(partie1("X\nM\nA\nS"), 1, "XMAS se lit aussi de haut en bas");
        assert_eq!(partie1("X...\n.M..\n..A.\n...S"), 1, "XMAS se lit aussi en diagonale");
    }

    #[test]
    fn croix() {
        assert_eq!(partie2("M.S\n.A.\nM.S"), 1, "deux diagonales MAS qui se croisent sur le A");
        assert_eq!(partie2("S.S\n.A.\nM.M"), 1, "les diagonales peuvent se lire dans n'importe quel sens");
        assert_eq!(partie2("M.S\n.A.\nS.M"), 0, "M A M sur une diagonale : ce n'est pas une croix");
        assert_eq!(partie2("MAS"), 0, "un A au bord ne peut pas être le centre d'une croix");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "M.S\r\n.A.\r\nM.S\r\n";
        assert_eq!(partie2(entree), 1, "les fins de ligne Windows (\r\n) sont gérées");
        assert_eq!(partie1("XMAS\r\nSAMX\r\n"), 2, "les \r ne sont pas des lettres de la grille");
    }
}
