#[derive(Debug, PartialEq)]
enum ErreurAge {
    Vide,
    PasUnNombre,
    TropGrand(u32),
}

fn lire_age(texte: &str) -> Result<u32, ErreurAge> {
    todo!()
}

fn main() {
    for texte in ["25", "", "vingt", "200"] {
        println!("{:?} -> {:?}", texte, lire_age(texte));
    }
}
