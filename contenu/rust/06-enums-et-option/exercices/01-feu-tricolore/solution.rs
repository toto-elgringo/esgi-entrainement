#[derive(Debug, PartialEq)]
enum Feu {
    Rouge,
    Orange,
    Vert,
}

fn suivant(feu: Feu) -> Feu {
    match feu {
        Feu::Vert => Feu::Orange,
        Feu::Orange => Feu::Rouge,
        Feu::Rouge => Feu::Vert,
    }
}

fn peut_passer(feu: &Feu) -> bool {
    match feu {
        Feu::Vert => true,
        Feu::Orange => false,
        Feu::Rouge => false,
    }
}

fn main() {
    let feu = Feu::Vert;
    println!("Je peux passer ? {}", peut_passer(&feu));
    println!("Ensuite : {:?}", suivant(feu));
}
