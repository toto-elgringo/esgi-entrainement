#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn totaux_de_l_exemple() {
        assert_eq!(totaux_par_lutin(EXEMPLE), vec![6000, 4000, 11000, 24000, 10000], "les 5 totaux, dans l'ordre");
    }

    #[test]
    fn totaux_sans_oublier_le_dernier() {
        assert_eq!(totaux_par_lutin("1\n\n2"), vec![1, 2], "deux lutins : 1 et 2");
        assert_eq!(totaux_par_lutin("5"), vec![5], "un seul lutin");
    }

    #[test]
    fn podium_de_l_exemple() {
        assert_eq!(top3_calories(EXEMPLE), 45000, "24000 + 11000 + 10000 = 45000");
    }

    #[test]
    fn podium_incomplet() {
        assert_eq!(top3_calories("1\n\n2"), 3, "deux lutins seulement : 1 + 2");
    }

    #[test]
    fn podium_avec_le_plus_petit_ecarte() {
        assert_eq!(top3_calories("1\n\n2\n\n3\n\n4"), 9, "4 + 3 + 2 = 9, le 1 est écarté");
    }
}
