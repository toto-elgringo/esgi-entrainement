use std::io::Read;

const EXEMPLE: &str = "        [S] [G]
[U]     [F] [T]
[R] [J] [W] [H]
 1   2   3   4

move 2 from 1 to 2
move 3 from 2 to 1
move 1 from 1 to 4
move 2 from 4 to 2";

fn partie1(entree: &str) -> String {
    todo!()
}

fn partie2(entree: &str) -> String {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
