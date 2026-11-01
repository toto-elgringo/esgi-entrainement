use std::io::Read;

const EXEMPLE: &str = "10 12 13 16 18
20 17 15 14 10
5 6 6 7 9
63 60 58 57 55
15 11 12 13 14
9 8 7 3 2
4 7 9 8 12
2 3 3 3 4";

fn rapports(entree: &str) -> Vec<Vec<i32>> {
    entree
        .lines()
        .map(|ligne| ligne.split_whitespace().filter_map(|mot| mot.parse().ok()).collect::<Vec<i32>>())
        .filter(|niveaux| !niveaux.is_empty())
        .collect()
}

fn est_sur(niveaux: &[i32]) -> bool {
    let ecarts: Vec<i32> = niveaux.windows(2).map(|paire| paire[1] - paire[0]).collect();
    ecarts.iter().all(|ecart| (1..=3).contains(ecart)) || ecarts.iter().all(|ecart| (-3..=-1).contains(ecart))
}

fn est_sur_avec_amortisseur(niveaux: &[i32]) -> bool {
    est_sur(niveaux)
        || (0..niveaux.len()).any(|retire| {
            let mut reste = niveaux.to_vec();
            reste.remove(retire);
            est_sur(&reste)
        })
}

fn partie1(entree: &str) -> usize {
    rapports(entree).iter().filter(|niveaux| est_sur(niveaux)).count()
}

fn partie2(entree: &str) -> usize {
    rapports(entree).iter().filter(|niveaux| est_sur_avec_amortisseur(niveaux)).count()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
