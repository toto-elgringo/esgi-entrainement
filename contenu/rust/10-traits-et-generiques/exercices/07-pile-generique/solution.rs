use std::fmt::Display;

struct Pile<T> {
    elements: Vec<T>,
}

impl<T> Pile<T> {
    fn new() -> Self {
        Pile { elements: Vec::new() }
    }

    fn empiler(&mut self, valeur: T) {
        self.elements.push(valeur);
    }

    fn depiler(&mut self) -> Option<T> {
        self.elements.pop()
    }

    fn sommet(&self) -> Option<&T> {
        self.elements.last()
    }

    fn taille(&self) -> usize {
        self.elements.len()
    }

    fn est_vide(&self) -> bool {
        self.elements.is_empty()
    }
}

impl<T: Display> Pile<T> {
    fn afficher(&self) -> String {
        if self.est_vide() {
            return "(vide)".to_string();
        }
        self.elements
            .iter()
            .map(|element| element.to_string())
            .collect::<Vec<String>>()
            .join(" | ")
    }
}

fn main() {
    let mut pile = Pile::new();
    pile.empiler(1);
    pile.empiler(2);
    pile.empiler(3);
    println!("{}", pile.afficher());
}
