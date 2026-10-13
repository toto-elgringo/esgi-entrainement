#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nouveau_compte() {
        let compte = Compte::nouveau("Léa");
        assert_eq!(compte.titulaire(), "Léa", "le titulaire est Léa");
        assert_eq!(compte.solde(), 0, "un nouveau compte est vide");
        assert!(compte.historique().is_empty(), "un nouveau compte n'a pas d'historique");
    }

    #[test]
    fn depot_et_retrait() {
        let mut compte = Compte::nouveau("Sam");
        assert_eq!(compte.appliquer(Operation::Depot(100)), Ok(100), "après un dépôt de 100, le solde est 100");
        assert_eq!(compte.appliquer(Operation::Retrait(30)), Ok(70), "après un retrait de 30, le solde est 70");
        assert_eq!(
            compte.historique(),
            &[Operation::Depot(100), Operation::Retrait(30)],
            "l'historique garde les deux opérations dans l'ordre"
        );
    }

    #[test]
    fn montant_nul_refuse() {
        let mut compte = Compte::nouveau("Sam");
        assert_eq!(compte.appliquer(Operation::Depot(0)), Err(ErreurBancaire::MontantNul), "un dépôt de 0 est refusé");
        assert_eq!(compte.appliquer(Operation::Retrait(0)), Err(ErreurBancaire::MontantNul), "un retrait de 0 est refusé");
        assert!(compte.historique().is_empty(), "une opération refusée n'entre pas dans l'historique");
    }

    #[test]
    fn solde_insuffisant() {
        let mut compte = Compte::nouveau("Sam");
        compte.appliquer(Operation::Depot(50)).unwrap();
        assert_eq!(
            compte.appliquer(Operation::Retrait(80)),
            Err(ErreurBancaire::SoldeInsuffisant { solde: 50, demande: 80 }),
            "retirer 80 avec 50 sur le compte est refusé"
        );
        assert_eq!(compte.solde(), 50, "un retrait refusé ne change pas le solde");
        assert_eq!(compte.historique().len(), 1, "un retrait refusé n'entre pas dans l'historique");
    }

    #[test]
    fn plusieurs_operations() {
        let mut compte = Compte::nouveau("Sam");
        let operations = [Operation::Depot(100), Operation::Retrait(40), Operation::Depot(10)];
        assert_eq!(compte.appliquer_tout(&operations), Ok(70), "100 - 40 + 10 = 70");
    }

    #[test]
    fn arret_a_la_premiere_erreur() {
        let mut compte = Compte::nouveau("Sam");
        let operations = [Operation::Depot(100), Operation::Retrait(500), Operation::Depot(10)];
        assert_eq!(
            compte.appliquer_tout(&operations),
            Err(ErreurBancaire::SoldeInsuffisant { solde: 100, demande: 500 }),
            "le retrait de 500 échoue"
        );
        assert_eq!(compte.solde(), 100, "le premier dépôt reste appliqué, le dernier n'est jamais fait");
    }

    #[test]
    fn total_des_depots() {
        let mut compte = Compte::nouveau("Sam");
        compte.appliquer_tout(&[Operation::Depot(100), Operation::Retrait(40), Operation::Depot(25)]).unwrap();
        assert_eq!(compte.total_depose(), 125, "100 + 25 = 125 (les retraits ne comptent pas)");
    }
}
