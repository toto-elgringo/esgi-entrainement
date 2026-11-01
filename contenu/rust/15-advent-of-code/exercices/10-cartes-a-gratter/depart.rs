use std::io::Read;

const EXEMPLE: &str = "Card 1:  7 23 45 61 88 | 23  5 61 90 12 45 34 70
Card 2: 14  3 52 76 39 | 52 18  3 66 27 81  9 41
Card 3: 60 31  8 95 47 |  2 47 73 31 56 19 84 11
Card 4: 25 66  4 17 93 | 38 71 17 50  6 29 62 85
Card 5: 10 44 77  2 58 | 13 91 36 64  8 21 99 53
Card 6: 33 80  1 69 26 | 15 42 57  3 74 98 20 87";

fn partie1(entree: &str) -> u32 {
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
