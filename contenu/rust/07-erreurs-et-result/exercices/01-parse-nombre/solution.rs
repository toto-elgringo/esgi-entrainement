use std::num::ParseIntError;

fn lire_nombre(texte: &str) -> Result<i32, ParseIntError> {
    texte.trim().parse::<i32>()
}

fn lire_ou_zero(texte: &str) -> i32 {
    lire_nombre(texte).unwrap_or(0)
}

fn main() {
    println!("{:?}", lire_nombre("42"));
    println!("{:?}", lire_nombre("abc"));
    println!("{}", lire_ou_zero("abc"));
}
