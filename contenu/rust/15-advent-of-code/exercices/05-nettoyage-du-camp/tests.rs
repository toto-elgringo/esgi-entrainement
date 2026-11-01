#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 3, "3 paires où une plage contient entièrement l'autre");
    }

    #[test]
    fn partie1_dans_les_deux_sens() {
        assert_eq!(partie1("2-9,3-7"), 1, "la première plage contient la seconde");
        assert_eq!(partie1("3-7,2-9"), 1, "la seconde plage contient la première");
    }

    #[test]
    fn partie1_chevauchement_partiel() {
        assert_eq!(partie1("4-6,6-8"), 0, "un seul emplacement en commun : aucune plage ne contient l'autre");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 5, "5 paires ont au moins un emplacement en commun");
    }

    #[test]
    fn partie2_plages_qui_se_touchent() {
        assert_eq!(partie2("4-6,6-8"), 1, "l'emplacement 6 est dans les deux plages");
        assert_eq!(partie2("4-6,7-8"), 0, "6 et 7 sont voisins mais aucun emplacement n'est commun");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie2("1-3,2-4\r\n5-5,1-9\r\n"), 2, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
