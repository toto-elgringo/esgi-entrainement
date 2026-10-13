#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn liste_des_carres() {
        assert_eq!(carres(&[1, 2, 3]), vec![1, 4, 9], "les carrés de 1, 2, 3");
        assert_eq!(carres(&[-4]), vec![16], "le carré de -4 est 16");
        assert_eq!(carres(&[]), Vec::<i32>::new(), "liste vide : résultat vide");
    }

    #[test]
    fn filtre_des_pairs() {
        assert_eq!(seulement_pairs(&[1, 2, 3, 4, 6]), vec![2, 4, 6], "les pairs de [1, 2, 3, 4, 6]");
        assert_eq!(seulement_pairs(&[1, 3]), Vec::<i32>::new(), "aucun pair");
    }

    #[test]
    fn longueurs_des_mots() {
        assert_eq!(longueurs(&["a", "rust", "ok"]), vec![1, 4, 2], "longueurs de a, rust, ok");
        assert_eq!(longueurs(&["été"]), vec![5], "« été » fait 5 octets en UTF-8 (é = 2 octets)");
    }
}
