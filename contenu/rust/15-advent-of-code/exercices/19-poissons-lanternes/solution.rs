use std::io::Read;

const EXEMPLE: &str = "2,5,1,1,4";

fn compter_minuteurs(entree: &str) -> [u64; 9] {
    let mut compteurs = [0; 9];
    for minuteur in entree.trim().split(',').filter_map(|texte| texte.trim().parse::<usize>().ok()) {
        compteurs[minuteur] += 1;
    }
    compteurs
}

fn poissons_apres(entree: &str, jours: u32) -> u64 {
    let mut compteurs = compter_minuteurs(entree);
    for _ in 0..jours {
        compteurs.rotate_left(1);
        compteurs[6] += compteurs[8];
    }
    compteurs.iter().sum()
}

fn partie1(entree: &str) -> u64 {
    poissons_apres(entree, 80)
}

fn partie2(entree: &str) -> u64 {
    poissons_apres(entree, 256)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
