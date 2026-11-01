#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 6, "6 mesures sont plus profondes que la précédente");
    }

    #[test]
    fn partie1_toujours_en_baisse() {
        assert_eq!(partie1("5\n4\n3\n2"), 0, "aucune mesure n'augmente");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 6, "6 sommes de trois mesures augmentent");
    }

    #[test]
    fn partie2_trop_court() {
        assert_eq!(partie2("1\n2\n3"), 0, "une seule fenêtre de trois : rien à comparer");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(partie1("1\r\n2\r\n3"), 2, "les fins de ligne Windows (\r\n) sont gérées");
    }
}
