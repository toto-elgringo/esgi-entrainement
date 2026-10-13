#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ouverture() {
        let compte = Compte::ouvrir("Léa");
        assert_eq!(compte.titulaire(), "Léa", "le titulaire est Léa");
        assert_eq!(compte.solde(), 0, "un nouveau compte est vide");
    }

    #[test]
    fn depots() {
        let mut compte = Compte::ouvrir("Sam");
        compte.deposer(100);
        compte.deposer(50);
        assert_eq!(compte.solde(), 150, "100 + 50 = 150");
    }

    #[test]
    fn retrait_possible() {
        let mut compte = Compte::ouvrir("Sam");
        compte.deposer(100);
        assert!(compte.retirer(30), "retirer 30 sur 100 doit réussir");
        assert_eq!(compte.solde(), 70, "100 - 30 = 70");
        assert!(compte.retirer(70), "on peut vider le compte");
        assert_eq!(compte.solde(), 0, "le compte est vide");
    }

    #[test]
    fn retrait_refuse() {
        let mut compte = Compte::ouvrir("Sam");
        compte.deposer(20);
        assert!(!compte.retirer(50), "retirer 50 sur 20 doit échouer");
        assert_eq!(compte.solde(), 20, "un retrait refusé ne change pas le solde");
    }
}
