use std::cell::RefCell;

struct Journal {
    lignes: RefCell<Vec<String>>,
}

impl Journal {
    fn nouveau() -> Self {
        todo!()
    }

    fn ecrire(&self, texte: &str) {
        todo!()
    }

    fn nombre(&self) -> usize {
        todo!()
    }

    fn derniere(&self) -> Option<String> {
        todo!()
    }
}

fn main() {
    let journal = Journal::nouveau();
    journal.ecrire("démarrage");
    journal.ecrire("fin");
    println!("{} lignes", journal.nombre());
    println!("{:?}", journal.derniere());
}
