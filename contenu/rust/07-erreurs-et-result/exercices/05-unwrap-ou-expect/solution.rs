fn lire_port(texte: &str) -> u16 {
    texte.parse().unwrap_or(8080)
}

fn lire_port_obligatoire(texte: &str) -> u16 {
    texte
        .parse()
        .expect("le port doit être un nombre entre 0 et 65535")
}

fn main() {
    println!("{}", lire_port("3000"));
    println!("{}", lire_port("abc"));
    println!("{}", lire_port_obligatoire("443"));
}
