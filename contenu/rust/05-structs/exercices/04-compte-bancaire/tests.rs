#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nouveau_compte() {
        let compte = CompteBancaire::new("Alice");
        assert_eq!(compte.titulaire, "Alice", "le titulaire doit être Alice");
        assert_eq!(compte.solde(), 0, "un nouveau compte a un solde de 0");
    }

    #[test]
    fn depots() {
        let mut compte = CompteBancaire::new("Bob");
        compte.deposer(100);
        compte.deposer(50);
        assert_eq!(compte.solde(), 150, "100 + 50 = 150");
    }

    #[test]
    fn retrait_accepte() {
        let mut compte = CompteBancaire::new("Carla");
        compte.deposer(100);
        assert!(compte.retirer(30), "retirer 30 sur 100 doit réussir");
        assert_eq!(compte.solde(), 70, "il reste 70 après le retrait");
        assert!(compte.retirer(70), "on peut retirer tout le solde");
        assert_eq!(compte.solde(), 0, "le compte est vide");
    }

    #[test]
    fn retrait_refuse() {
        let mut compte = CompteBancaire::new("David");
        compte.deposer(50);
        assert!(!compte.retirer(80), "retirer 80 sur 50 doit être refusé");
        assert_eq!(compte.solde(), 50, "un retrait refusé ne change pas le solde");
    }
}
