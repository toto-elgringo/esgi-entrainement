fn lire_port(texte: &str) -> u16 {
    texte.parse().unwrap()
}

fn lire_port_obligatoire(texte: &str) -> u16 {
    texte.parse().unwrap()
}

fn main() {
    println!("{}", lire_port("3000"));
    println!("{}", lire_port("abc"));
    println!("{}", lire_port_obligatoire("443"));
}
