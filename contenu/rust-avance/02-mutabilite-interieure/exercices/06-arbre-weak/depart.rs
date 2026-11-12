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
    todo!()
}

fn chemin(noeud: &Rc<Noeud>) -> String {
    todo!()
}

fn a_un_parent(noeud: &Rc<Noeud>) -> bool {
    todo!()
}

fn compter_descendants(noeud: &Rc<Noeud>) -> usize {
    todo!()
}

fn main() {
    let racine = nouveau("racine");
    let src = nouveau("src");
    let main = nouveau("main");

    ajouter_enfant(&racine, &src);
    ajouter_enfant(&src, &main);

    println!("{}", chemin(&main));
    println!("{} descendants", compter_descendants(&racine));
    println!("racine a un parent : {}", a_un_parent(&racine));
}
