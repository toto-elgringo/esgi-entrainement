use std::collections::VecDeque;
use std::io::Read;

const EXEMPLE: &str = "abcdefghi
awxyzzzzj
SvcEzyxwk
audefghil
atsrqponm";

struct Carte {
    hauteurs: Vec<Vec<u8>>,
    depart: (usize, usize),
    arrivee: (usize, usize),
}

fn lire_carte(entree: &str) -> Carte {
    let mut hauteurs = Vec::new();
    let mut depart = (0, 0);
    let mut arrivee = (0, 0);
    for (ligne, texte) in entree.lines().map(str::trim).filter(|texte| !texte.is_empty()).enumerate() {
        let mut rangee = Vec::new();
        for (colonne, case) in texte.bytes().enumerate() {
            let hauteur = match case {
                b'S' => {
                    depart = (ligne, colonne);
                    b'a'
                }
                b'E' => {
                    arrivee = (ligne, colonne);
                    b'z'
                }
                autre => autre,
            };
            rangee.push(hauteur);
        }
        hauteurs.push(rangee);
    }
    Carte { hauteurs, depart, arrivee }
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

fn distances_jusqu_a_arrivee(carte: &Carte) -> Vec<Vec<Option<usize>>> {
    let lignes = carte.hauteurs.len();
    let colonnes = carte.hauteurs[0].len();
    let mut distances = vec![vec![None; colonnes]; lignes];
    let mut file = VecDeque::new();
    let (ligne_arrivee, colonne_arrivee) = carte.arrivee;
    distances[ligne_arrivee][colonne_arrivee] = Some(0);
    file.push_back((ligne_arrivee, colonne_arrivee, 0));
    while let Some((ligne, colonne, distance)) = file.pop_front() {
        let hauteur = carte.hauteurs[ligne][colonne];
        for (voisin_ligne, voisin_colonne) in voisins(ligne, colonne, lignes, colonnes) {
            let hauteur_voisin = carte.hauteurs[voisin_ligne][voisin_colonne];
            if distances[voisin_ligne][voisin_colonne].is_none() && hauteur <= hauteur_voisin + 1 {
                distances[voisin_ligne][voisin_colonne] = Some(distance + 1);
                file.push_back((voisin_ligne, voisin_colonne, distance + 1));
            }
        }
    }
    distances
}

fn partie1(entree: &str) -> usize {
    let carte = lire_carte(entree);
    let distances = distances_jusqu_a_arrivee(&carte);
    let (ligne, colonne) = carte.depart;
    distances[ligne][colonne].expect("l'arrivée est inaccessible depuis le départ")
}

fn partie2(entree: &str) -> usize {
    let carte = lire_carte(entree);
    let distances = distances_jusqu_a_arrivee(&carte);
    carte
        .hauteurs
        .iter()
        .zip(&distances)
        .flat_map(|(rangee, distances_rangee)| rangee.iter().zip(distances_rangee))
        .filter(|(hauteur, _)| **hauteur == b'a')
        .filter_map(|(_, distance)| *distance)
        .min()
        .expect("aucune case de hauteur a ne mène à l'arrivée")
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
