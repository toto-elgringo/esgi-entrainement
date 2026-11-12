#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn total_simple() {
        assert_eq!(block_on(total_panier(&["pain", "lait", "pain"])), 5, "total_panier de pain, lait, pain");
    }

    #[test]
    fn total_vide_et_inconnu() {
        assert_eq!(block_on(total_panier(&[])), 0, "total_panier d'une liste vide");
        assert_eq!(block_on(total_panier(&["caviar", "pain"])), 2, "un article inconnu vaut 0");
    }

    #[test]
    fn plus_cher_liste() {
        assert_eq!(block_on(plus_cher(&["pain", "fromage", "lait"])), 5, "plus_cher avec du fromage");
        assert_eq!(block_on(plus_cher(&["lait", "pain"])), 2, "plus_cher de lait, pain");
    }

    #[test]
    fn plus_cher_vide() {
        assert_eq!(block_on(plus_cher(&[])), 0, "plus_cher d'une liste vide");
    }
}
