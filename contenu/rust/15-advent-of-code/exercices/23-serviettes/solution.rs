use std::collections::HashSet;
use std::io::Read;

const EXEMPLE: &str = "w, u, g, bw, rg, ub, gru, wr, bwu

bwrg
ubwu
grub
wrgu
ugrug
bbw
ubwrgu
gwubwu
wrgruwbw";

fn lire_entree(entree: &str) -> (Vec<&str>, Vec<&str>) {
    let mut lignes = entree.lines().map(str::trim).filter(|ligne| !ligne.is_empty());
    let motifs = lignes.next().unwrap_or("").split(',').map(str::trim).collect();
    let dessins = lignes.collect();
    (motifs, dessins)
}

fn nombre_de_facons(dessin: &str, motifs: &HashSet<&str>, longueur_max: usize) -> u64 {
    let taille = dessin.len();
    let mut facons = vec![0u64; taille + 1];
    facons[taille] = 1;
    for debut in (0..taille).rev() {
        for longueur in 1..=longueur_max.min(taille - debut) {
            if motifs.contains(&dessin[debut..debut + longueur]) {
                facons[debut] += facons[debut + longueur];
            }
        }
    }
    facons[0]
}

fn facons_par_dessin(entree: &str) -> Vec<u64> {
    let (motifs, dessins) = lire_entree(entree);
    let longueur_max = motifs.iter().map(|motif| motif.len()).max().unwrap_or(0);
    let motifs: HashSet<&str> = motifs.into_iter().collect();
    dessins.iter().map(|dessin| nombre_de_facons(dessin, &motifs, longueur_max)).collect()
}

fn partie1(entree: &str) -> usize {
    facons_par_dessin(entree).iter().filter(|&&facons| facons > 0).count()
}

fn partie2(entree: &str) -> u64 {
    facons_par_dessin(entree).iter().sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
