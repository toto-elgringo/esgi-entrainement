use std::cmp::Ordering;
use std::collections::HashSet;
use std::io::Read;

const EXEMPLE: &str = "21|72
55|16
87|55
34|55
21|34
87|34
87|16
34|16
16|72
21|55
55|72
34|72
87|72
21|87
21|16

21,34,16
87,55,72,16,34
21,87,55,16,72
72,21,34
87,16,72
16,87,21,55,72";

type Regles = HashSet<(u32, u32)>;

fn lire(entree: &str) -> (Regles, Vec<Vec<u32>>) {
    let lignes = || entree.lines().map(str::trim).filter(|ligne| !ligne.is_empty());
    let regles = lignes()
        .filter_map(|ligne| ligne.split_once('|'))
        .filter_map(|(avant, apres)| Some((avant.parse().ok()?, apres.parse().ok()?)))
        .collect();
    let mises_a_jour = lignes()
        .filter(|ligne| !ligne.contains('|'))
        .map(|ligne| ligne.split(',').filter_map(|page| page.trim().parse().ok()).collect())
        .collect();
    (regles, mises_a_jour)
}

fn bien_rangee(regles: &Regles, pages: &[u32]) -> bool {
    pages
        .iter()
        .enumerate()
        .all(|(i, &page)| pages[i + 1..].iter().all(|&suivante| !regles.contains(&(suivante, page))))
}

fn comparer(regles: &Regles, a: u32, b: u32) -> Ordering {
    if regles.contains(&(a, b)) {
        Ordering::Less
    } else if regles.contains(&(b, a)) {
        Ordering::Greater
    } else {
        Ordering::Equal
    }
}

fn milieu(pages: &[u32]) -> u32 {
    pages[pages.len() / 2]
}

fn partie1(entree: &str) -> u32 {
    let (regles, mises_a_jour) = lire(entree);
    mises_a_jour
        .iter()
        .filter(|pages| bien_rangee(&regles, pages))
        .map(|pages| milieu(pages))
        .sum()
}

fn partie2(entree: &str) -> u32 {
    let (regles, mises_a_jour) = lire(entree);
    mises_a_jour
        .into_iter()
        .filter(|pages| !bien_rangee(&regles, pages))
        .map(|mut pages| {
            pages.sort_by(|&a, &b| comparer(&regles, a, b));
            milieu(&pages)
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
