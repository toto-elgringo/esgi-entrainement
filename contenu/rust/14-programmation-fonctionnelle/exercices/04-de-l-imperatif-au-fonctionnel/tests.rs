#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mots_longs() {
        assert_eq!(
            mots_longs_en_majuscules("le petit chat dort sur le canapé", 4),
            vec!["PETIT", "CHAT", "DORT", "CANAPÉ"],
            "les mots d'au moins 4 lettres, en majuscules, dans l'ordre"
        );
        assert_eq!(
            mots_longs_en_majuscules("été à Noël", 3),
            vec!["ÉTÉ", "NOËL"],
            "on compte les lettres, pas les octets : « été » a 3 lettres"
        );
        assert!(mots_longs_en_majuscules("un deux", 10).is_empty(), "aucun mot de 10 lettres");
    }

    #[test]
    fn premier_negatif() {
        assert_eq!(indice_du_premier_negatif(&[3, 7, -2, 5, -8]), Some(2), "-2 est le premier négatif, à l'indice 2");
        assert_eq!(indice_du_premier_negatif(&[-1, 4]), Some(0), "le premier nombre est déjà négatif");
        assert_eq!(indice_du_premier_negatif(&[1, 2, 0]), None, "aucun négatif (0 n'est pas négatif)");
        assert_eq!(indice_du_premier_negatif(&[]), None, "liste vide : None");
    }

    #[test]
    fn hausse() {
        assert_eq!(plus_forte_hausse(&[10, 12, 11, 15, 20]), 5, "les hausses sont 2, -1, 4 et 5 : la plus forte est 5");
        assert_eq!(plus_forte_hausse(&[1, 9, 2]), 8, "de 1 à 9 : hausse de 8");
        assert_eq!(plus_forte_hausse(&[20, 15, 10]), 0, "les mesures ne font que baisser : 0");
        assert_eq!(plus_forte_hausse(&[7]), 0, "une seule mesure : 0");
        assert_eq!(plus_forte_hausse(&[]), 0, "aucune mesure : 0");
    }

    #[test]
    fn paires() {
        assert_eq!(paires_de_somme(&[1, 4, 3, 2, 5], 5), vec![(1, 4), (3, 2)], "1 + 4 et 3 + 2 font 5");
        assert_eq!(paires_de_somme(&[2, 2, 2], 4), vec![(2, 2), (2, 2), (2, 2)], "trois façons de choisir deux 2 parmi trois");
        assert_eq!(paires_de_somme(&[1, 2], 10), vec![], "aucune paire ne fait 10");
        assert_eq!(paires_de_somme(&[5], 10), vec![], "un seul nombre : aucune paire");
    }
}
