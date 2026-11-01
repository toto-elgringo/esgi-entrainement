use std::collections::HashSet;
use std::io::Read;

const EXEMPLE: &str = "Card 1:  7 23 45 61 88 | 23  5 61 90 12 45 34 70
Card 2: 14  3 52 76 39 | 52 18  3 66 27 81  9 41
Card 3: 60 31  8 95 47 |  2 47 73 31 56 19 84 11
Card 4: 25 66  4 17 93 | 38 71 17 50  6 29 62 85
Card 5: 10 44 77  2 58 | 13 91 36 64  8 21 99 53
Card 6: 33 80  1 69 26 | 15 42 57  3 74 98 20 87";

fn nombres(texte: &str) -> impl Iterator<Item = u32> + '_ {
    texte.split_whitespace().filter_map(|nombre| nombre.parse().ok())
}

fn correspondances(entree: &str) -> Vec<usize> {
    entree
        .lines()
        .filter_map(|ligne| ligne.split_once(':'))
        .filter_map(|(_, contenu)| contenu.split_once('|'))
        .map(|(gagnants, tires)| {
            let gagnants: HashSet<u32> = nombres(gagnants).collect();
            nombres(tires).filter(|nombre| gagnants.contains(nombre)).count()
        })
        .collect()
}

fn partie1(entree: &str) -> u32 {
    correspondances(entree)
        .into_iter()
        .filter(|&trouves| trouves > 0)
        .map(|trouves| 1 << (trouves - 1))
        .sum()
}

fn partie2(entree: &str) -> usize {
    let gains = correspondances(entree);
    let mut exemplaires = vec![1; gains.len()];
    for (carte, &trouves) in gains.iter().enumerate() {
        let copies = exemplaires[carte];
        let fin = (carte + 1 + trouves).min(gains.len());
        for suivante in &mut exemplaires[carte + 1..fin] {
            *suivante += copies;
        }
    }
    exemplaires.iter().sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
