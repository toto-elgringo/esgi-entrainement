#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn positions() {
        assert_eq!(positions_de(&[7, 3, 7, 1], 7), vec![0, 2], "7 est aux indices 0 et 2");
        assert_eq!(positions_de(&[7, 3, 7, 1], 5), Vec::<usize>::new(), "5 n'apparaît pas");
    }

    #[test]
    fn scalaire() {
        assert_eq!(produit_scalaire(&[1, 2, 3], &[4, 5, 6]), 32, "1×4 + 2×5 + 3×6 = 32");
        assert_eq!(produit_scalaire(&[2, 2, 2], &[3]), 6, "zip s'arrête à la liste la plus courte : 2×3 = 6");
        assert_eq!(produit_scalaire(&[], &[]), 0, "listes vides : 0");
    }

    #[test]
    fn numerotation() {
        assert_eq!(
            numeroter(&["pain", "lait"]),
            vec!["1. pain".to_string(), "2. lait".to_string()],
            "numérotation à partir de 1"
        );
        assert_eq!(numeroter(&[]), Vec::<String>::new(), "aucun mot : liste vide");
    }
}
