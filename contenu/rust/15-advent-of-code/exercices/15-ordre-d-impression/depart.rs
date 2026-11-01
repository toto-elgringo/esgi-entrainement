use std::io::Read;

const EXEMPLE: &str = "21|72
55|16
87|55
34|55
21|34
87|34
87|16
34|16
16|72
21|55
55|72
34|72
87|72
21|87
21|16

21,34,16
87,55,72,16,34
21,87,55,16,72
72,21,34
87,16,72
16,87,21,55,72";

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
