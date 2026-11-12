use std::fmt;

trait Article: fmt::Display {
    fn prix_centimes(&self) -> u32;

    fn etiquette(&self) -> String {
        todo!()
    }
}

struct Livre {
    titre: String,
    prix: u32,
}

struct Stylo {
    couleur: String,
}

impl fmt::Display for Livre {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

impl fmt::Display for Stylo {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        todo!()
    }
}

impl Article for Livre {
    fn prix_centimes(&self) -> u32 {
        self.prix
    }
}

impl Article for Stylo {
    fn prix_centimes(&self) -> u32 {
        150
    }
}

fn main() {
    let livre = Livre { titre: "Rust".to_string(), prix: 2990 };
    let stylo = Stylo { couleur: "bleu".to_string() };
    println!("{}", livre.etiquette());
    println!("{}", stylo.etiquette());
}
