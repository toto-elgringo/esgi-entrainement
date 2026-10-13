#[derive(Debug, Clone, Copy, PartialEq)]
enum Operation {
    Depot(u64),
    Retrait(u64),
}

#[derive(Debug, PartialEq)]
enum ErreurBancaire {
    MontantNul,
    SoldeInsuffisant { solde: u64, demande: u64 },
}

struct Compte {
    titulaire: String,
    solde: u64,
    historique: Vec<Operation>,
}

impl Compte {
    fn nouveau(titulaire: &str) -> Compte {
        Compte {
            titulaire: titulaire.to_string(),
            solde: 0,
            historique: Vec::new(),
        }
    }

    fn titulaire(&self) -> &str {
        &self.titulaire
    }

    fn solde(&self) -> u64 {
        self.solde
    }

    fn historique(&self) -> &[Operation] {
        &self.historique
    }

    fn appliquer(&mut self, operation: Operation) -> Result<u64, ErreurBancaire> {
        match operation {
            Operation::Depot(0) | Operation::Retrait(0) => return Err(ErreurBancaire::MontantNul),
            Operation::Depot(montant) => self.solde += montant,
            Operation::Retrait(montant) => {
                if montant > self.solde {
                    return Err(ErreurBancaire::SoldeInsuffisant {
                        solde: self.solde,
                        demande: montant,
                    });
                }
                self.solde -= montant;
            }
        }
        self.historique.push(operation);
        Ok(self.solde)
    }

    fn appliquer_tout(&mut self, operations: &[Operation]) -> Result<u64, ErreurBancaire> {
        for operation in operations {
            self.appliquer(*operation)?;
        }
        Ok(self.solde)
    }

    fn total_depose(&self) -> u64 {
        self.historique
            .iter()
            .map(|operation| match operation {
                Operation::Depot(montant) => *montant,
                Operation::Retrait(_) => 0,
            })
            .sum()
    }
}

fn main() {
    let mut compte = Compte::nouveau("Léa");
    println!("{:?}", compte.appliquer(Operation::Depot(100)));
    println!("{:?}", compte.appliquer(Operation::Retrait(500)));
    println!("{} a {} €", compte.titulaire(), compte.solde());
}
