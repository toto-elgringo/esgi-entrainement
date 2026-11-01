#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 22, "le chemin le moins risqué de l'exemple a un risque de 22");
    }

    #[test]
    fn partie1_il_faut_remonter() {
        assert_eq!(partie1("19111\n19191\n19191\n11191"), 13, "le meilleur chemin remonte vers le haut : risque 13 (aller seulement à droite et en bas donne 15)");
    }

    #[test]
    fn partie1_une_seule_case() {
        assert_eq!(partie1("8"), 0, "le risque de la case de départ ne compte pas : 0");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 227, "sur la carte agrandie 5 × 5, le risque minimal de l'exemple est 227");
    }

    #[test]
    fn partie2_une_seule_case() {
        assert_eq!(partie2("8"), 37, "la carte 8 agrandie (8, 9, 1, 2…) donne un risque minimal de 37 : au-delà de 9, on revient à 1");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie1(&entree), 22, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
