mod banque {
    pub struct Compte {
        titulaire: String,
        solde: u64,
    }

    impl Compte {
        pub fn ouvrir(titulaire: &str) -> Compte {
            Compte {
                titulaire: titulaire.to_string(),
                solde: 0,
            }
        }

        pub fn titulaire(&self) -> &str {
            &self.titulaire
        }

        pub fn solde(&self) -> u64 {
            self.solde
        }

        pub fn deposer(&mut self, montant: u64) {
            self.solde += montant;
        }

        pub fn retirer(&mut self, montant: u64) -> bool {
            if montant > self.solde {
                return false;
            }
            self.solde -= montant;
            true
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
