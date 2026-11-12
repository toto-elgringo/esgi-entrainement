use std::cell::RefCell;

struct Journal {
    lignes: RefCell<Vec<String>>,
}

impl Journal {
    fn nouveau() -> Self {
        Journal { lignes: RefCell::new(Vec::new()) }
    }

    fn ecrire(&self, texte: &str) {
        self.lignes.borrow_mut().push(texte.to_string());
    }

    fn nombre(&self) -> usize {
        self.lignes.borrow().len()
    }

    fn derniere(&self) -> Option<String> {
        self.lignes.borrow().last().cloned()
    }
}

fn main() {
    let journal = Journal::nouveau();
    journal.ecrire("démarrage");
    journal.ecrire("fin");
    println!("{} lignes", journal.nombre());
    println!("{:?}", journal.derniere());
}
