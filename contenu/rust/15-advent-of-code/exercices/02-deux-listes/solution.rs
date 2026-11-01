use std::collections::HashMap;
use std::io::Read;

const EXEMPLE: &str = "12   9
4   15
9   4
4   9
20   4
7   3";

fn colonnes(entree: &str) -> (Vec<u64>, Vec<u64>) {
    entree
        .lines()
        .filter_map(|ligne| {
            let mut nombres = ligne.split_whitespace().filter_map(|mot| mot.parse::<u64>().ok());
            Some((nombres.next()?, nombres.next()?))
        })
        .unzip()
}

fn partie1(entree: &str) -> u64 {
    let (mut gauche, mut droite) = colonnes(entree);
    gauche.sort_unstable();
    droite.sort_unstable();
    gauche.iter().zip(&droite).map(|(a, b)| a.abs_diff(*b)).sum()
}

fn partie2(entree: &str) -> u64 {
    let (gauche, droite) = colonnes(entree);
    let mut apparitions: HashMap<u64, u64> = HashMap::new();
    for nombre in droite {
        *apparitions.entry(nombre).or_default() += 1;
    }
    gauche
        .iter()
        .map(|nombre| apparitions.get(nombre).map_or(0, |fois| nombre * fois))
        .sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
