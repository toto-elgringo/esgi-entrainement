#[derive(Debug, Clone, PartialEq)]
enum Paiement {
    EnAttente,
    Paye { montant: u32 },
    Rembourse { montant: u32, motif: String },
}

fn libelle(paiement: &Paiement) -> String {
    todo!()
}

fn montant_encaisse(paiement: &Paiement) -> u32 {
    todo!()
}

fn rembourser(paiement: Paiement, motif: &str) -> Result<Paiement, String> {
    todo!()
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
