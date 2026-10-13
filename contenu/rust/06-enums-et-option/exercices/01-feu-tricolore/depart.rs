#[derive(Debug, PartialEq)]
enum Feu {
    Rouge,
    Orange,
    Vert,
}

fn suivant(feu: Feu) -> Feu {
    todo!()
}

fn peut_passer(feu: &Feu) -> bool {
    todo!()
}

fn main() {
    let feu = Feu::Vert;
    println!("Je peux passer ? {}", peut_passer(&feu));
    println!("Ensuite : {:?}", suivant(feu));
}
