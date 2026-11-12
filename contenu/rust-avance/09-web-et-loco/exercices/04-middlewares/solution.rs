use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug, PartialEq)]
struct Reponse {
    statut: u16,
    corps: String,
}

impl Reponse {
    fn new(statut: u16, corps: &str) -> Self {
        Reponse {
            statut,
            corps: corps.to_string(),
        }
    }
}

struct Requete {
    chemin: String,
    jeton: Option<String>,
}

type Gestionnaire = Box<dyn Fn(&Requete) -> Reponse>;
type Journal = Rc<RefCell<Vec<String>>>;

fn journaliser(suivant: Gestionnaire, journal: Journal) -> Gestionnaire {
    Box::new(move |r: &Requete| {
        journal.borrow_mut().push(format!("début {}", r.chemin));
        let reponse = suivant(r);
        journal
            .borrow_mut()
            .push(format!("fin {} {}", r.chemin, reponse.statut));
        reponse
    })
}

fn exiger_jeton(suivant: Gestionnaire, attendu: &str) -> Gestionnaire {
    let attendu = attendu.to_string();
    Box::new(move |r: &Requete| {
        if r.jeton.as_deref() == Some(attendu.as_str()) {
            suivant(r)
        } else {
            Reponse::new(401, "non autorisé")
        }
    })
}

fn main() {
    let journal: Journal = Rc::new(RefCell::new(Vec::new()));
    let page: Gestionnaire = Box::new(|_| Reponse::new(200, "contenu"));
    let protegee = journaliser(exiger_jeton(page, "secret"), Rc::clone(&journal));
    let sans = Requete {
        chemin: "/prive".to_string(),
        jeton: None,
    };
    println!("{:?}", protegee(&sans));
    for ligne in journal.borrow().iter() {
        println!("{ligne}");
    }
}
