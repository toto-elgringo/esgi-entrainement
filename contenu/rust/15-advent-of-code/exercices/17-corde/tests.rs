#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 44, "la queue d'une corde de 2 nœuds visite 44 cases dans l'exemple");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 13, "le dernier nœud d'une corde de 10 nœuds visite 13 cases dans l'exemple");
    }

    #[test]
    fn ligne_droite() {
        assert_eq!(partie1("R 4"), 4, "la queue suit la tête sur 3 cases, plus la case de départ");
        assert_eq!(partie2("R 4"), 1, "avec 10 nœuds, le dernier ne bouge pas si la tête n'avance que de 4");
    }

    #[test]
    fn rattrapage_en_diagonale() {
        assert_eq!(partie1("R 1\nU 2"), 2, "la queue rattrape la tête en un seul pas en diagonale");
    }

    #[test]
    fn aller_retour() {
        assert_eq!(partie1("R 3\nL 3"), 3, "une case visitée deux fois ne compte qu'une fois");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "R 4\r\nU 4\r\n";
        assert_eq!(partie1(entree), 7, "les fins de ligne Windows (\r\n) sont gérées");
    }
}
