use std::collections::HashSet;
use std::io::Read;

const EXEMPLE: &str = "zzyzyxzyxwvvutsrqponmlkjih";

fn fin_du_marqueur(entree: &str, taille: usize) -> usize {
    entree
        .trim()
        .as_bytes()
        .windows(taille)
        .position(|fenetre| fenetre.iter().collect::<HashSet<_>>().len() == taille)
        .map_or(0, |debut| debut + taille)
}

fn partie1(entree: &str) -> usize {
    fin_du_marqueur(entree, 4)
}

fn partie2(entree: &str) -> usize {
    fin_du_marqueur(entree, 14)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
