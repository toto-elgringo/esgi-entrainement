#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn commandes_reussies() {
        assert_eq!(commander("pomme", 3), Ok(6), "3 pommes à 2 € = 6 €");
        assert_eq!(commander("lait", 5), Ok(20), "5 laits à 4 € = 20 € (tout le stock)");
    }

    #[test]
    fn stock_insuffisant() {
        assert_eq!(commander("pain", 1), Err(ErreurCommande::StockInsuffisant), "il n'y a plus de pain");
        assert_eq!(commander("pomme", 11), Err(ErreurCommande::StockInsuffisant), "il n'y a que 10 pommes");
    }

    #[test]
    fn produit_inconnu() {
        assert_eq!(commander("chocolat", 1), Err(ErreurCommande::ProduitInconnu), "le chocolat n'est pas vendu ici");
        assert_eq!(commander("chocolat", 0), Err(ErreurCommande::ProduitInconnu), "un produit inconnu reste inconnu, même pour 0");
    }
}
