#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme_des_prix() {
        assert_eq!(total(&[10, 25, 5]), 40, "10 + 25 + 5 = 40");
        assert_eq!(total(&[]), 0, "aucun prix : total 0");
    }

    #[test]
    fn mots_longs() {
        assert_eq!(nombre_de_mots_longs(&["un", "trois", "sept"], 4), 2, "« trois » et « sept » ont au moins 4 lettres");
        assert_eq!(nombre_de_mots_longs(&["un", "deux"], 10), 0, "aucun mot de 10 lettres");
    }

    #[test]
    fn maximum() {
        assert_eq!(plus_grand(&[3, -1, 8]), Some(8), "le plus grand de [3, -1, 8] est 8");
        assert_eq!(plus_grand(&[-5, -2]), Some(-2), "le plus grand de [-5, -2] est -2");
        assert_eq!(plus_grand(&[]), None, "liste vide : None");
    }

    #[test]
    fn produit_avec_fold() {
        assert_eq!(produit(&[2, 3, 4]), 24, "2 × 3 × 4 = 24");
        assert_eq!(produit(&[]), 1, "le produit d'une liste vide vaut 1");
    }

    #[test]
    fn moyenne_des_notes() {
        assert_eq!(moyenne(&[10.0, 15.0]), Some(12.5), "(10 + 15) / 2 = 12,5");
        assert_eq!(moyenne(&[7.0]), Some(7.0), "une seule note : c'est la moyenne");
        assert_eq!(moyenne(&[]), None, "pas de note : pas de moyenne");
    }
}
