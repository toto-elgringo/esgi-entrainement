use std::io::Read;

const EXEMPLE: &str = "10 12 13 16 18
20 17 15 14 10
5 6 6 7 9
63 60 58 57 55
15 11 12 13 14
9 8 7 3 2
4 7 9 8 12
2 3 3 3 4";

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
