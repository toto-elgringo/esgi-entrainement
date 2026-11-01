#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 3, "la graine 8 finit à l'emplacement 3, le plus petit de l'exemple");
    }

    #[test]
    fn partie1_fin_de_regle_exclue() {
        assert_eq!(partie1("seeds: 2 3\n\nseed-to-soil map:\n100 0 3"), 3, "la règle 100 0 3 couvre 0, 1 et 2 seulement : 3 reste 3");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 5, "la graine 30, au milieu de l'intervalle 12 à 36, finit à l'emplacement 5");
    }

    #[test]
    fn partie2_trou_entre_deux_regles() {
        assert_eq!(partie2("seeds: 5 10\n\nseed-to-soil map:\n100 0 8\n200 12 3"), 8, "les graines 8 à 11 ne sont touchées par aucune règle : le minimum est 8");
    }

    #[test]
    fn partie2_grands_intervalles() {
        assert_eq!(partie2("seeds: 3000000000 2000000000\n\nseed-to-soil map:\n10 4500000000 100"), 10, "deux milliards de graines : il faut découper l'intervalle, pas essayer chaque graine (et utiliser u64)");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie2(&entree), 5, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
