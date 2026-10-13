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
        todo!()
    }

    fn titulaire(&self) -> &str {
        todo!()
    }

    fn solde(&self) -> u64 {
        todo!()
    }

    fn historique(&self) -> &[Operation] {
        todo!()
    }

    fn appliquer(&mut self, operation: Operation) -> Result<u64, ErreurBancaire> {
        todo!()
    }

    fn appliquer_tout(&mut self, operations: &[Operation]) -> Result<u64, ErreurBancaire> {
        todo!()
    }

    fn total_depose(&self) -> u64 {
        todo!()
    }
}

fn main() {
    let mut compte = Compte::nouveau("Léa");
    println!("{:?}", compte.appliquer(Operation::Depot(100)));
    println!("{:?}", compte.appliquer(Operation::Retrait(500)));
    println!("{} a {} €", compte.titulaire(), compte.solde());
}
