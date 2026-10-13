use std::collections::HashMap;
use std::fmt;

#[derive(Debug, PartialEq)]
enum ErreurStock {
    ArticleInconnu(String),
    StockInsuffisant {
        article: String,
        disponible: u32,
        demande: u32,
    },
}

struct Inventaire {
    stock: HashMap<String, u32>,
}

impl Inventaire {
    fn nouveau() -> Inventaire {
        todo!()
    }

    fn ajouter(&mut self, article: &str, quantite: u32) {
        todo!()
    }

    fn retirer(&mut self, article: &str, quantite: u32) -> Result<(), ErreurStock> {
        todo!()
    }

    fn quantite(&self, article: &str) -> u32 {
        todo!()
    }

    fn a_reapprovisionner(&self, seuil: u32) -> Vec<String> {
        todo!()
    }
}

impl fmt::Display for Inventaire {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

fn main() {
    let mut inventaire = Inventaire::nouveau();
    inventaire.ajouter("pomme", 5);
    inventaire.ajouter("banane", 12);
    println!("{:?}", inventaire.retirer("pomme", 2));
    println!("{inventaire}");
}
