use std::io::Read;

const EXEMPLE: &str = "3-7,2-9
10-12,13-15
4-6,6-8
1-5,1-5
20-30,25-40
8-8,8-10
11-14,5-10";

fn intervalle(texte: &str) -> Option<(u32, u32)> {
    let (debut, fin) = texte.trim().split_once('-')?;
    Some((debut.parse().ok()?, fin.parse().ok()?))
}

fn paires(entree: &str) -> Vec<((u32, u32), (u32, u32))> {
    entree
        .lines()
        .filter_map(|ligne| {
            let (premier, second) = ligne.split_once(',')?;
            Some((intervalle(premier)?, intervalle(second)?))
        })
        .collect()
}

fn partie1(entree: &str) -> usize {
    paires(entree)
        .iter()
        .filter(|((a, b), (c, d))| (a <= c && d <= b) || (c <= a && b <= d))
        .count()
}

fn partie2(entree: &str) -> usize {
    paires(entree).iter().filter(|((a, b), (c, d))| a <= d && c <= b).count()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
