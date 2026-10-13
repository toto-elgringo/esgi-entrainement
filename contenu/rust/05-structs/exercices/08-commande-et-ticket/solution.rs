#[derive(Debug, PartialEq)]
struct Commande {
    plats: u32,
    total: u32,
}

#[derive(Debug, PartialEq)]
struct Ticket {
    numero: u32,
    montant: u32,
}

impl Commande {
    fn new() -> Self {
        Self { plats: 0, total: 0 }
    }

    fn ajouter(mut self, prix: u32) -> Self {
        self.plats += 1;
        self.total += prix;
        self
    }

    fn payer(self, numero: u32) -> Ticket {
        Ticket {
            numero,
            montant: self.total,
        }
    }
}

fn main() {
    let ticket = Commande::new().ajouter(12).ajouter(5).payer(1);
    println!("{:?}", ticket);
}
