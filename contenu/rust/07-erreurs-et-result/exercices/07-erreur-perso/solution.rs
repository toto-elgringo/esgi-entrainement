#[derive(Debug, PartialEq)]
enum ErreurAge {
    Vide,
    PasUnNombre,
    TropGrand(u32),
}

fn lire_age(texte: &str) -> Result<u32, ErreurAge> {
    let texte = texte.trim();
    if texte.is_empty() {
        return Err(ErreurAge::Vide);
    }
    let age = texte.parse::<u32>().map_err(|_| ErreurAge::PasUnNombre)?;
    if age > 150 {
        return Err(ErreurAge::TropGrand(age));
    }
    Ok(age)
}

fn main() {
    for texte in ["25", "", "vingt", "200"] {
        println!("{:?} -> {:?}", texte, lire_age(texte));
    }
}
