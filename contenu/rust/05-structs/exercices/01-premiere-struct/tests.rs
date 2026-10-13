#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creation() {
        let livre = creer_livre("Dune", 896);
        assert_eq!(livre.titre, "Dune", "le titre doit être celui donné");
        assert_eq!(livre.pages, 896, "le nombre de pages doit être celui donné");
    }

    #[test]
    fn livres_longs() {
        assert!(est_long(&creer_livre("Dune", 896)), "896 pages : c'est long");
        assert!(!est_long(&creer_livre("Le Petit Prince", 96)), "96 pages : ce n'est pas long");
        assert!(!est_long(&creer_livre("Pile", 300)), "300 pages pile : ce n'est pas plus de 300");
    }
}
