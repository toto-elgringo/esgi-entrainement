use std::io::Read;

const EXEMPLE: &str = "MAMSXXMAMA
XXMSASMSXS
AXMAMSAMXS
XMASSMXAMS
XXAXXMAMAM
SMMMSMAMSA
XAAMMSASAX
SSMSASASSS";

const DIRECTIONS: [(isize, isize); 8] = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)];

fn grille(entree: &str) -> Vec<&[u8]> {
    entree
        .lines()
        .map(|ligne| ligne.trim().as_bytes())
        .filter(|ligne| !ligne.is_empty())
        .collect()
}

fn lettre(grille: &[&[u8]], ligne: isize, colonne: isize) -> Option<u8> {
    let ligne = usize::try_from(ligne).ok()?;
    let colonne = usize::try_from(colonne).ok()?;
    grille.get(ligne)?.get(colonne).copied()
}

fn cases(grille: &[&[u8]]) -> impl Iterator<Item = (isize, isize)> {
    grille
        .iter()
        .zip(0..)
        .flat_map(|(ligne, l)| (0..).take(ligne.len()).map(move |c| (l, c)))
}

fn partie1(entree: &str) -> usize {
    let grille = grille(entree);
    cases(&grille)
        .map(|(l, c)| {
            DIRECTIONS
                .iter()
                .filter(|&&(dl, dc)| {
                    b"XMAS"
                        .iter()
                        .zip(0..)
                        .all(|(&attendue, k)| lettre(&grille, l + k * dl, c + k * dc) == Some(attendue))
                })
                .count()
        })
        .sum()
}

fn diagonale_mas(un_bout: Option<u8>, autre_bout: Option<u8>) -> bool {
    matches!((un_bout, autre_bout), (Some(b'M'), Some(b'S')) | (Some(b'S'), Some(b'M')))
}

fn partie2(entree: &str) -> usize {
    let grille = grille(entree);
    cases(&grille)
        .filter(|&(l, c)| {
            lettre(&grille, l, c) == Some(b'A')
                && diagonale_mas(lettre(&grille, l - 1, c - 1), lettre(&grille, l + 1, c + 1))
                && diagonale_mas(lettre(&grille, l - 1, c + 1), lettre(&grille, l + 1, c - 1))
        })
        .count()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
