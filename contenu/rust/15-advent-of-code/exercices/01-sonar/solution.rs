use std::io::Read;

const EXEMPLE: &str = "100
102
101
105
110
108
112
120
90
125";

fn profondeurs(entree: &str) -> Vec<u32> {
    entree.lines().filter_map(|ligne| ligne.trim().parse().ok()).collect()
}

fn partie1(entree: &str) -> usize {
    profondeurs(entree).windows(2).filter(|paire| paire[1] > paire[0]).count()
}

fn partie2(entree: &str) -> usize {
    profondeurs(entree).windows(4).filter(|fenetre| fenetre[3] > fenetre[0]).count()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
