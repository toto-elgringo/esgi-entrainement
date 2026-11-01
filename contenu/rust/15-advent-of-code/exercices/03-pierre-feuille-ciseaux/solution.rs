use std::io::Read;

const EXEMPLE: &str = "C X
A Z
B Y
A X
C Y";

fn rang(lettre: &str) -> Option<u32> {
    match lettre {
        "A" | "X" => Some(0),
        "B" | "Y" => Some(1),
        "C" | "Z" => Some(2),
        _ => None,
    }
}

fn manches(entree: &str) -> Vec<(u32, u32)> {
    entree
        .lines()
        .filter_map(|ligne| {
            let mut lettres = ligne.split_whitespace();
            Some((rang(lettres.next()?)?, rang(lettres.next()?)?))
        })
        .collect()
}

fn score(adversaire: u32, moi: u32) -> u32 {
    let issue = (moi + 4 - adversaire) % 3;
    moi + 1 + 3 * issue
}

fn partie1(entree: &str) -> u32 {
    manches(entree).into_iter().map(|(adversaire, moi)| score(adversaire, moi)).sum()
}

fn partie2(entree: &str) -> u32 {
    manches(entree)
        .into_iter()
        .map(|(adversaire, issue)| score(adversaire, (adversaire + issue + 2) % 3))
        .sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
