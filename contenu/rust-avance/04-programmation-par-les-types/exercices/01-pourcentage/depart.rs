#[derive(Debug, Clone, Copy, PartialEq)]
struct Pourcentage(u8);

impl Pourcentage {
    fn new(valeur: u8) -> Result<Pourcentage, String> {
        todo!()
    }

    fn valeur(&self) -> u8 {
        todo!()
    }
}

fn appliquer_remise(prix: u32, remise: Pourcentage) -> u32 {
    todo!()
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
