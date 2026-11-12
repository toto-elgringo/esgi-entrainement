use std::cell::Cell;
use std::rc::Rc;

struct Jeton {
    compteur: Rc<Cell<u32>>,
}

impl Jeton {
    fn nouveau(compteur: &Rc<Cell<u32>>) -> Jeton {
        Jeton {
            compteur: Rc::clone(compteur),
        }
    }
}

fn creer_et_perdre(compteur: &Rc<Cell<u32>>, n: u32) {
    todo!()
}

fn main() {
    let compteur = Rc::new(Cell::new(0));
    {
        let _jeton = Jeton::nouveau(&compteur);
        println!("jeton vivant : {}", compteur.get());
    }
    println!("après la portée : {}", compteur.get());
    creer_et_perdre(&compteur, 3);
    println!("après 3 jetons de plus : {}", compteur.get());
}
