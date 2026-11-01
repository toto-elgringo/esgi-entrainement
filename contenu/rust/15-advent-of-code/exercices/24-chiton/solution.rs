use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::Read;

const EXEMPLE: &str = "1291118
6191519
8181716
7111917
9687819
5896721
8979863";

fn lire_grille(entree: &str) -> Vec<Vec<u32>> {
    entree
        .lines()
        .map(str::trim)
        .filter(|ligne| !ligne.is_empty())
        .map(|ligne| ligne.chars().filter_map(|chiffre| chiffre.to_digit(10)).collect())
        .collect()
}

fn agrandir(grille: &[Vec<u32>]) -> Vec<Vec<u32>> {
    let lignes = grille.len();
    let colonnes = grille[0].len();
    (0..lignes * 5)
        .map(|ligne| {
            (0..colonnes * 5)
                .map(|colonne| {
                    let decalage = (ligne / lignes + colonne / colonnes) as u32;
                    (grille[ligne % lignes][colonne % colonnes] + decalage - 1) % 9 + 1
                })
                .collect()
        })
        .collect()
}

fn voisins(ligne: usize, colonne: usize, lignes: usize, colonnes: usize) -> Vec<(usize, usize)> {
    let mut resultat = Vec::new();
    if ligne > 0 {
        resultat.push((ligne - 1, colonne));
    }
    if ligne + 1 < lignes {
        resultat.push((ligne + 1, colonne));
    }
    if colonne > 0 {
        resultat.push((ligne, colonne - 1));
    }
    if colonne + 1 < colonnes {
        resultat.push((ligne, colonne + 1));
    }
    resultat
}

fn risque_minimal(grille: &[Vec<u32>]) -> u32 {
    let lignes = grille.len();
    let colonnes = grille[0].len();
    let arrivee = (lignes - 1, colonnes - 1);
    let mut meilleurs = vec![vec![u32::MAX; colonnes]; lignes];
    let mut tas = BinaryHeap::new();
    meilleurs[0][0] = 0;
    tas.push(Reverse((0, 0, 0)));
    while let Some(Reverse((risque, ligne, colonne))) = tas.pop() {
        if (ligne, colonne) == arrivee {
            return risque;
        }
        if risque > meilleurs[ligne][colonne] {
            continue;
        }
        for (voisin_ligne, voisin_colonne) in voisins(ligne, colonne, lignes, colonnes) {
            let nouveau = risque + grille[voisin_ligne][voisin_colonne];
            if nouveau < meilleurs[voisin_ligne][voisin_colonne] {
                meilleurs[voisin_ligne][voisin_colonne] = nouveau;
                tas.push(Reverse((nouveau, voisin_ligne, voisin_colonne)));
            }
        }
    }
    meilleurs[arrivee.0][arrivee.1]
}

fn partie1(entree: &str) -> u32 {
    risque_minimal(&lire_grille(entree))
}

fn partie2(entree: &str) -> u32 {
    risque_minimal(&agrandir(&lire_grille(entree)))
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
