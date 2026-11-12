use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Noeud {
    nom: String,
    parent: RefCell<Weak<Noeud>>,
    enfants: RefCell<Vec<Rc<Noeud>>>,
}

fn nouveau(nom: &str) -> Rc<Noeud> {
    Rc::new(Noeud {
        nom: nom.to_string(),
        parent: RefCell::new(Weak::new()),
        enfants: RefCell::new(Vec::new()),
    })
}

fn ajouter_enfant(parent: &Rc<Noeud>, enfant: &Rc<Noeud>) {
    *enfant.parent.borrow_mut() = Rc::downgrade(parent);
    parent.enfants.borrow_mut().push(Rc::clone(enfant));
}

fn nom_du_parent(noeud: &Noeud) -> Option<String> {
    noeud.parent.borrow().upgrade().map(|parent| parent.nom.clone())
}

fn chemin(noeud: &Noeud) -> String {
    match noeud.parent.borrow().upgrade() {
        Some(parent) => format!("{}/{}", chemin(&parent), noeud.nom),
        None => noeud.nom.clone(),
    }
}

fn nombre_enfants(noeud: &Noeud) -> usize {
    noeud.enfants.borrow().len()
}

fn main() {
    let racine = nouveau("racine");
    let dossier = nouveau("dossier");
    let fichier = nouveau("fichier");
    ajouter_enfant(&racine, &dossier);
    ajouter_enfant(&dossier, &fichier);
    println!("chemin : {}", chemin(&fichier));
    println!("parent de fichier : {:?}", nom_du_parent(&fichier));
    println!("enfants de racine : {}", nombre_enfants(&racine));
    println!("forts : {}, faibles : {}", Rc::strong_count(&dossier), Rc::weak_count(&dossier));
}
