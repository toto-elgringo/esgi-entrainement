use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Noeud {
    nom: String,
    parent: RefCell<Weak<Noeud>>,
    enfants: RefCell<Vec<Rc<Noeud>>>,
}

fn nouveau(nom: &str) -> Rc<Noeud> {
    todo!()
}

fn ajouter_enfant(parent: &Rc<Noeud>, enfant: &Rc<Noeud>) {
    todo!()
}

fn nom_du_parent(noeud: &Noeud) -> Option<String> {
    todo!()
}

fn chemin(noeud: &Noeud) -> String {
    todo!()
}

fn nombre_enfants(noeud: &Noeud) -> usize {
    todo!()
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
