use std::io::Read;

const EXEMPLE: &str = "q7zx2kb
fiveab3cd
4nkfoureightwo
twonepq
zero5nine
xsevenx
9";

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
