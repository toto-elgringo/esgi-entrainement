use std::sync::{Arc, RwLock};
use std::thread;

struct Annuaire {
    noms: RwLock<Vec<String>>,
}

impl Annuaire {
    fn new() -> Self {
        Annuaire {
            noms: RwLock::new(Vec::new()),
        }
    }

    fn ajouter(&self, nom: &str) {
        todo!()
    }

    fn nombre(&self) -> usize {
        todo!()
    }

    fn contient(&self, nom: &str) -> bool {
        todo!()
    }
}

fn main() {
    let annuaire = Arc::new(Annuaire::new());
    let mut handles = Vec::new();

    for i in 0..3 {
        let annuaire = Arc::clone(&annuaire);
        handles.push(thread::spawn(move || {
            annuaire.ajouter(&format!("membre-{i}"));
        }));
    }
    for handle in handles {
        handle.join().unwrap();
    }

    println!("{} noms", annuaire.nombre());
    println!("membre-1 présent : {}", annuaire.contient("membre-1"));
}
