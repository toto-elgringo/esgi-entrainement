use std::io::Read;

const EXEMPLE: &str = "C X
A Z
B Y
A X
C Y";

fn partie1(entree: &str) -> u32 {
    todo!()
}

fn partie2(entree: &str) -> u32 {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
