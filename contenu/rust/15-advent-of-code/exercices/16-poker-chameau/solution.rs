use std::io::Read;

const EXEMPLE: &str = "77J27 320
TT8A8 95
KQJ93 480
5A5A5 27
JJ6JJ 610
T8T8A 200
J8888 130";

const ORDRE_NORMAL: &str = "23456789TJQKA";
const ORDRE_JOKERS: &str = "J23456789TQKA";

fn force(main: &str, jokers: bool) -> (Vec<usize>, Vec<usize>) {
    let ordre = if jokers { ORDRE_JOKERS } else { ORDRE_NORMAL };
    let valeurs: Vec<usize> = main.chars().filter_map(|carte| ordre.find(carte)).collect();
    let mut nombres = [0; 13];
    for &valeur in &valeurs {
        nombres[valeur] += 1;
    }
    let nombre_jokers = if jokers { std::mem::take(&mut nombres[0]) } else { 0 };
    let mut groupes: Vec<usize> = nombres.into_iter().filter(|&nombre| nombre > 0).collect();
    groupes.sort_unstable_by(|a, b| b.cmp(a));
    match groupes.first_mut() {
        Some(plus_grand) => *plus_grand += nombre_jokers,
        None => groupes.push(nombre_jokers),
    }
    (groupes, valeurs)
}

fn gains(entree: &str, jokers: bool) -> usize {
    let mut mains: Vec<_> = entree
        .lines()
        .filter_map(|ligne| ligne.trim().split_once(' '))
        .filter_map(|(main, mise)| Some((force(main, jokers), mise.trim().parse::<usize>().ok()?)))
        .collect();
    mains.sort_unstable();
    mains.iter().zip(1..).map(|((_, mise), rang)| mise * rang).sum()
}

fn partie1(entree: &str) -> usize {
    gains(entree, false)
}

fn partie2(entree: &str) -> usize {
    gains(entree, true)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
