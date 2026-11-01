use std::io::Read;

const EXEMPLE: &str = "4 9 14 19 24 29
2 5 10 17 26 37
8 5 0 -7 -16 -27
1 2 9 28 65 126";

fn partie1(entree: &str) -> i64 {
    todo!()
}

fn partie2(entree: &str) -> i64 {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
