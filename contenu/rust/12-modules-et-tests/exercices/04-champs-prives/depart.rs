mod banque {
    pub struct Compte {
        titulaire: String,
        solde: u64,
    }

    impl Compte {
        pub fn ouvrir(titulaire: &str) -> Compte {
            todo!()
        }

        pub fn titulaire(&self) -> &str {
            todo!()
        }

        pub fn solde(&self) -> u64 {
            todo!()
        }

        pub fn deposer(&mut self, montant: u64) {
            todo!()
        }

        pub fn retirer(&mut self, montant: u64) -> bool {
            todo!()
        }
    }
}

use banque::Compte;

fn main() {
    let mut compte = Compte::ouvrir("Léa");
    compte.deposer(100);
    compte.retirer(30);
    println!("{} a {} €", compte.titulaire(), compte.solde());
}
