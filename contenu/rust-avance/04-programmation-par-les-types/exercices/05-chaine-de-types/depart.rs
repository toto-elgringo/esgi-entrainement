#[derive(Debug, Clone, Copy, PartialEq)]
struct Pourcentage(u8);

impl Pourcentage {
    fn new(valeur: u8) -> Result<Pourcentage, String> {
        if valeur <= 100 {
            Ok(Pourcentage(valeur))
        } else {
            Err(format!("{valeur} dépasse 100"))
        }
    }

    fn valeur(&self) -> u8 {
        self.0
    }
}

fn lire_pourcentage(texte: &str) -> Result<Pourcentage, String> {
    todo!()
}

fn somme_pourcentages(textes: &[&str]) -> Result<u32, String> {
    todo!()
}

fn premier_valide(textes: &[&str]) -> Option<Pourcentage> {
    todo!()
}

fn main() {
    println!("{:?}", lire_pourcentage(" 45 "));
    println!("{:?}", lire_pourcentage("abc"));
    println!("{:?}", lire_pourcentage("150"));
    println!("{:?}", somme_pourcentages(&["10", "20", "30"]));
    println!("{:?}", premier_valide(&["x", "300", "40"]).map(|p| p.valeur()));
}
