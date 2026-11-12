use std::cell::{Cell, RefCell};
use std::collections::HashMap;

struct Calculateur {
    cache: RefCell<HashMap<u64, u64>>,
    calculs: Cell<u32>,
}

impl Calculateur {
    fn nouveau() -> Self {
        Calculateur {
            cache: RefCell::new(HashMap::new()),
            calculs: Cell::new(0),
        }
    }

    fn carre(&self, n: u64) -> u64 {
        todo!()
    }

    fn calculs(&self) -> u32 {
        todo!()
    }
}

fn main() {
    let calculateur = Calculateur::nouveau();
    println!("{}", calculateur.carre(4));
    println!("{}", calculateur.carre(5));
    println!("{}", calculateur.carre(4));
    println!("{} calculs", calculateur.calculs());
}
