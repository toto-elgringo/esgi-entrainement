use std::cell::{Cell, RefCell};
use std::rc::Rc;

trait Observateur {
    fn notifier(&self, evenement: &str);
}

struct Historique {
    vus: RefCell<Vec<String>>,
}

struct Compteur {
    total: Cell<usize>,
}

impl Observateur for Historique {
    fn notifier(&self, evenement: &str) {
        self.vus.borrow_mut().push(evenement.to_string());
    }
}

impl Observateur for Compteur {
    fn notifier(&self, _evenement: &str) {
        self.total.set(self.total.get() + 1);
    }
}

struct Sujet {
    observateurs: Vec<Rc<dyn Observateur>>,
}

impl Sujet {
    fn nouveau() -> Self {
        Sujet { observateurs: Vec::new() }
    }

    fn abonner(&mut self, observateur: Rc<dyn Observateur>) {
        self.observateurs.push(observateur);
    }

    fn emettre(&self, evenement: &str) {
        for observateur in &self.observateurs {
            observateur.notifier(evenement);
        }
    }
}

fn main() {
    let historique = Rc::new(Historique { vus: RefCell::new(Vec::new()) });
    let compteur = Rc::new(Compteur { total: Cell::new(0) });

    let mut sujet = Sujet::nouveau();
    sujet.abonner(historique.clone());
    sujet.abonner(compteur.clone());

    sujet.emettre("connexion");
    sujet.emettre("déconnexion");

    println!("{:?}", historique.vus.borrow());
    println!("{} événements", compteur.total.get());
}
