use std::io::Read;

const EXEMPLE: &str = "77J27 320
TT8A8 95
KQJ93 480
5A5A5 27
JJ6JJ 610
T8T8A 200
J8888 130";

fn partie1(entree: &str) -> usize {
    todo!()
}

fn partie2(entree: &str) -> usize {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
