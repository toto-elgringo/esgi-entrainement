use std::io::Read;

const EXEMPLE: &str = "4 9 14 19 24 29
2 5 10 17 26 37
8 5 0 -7 -16 -27
1 2 9 28 65 126";

fn suites(entree: &str) -> Vec<Vec<i64>> {
    entree
        .lines()
        .map(|ligne| ligne.split_whitespace().filter_map(|nombre| nombre.parse().ok()).collect())
        .filter(|suite: &Vec<i64>| !suite.is_empty())
        .collect()
}

fn suivante(suite: &[i64]) -> i64 {
    if suite.iter().all(|&nombre| nombre == 0) {
        return 0;
    }
    let ecarts: Vec<i64> = suite.windows(2).map(|paire| paire[1] - paire[0]).collect();
    suite[suite.len() - 1] + suivante(&ecarts)
}

fn partie1(entree: &str) -> i64 {
    suites(entree).iter().map(|suite| suivante(suite)).sum()
}

fn partie2(entree: &str) -> i64 {
    suites(entree)
        .into_iter()
        .map(|mut suite| {
            suite.reverse();
            suivante(&suite)
        })
        .sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
