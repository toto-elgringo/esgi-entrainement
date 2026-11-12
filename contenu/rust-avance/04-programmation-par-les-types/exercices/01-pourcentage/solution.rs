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

fn appliquer_remise(prix: u32, remise: Pourcentage) -> u32 {
    prix - prix * remise.valeur() as u32 / 100
}

fn main() {
    match Pourcentage::new(150) {
        Ok(p) => println!("{}", p.valeur()),
        Err(message) => println!("{message}"),
    }
    if let Ok(remise) = Pourcentage::new(25) {
        println!("{}", appliquer_remise(200, remise));
    }
}
