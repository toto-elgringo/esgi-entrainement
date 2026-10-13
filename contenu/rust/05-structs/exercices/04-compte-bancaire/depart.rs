struct CompteBancaire {
    titulaire: String,
    solde: u32,
}

impl CompteBancaire {
    fn new(titulaire: &str) -> Self {
        todo!()
    }

    fn deposer(&mut self, montant: u32) {
        todo!()
    }

    fn retirer(&mut self, montant: u32) -> bool {
        todo!()
    }

    fn solde(&self) -> u32 {
        todo!()
    }
}

fn main() {
    let mut compte = CompteBancaire::new("Alice");
    compte.deposer(100);
    compte.retirer(30);
    println!("{} a {} €", compte.titulaire, compte.solde());
}
