#[derive(Debug, Clone, PartialEq)]
enum Paiement {
    EnAttente,
    Paye { montant: u32 },
    Rembourse { montant: u32, motif: String },
}

fn libelle(paiement: &Paiement) -> String {
    match paiement {
        Paiement::EnAttente => "en attente".to_string(),
        Paiement::Paye { montant } => format!("payé : {montant} euros"),
        Paiement::Rembourse { montant, motif } => format!("remboursé : {montant} euros ({motif})"),
    }
}

fn montant_encaisse(paiement: &Paiement) -> u32 {
    match paiement {
        Paiement::Paye { montant } => *montant,
        _ => 0,
    }
}

fn rembourser(paiement: Paiement, motif: &str) -> Result<Paiement, String> {
    match paiement {
        Paiement::Paye { montant } => Ok(Paiement::Rembourse { montant, motif: motif.to_string() }),
        _ => Err("seul un paiement payé peut être remboursé".to_string()),
    }
}

fn main() {
    let paiement = Paiement::Paye { montant: 30 };
    println!("{}", libelle(&paiement));
    println!("{}", montant_encaisse(&paiement));
    match rembourser(paiement, "doublon") {
        Ok(rembourse) => println!("{}", libelle(&rembourse)),
        Err(message) => println!("{message}"),
    }
    println!("{}", libelle(&Paiement::EnAttente));
}
