use std::cell::Cell;

struct Compteur {
    n: Cell<u32>,
}

impl Compteur {
    fn nouveau() -> Self {
        Compteur { n: Cell::new(0) }
    }

    fn incrementer(&self) {
        self.n.set(self.n.get() + 1);
    }

    fn valeur(&self) -> u32 {
        self.n.get()
    }

    fn remettre_a_zero(&self) -> u32 {
        self.n.replace(0)
    }
}

fn main() {
    let compteur = Compteur::nouveau();
    compteur.incrementer();
    compteur.incrementer();
    println!("valeur : {}", compteur.valeur());
    println!("ancienne valeur : {}", compteur.remettre_a_zero());
    println!("valeur : {}", compteur.valeur());
}
