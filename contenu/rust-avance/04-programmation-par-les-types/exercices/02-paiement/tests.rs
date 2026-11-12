#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn libelles() {
        assert_eq!(libelle(&Paiement::EnAttente), "en attente", "paiement en attente");
        assert_eq!(libelle(&Paiement::Paye { montant: 30 }), "payé : 30 euros", "paiement payé");
        let rembourse = Paiement::Rembourse { montant: 30, motif: "doublon".to_string() };
        assert_eq!(libelle(&rembourse), "remboursé : 30 euros (doublon)", "paiement remboursé");
    }

    #[test]
    fn montants() {
        assert_eq!(montant_encaisse(&Paiement::Paye { montant: 45 }), 45, "payé");
        assert_eq!(montant_encaisse(&Paiement::EnAttente), 0, "en attente");
        let rembourse = Paiement::Rembourse { montant: 45, motif: "retour".to_string() };
        assert_eq!(montant_encaisse(&rembourse), 0, "remboursé");
    }

    #[test]
    fn remboursement() {
        assert_eq!(
            rembourser(Paiement::Paye { montant: 12 }, "erreur"),
            Ok(Paiement::Rembourse { montant: 12, motif: "erreur".to_string() }),
            "un paiement payé se rembourse"
        );
        let refus = Err("seul un paiement payé peut être remboursé".to_string());
        assert_eq!(rembourser(Paiement::EnAttente, "x"), refus, "rien à rembourser en attente");
        let deja = Paiement::Rembourse { montant: 1, motif: "a".to_string() };
        assert_eq!(rembourser(deja, "b"), refus, "pas de double remboursement");
    }
}
