use std::fmt::Display;

struct Pile<T> {
    elements: Vec<T>,
}

impl<T> Pile<T> {
    fn new() -> Self {
        todo!()
    }

    fn empiler(&mut self, valeur: T) {
        todo!()
    }

    fn depiler(&mut self) -> Option<T> {
        todo!()
    }

    fn sommet(&self) -> Option<&T> {
        todo!()
    }

    fn taille(&self) -> usize {
        todo!()
    }

    fn est_vide(&self) -> bool {
        todo!()
    }
}

impl<T: Display> Pile<T> {
    fn afficher(&self) -> String {
        todo!()
    }
}

fn main() {
    let mut pile = Pile::new();
    pile.empiler(1);
    pile.empiler(2);
    pile.empiler(3);
    println!("{}", pile.afficher());
}
