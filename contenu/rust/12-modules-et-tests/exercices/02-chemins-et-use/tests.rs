#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn menu_simple() {
        assert_eq!(menu(), "salade puis tarte", "le menu simple");
    }

    #[test]
    fn plat_du_jour() {
        assert_eq!(restaurant::plats::du_jour(), "steak", "le module restaurant::plats doit proposer un steak");
    }

    #[test]
    fn menu_avec_plat() {
        assert_eq!(menu_complet(), "salade, steak puis tarte", "le menu complet");
    }
}
