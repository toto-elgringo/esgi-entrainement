#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 105, "3 mises à jour sont bien rangées, leurs pages du milieu font 34 + 55 + 16");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 144, "une fois remises dans l'ordre, les 3 autres ont pour milieu 55 + 34 + 55");
    }

    #[test]
    fn remise_en_ordre() {
        let entree = "10|20\n20|30\n10|30\n\n30,10,20";
        assert_eq!(partie1(entree), 0, "30 avant 10 ne respecte pas la règle 10|30");
        assert_eq!(partie2(entree), 20, "remise en ordre, la mise à jour devient 10,20,30 : le milieu est 20");
    }

    #[test]
    fn regles_avec_page_absente() {
        let entree = "5|9\n9|7\n\n7,3,5";
        assert_eq!(partie1(entree), 3, "une règle dont une page est absente de la mise à jour ne compte pas");
        assert_eq!(partie2(entree), 0, "aucune mise à jour à remettre en ordre");
    }

    #[test]
    fn regle_entre_pages_eloignees() {
        let entree = "1|3\n\n3,2,1";
        assert_eq!(
            partie1(entree),
            0,
            "la règle 1|3 compte même si les pages 1 et 3 ne sont pas voisines : 3,2,1 est mal rangée"
        );
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "10|20\r\n20|30\r\n10|30\r\n\r\n10,20,30\r\n30,20,10\r\n";
        assert_eq!(partie1(entree), 20, "les fins de ligne Windows (\r\n) sont gérées");
        assert_eq!(partie2(entree), 20, "les fins de ligne Windows (\r\n) sont gérées");
    }
}
