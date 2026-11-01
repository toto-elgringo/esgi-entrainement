use std::collections::HashSet;
use std::io::Read;

const EXEMPLE: &str = "L 5
D 5
L 8
U 10
R 9
D 10
R 4";

type Position = (i32, i32);

fn mouvements(entree: &str) -> Vec<(Position, usize)> {
    entree
        .lines()
        .filter_map(|ligne| ligne.trim().split_once(' '))
        .filter_map(|(direction, pas)| {
            let sens = match direction {
                "R" => (1, 0),
                "L" => (-1, 0),
                "U" => (0, 1),
                "D" => (0, -1),
                _ => return None,
            };
            Some((sens, pas.trim().parse().ok()?))
        })
        .collect()
}

fn suivre(devant: Position, noeud: Position) -> Position {
    let (dx, dy) = (devant.0 - noeud.0, devant.1 - noeud.1);
    if dx.abs() <= 1 && dy.abs() <= 1 {
        noeud
    } else {
        (noeud.0 + dx.signum(), noeud.1 + dy.signum())
    }
}

fn cases_visitees(entree: &str, longueur: usize) -> usize {
    let mut corde = vec![(0, 0); longueur];
    let mut visitees = HashSet::from([(0, 0)]);
    for ((sx, sy), pas) in mouvements(entree) {
        for _ in 0..pas {
            corde[0] = (corde[0].0 + sx, corde[0].1 + sy);
            let mut devant = corde[0];
            for noeud in corde.iter_mut().skip(1) {
                *noeud = suivre(devant, *noeud);
                devant = *noeud;
            }
            visitees.insert(devant);
        }
    }
    visitees.len()
}

fn partie1(entree: &str) -> usize {
    cases_visitees(entree, 2)
}

fn partie2(entree: &str) -> usize {
    cases_visitees(entree, 10)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
