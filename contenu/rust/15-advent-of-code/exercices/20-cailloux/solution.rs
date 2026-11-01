use std::collections::HashMap;
use std::io::Read;

const EXEMPLE: &str = "0 1000 7 63";

fn transformer(caillou: u64) -> Vec<u64> {
    if caillou == 0 {
        return vec![1];
    }
    let chiffres = caillou.ilog10() + 1;
    if chiffres.is_multiple_of(2) {
        let diviseur = 10u64.pow(chiffres / 2);
        vec![caillou / diviseur, caillou % diviseur]
    } else {
        vec![caillou * 2024]
    }
}

fn cailloux_apres(entree: &str, clignements: u32) -> u64 {
    let mut compteurs: HashMap<u64, u64> = HashMap::new();
    for caillou in entree.split_whitespace().filter_map(|texte| texte.parse().ok()) {
        *compteurs.entry(caillou).or_default() += 1;
    }
    for _ in 0..clignements {
        let mut suivants = HashMap::new();
        for (caillou, nombre) in compteurs {
            for nouveau in transformer(caillou) {
                *suivants.entry(nouveau).or_default() += nombre;
            }
        }
        compteurs = suivants;
    }
    compteurs.values().sum()
}

fn partie1(entree: &str) -> u64 {
    cailloux_apres(entree, 25)
}

fn partie2(entree: &str) -> u64 {
    cailloux_apres(entree, 75)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
