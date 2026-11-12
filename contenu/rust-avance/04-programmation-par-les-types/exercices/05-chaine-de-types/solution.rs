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
    texte
        .trim()
        .parse::<u8>()
        .map_err(|_| format!("« {texte} » n'est pas un nombre valide"))
        .and_then(Pourcentage::new)
}

fn somme_pourcentages(textes: &[&str]) -> Result<u32, String> {
    textes
        .iter()
        .map(|texte| lire_pourcentage(texte).map(|p| u32::from(p.valeur())))
        .sum()
}

fn premier_valide(textes: &[&str]) -> Option<Pourcentage> {
    textes.iter().find_map(|texte| lire_pourcentage(texte).ok())
}

fn main() {
    println!("{:?}", lire_pourcentage(" 45 "));
    println!("{:?}", lire_pourcentage("abc"));
    println!("{:?}", lire_pourcentage("150"));
    println!("{:?}", somme_pourcentages(&["10", "20", "30"]));
    println!("{:?}", premier_valide(&["x", "300", "40"]).map(|p| p.valeur()));
}
