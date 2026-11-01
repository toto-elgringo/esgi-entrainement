use std::io::Read;

const EXEMPLE: &str = "        [S] [G]
[U]     [F] [T]
[R] [J] [W] [H]
 1   2   3   4

move 2 from 1 to 2
move 3 from 2 to 1
move 1 from 1 to 4
move 2 from 4 to 2";

struct Mouvement {
    nombre: usize,
    depart: usize,
    arrivee: usize,
}

fn lire_piles(dessin: &[&str]) -> Vec<Vec<char>> {
    let Some((numeros, caisses)) = dessin.split_last() else {
        return Vec::new();
    };
    let mut piles = vec![Vec::new(); numeros.split_whitespace().count()];
    for ligne in caisses.iter().rev() {
        for (pile, caisse) in piles.iter_mut().zip(ligne.chars().skip(1).step_by(4)) {
            if caisse.is_ascii_alphabetic() {
                pile.push(caisse);
            }
        }
    }
    piles
}

fn lire_mouvement(ligne: &str) -> Option<Mouvement> {
    let mots: Vec<&str> = ligne.split_whitespace().collect();
    match mots.as_slice() {
        ["move", nombre, "from", depart, "to", arrivee] => Some(Mouvement {
            nombre: nombre.parse().ok()?,
            depart: depart.parse().ok()?,
            arrivee: arrivee.parse().ok()?,
        }),
        _ => None,
    }
}

fn ranger(entree: &str, une_par_une: bool) -> String {
    let mut lignes = entree.lines();
    let dessin: Vec<&str> = lignes.by_ref().take_while(|ligne| !ligne.trim().is_empty()).collect();
    let mut piles = lire_piles(&dessin);
    for mouvement in lignes.filter_map(lire_mouvement) {
        let depart = &mut piles[mouvement.depart - 1];
        let mut bloc = depart.split_off(depart.len().saturating_sub(mouvement.nombre));
        if une_par_une {
            bloc.reverse();
        }
        piles[mouvement.arrivee - 1].extend(bloc);
    }
    piles.iter().filter_map(|pile| pile.last()).collect()
}

fn partie1(entree: &str) -> String {
    ranger(entree, true)
}

fn partie2(entree: &str) -> String {
    ranger(entree, false)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
