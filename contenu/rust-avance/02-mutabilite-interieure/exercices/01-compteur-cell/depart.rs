use std::cell::Cell;

struct Compteur {
    n: Cell<u32>,
}

impl Compteur {
    fn nouveau() -> Self {
        todo!()
    }

    fn incrementer(&self) {
        todo!()
    }

    fn valeur(&self) -> u32 {
        todo!()
    }

    fn remettre_a_zero(&self) -> u32 {
        todo!()
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
