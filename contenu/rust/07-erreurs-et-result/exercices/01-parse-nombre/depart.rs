use std::num::ParseIntError;

fn lire_nombre(texte: &str) -> Result<i32, ParseIntError> {
    todo!()
}

fn lire_ou_zero(texte: &str) -> i32 {
    todo!()
}

fn main() {
    println!("{:?}", lire_nombre("42"));
    println!("{:?}", lire_nombre("abc"));
    println!("{}", lire_ou_zero("abc"));
}
