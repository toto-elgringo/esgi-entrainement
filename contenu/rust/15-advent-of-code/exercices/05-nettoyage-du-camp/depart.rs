use std::io::Read;

const EXEMPLE: &str = "3-7,2-9
10-12,13-15
4-6,6-8
1-5,1-5
20-30,25-40
8-8,8-10
11-14,5-10";

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
