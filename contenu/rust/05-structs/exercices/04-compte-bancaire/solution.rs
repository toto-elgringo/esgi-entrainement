struct CompteBancaire {
    titulaire: String,
    solde: u32,
}

impl CompteBancaire {
    fn new(titulaire: &str) -> Self {
        Self {
            titulaire: titulaire.to_string(),
            solde: 0,
        }
    }

    fn deposer(&mut self, montant: u32) {
        self.solde += montant;
    }

    fn retirer(&mut self, montant: u32) -> bool {
        if montant > self.solde {
            return false;
        }
        self.solde -= montant;
        true
    }

    fn solde(&self) -> u32 {
        self.solde
    }
}

fn main() {
    let mut compte = CompteBancaire::new("Alice");
    compte.deposer(100);
    compte.retirer(30);
    println!("{} a {} €", compte.titulaire, compte.solde());
}
