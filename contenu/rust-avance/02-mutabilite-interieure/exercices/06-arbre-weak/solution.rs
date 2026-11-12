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
    parent.enfants.borrow_mut().push(Rc::clone(enfant));
    *enfant.parent.borrow_mut() = Rc::downgrade(parent);
}

fn chemin(noeud: &Rc<Noeud>) -> String {
    let mut noms = vec![noeud.nom.clone()];
    let mut parent = noeud.parent.borrow().upgrade();
    while let Some(p) = parent {
        noms.push(p.nom.clone());
        parent = p.parent.borrow().upgrade();
    }
    noms.reverse();
    noms.join("/")
}

fn a_un_parent(noeud: &Rc<Noeud>) -> bool {
    noeud.parent.borrow().upgrade().is_some()
}

fn compter_descendants(noeud: &Rc<Noeud>) -> usize {
    noeud
        .enfants
        .borrow()
        .iter()
        .map(|enfant| 1 + compter_descendants(enfant))
        .sum()
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
