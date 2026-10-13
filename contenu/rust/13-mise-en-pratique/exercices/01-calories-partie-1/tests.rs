#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exemple_de_l_enonce() {
        assert_eq!(calories_max(EXEMPLE), 24000, "le 4e lutin porte 24000 calories");
    }

    #[test]
    fn le_dernier_lutin_est_le_plus_charge() {
        assert_eq!(calories_max("100\n200\n\n50\n\n1000"), 1000, "le dernier lutin (1000) ne doit pas être oublié");
    }

    #[test]
    fn un_seul_lutin() {
        assert_eq!(calories_max("5\n5"), 10, "un seul lutin qui porte 5 + 5");
    }

    #[test]
    fn fins_de_ligne_windows() {
        assert_eq!(calories_max("1\r\n2\r\n\r\n10"), 10, "les fins de ligne Windows (\\r\\n) sont gérées");
    }

    #[test]
    fn entree_vide() {
        assert_eq!(calories_max(""), 0, "aucun lutin : 0");
    }
}
