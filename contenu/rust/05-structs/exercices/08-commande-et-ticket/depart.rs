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
        todo!()
    }

    fn ajouter(self, prix: u32) -> Self {
        todo!()
    }

    fn payer(self, numero: u32) -> Ticket {
        todo!()
    }
}

fn main() {
    let ticket = Commande::new().ajouter(12).ajouter(5).payer(1);
    println!("{:?}", ticket);
}
