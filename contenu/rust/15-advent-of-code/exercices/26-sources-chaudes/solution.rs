use std::io::Read;

const EXEMPLE: &str = "?#?.#?? 2,1,1
..??#??.# 4,1
???.?#. 1,1,1
#??.??##. 2,4
.?.?#?#?. 1,3
??##?.?? 4,1
?????.#? 2,1,1";

fn lire_ligne(ligne: &str) -> Option<(&str, Vec<usize>)> {
    let (motif, groupes) = ligne.trim().split_once(' ')?;
    let groupes = groupes.split(',').filter_map(|nombre| nombre.trim().parse().ok()).collect();
    Some((motif, groupes))
}

fn compter(motif: &[u8], groupes: &[usize], cache: &mut [Vec<Option<u64>>]) -> u64 {
    if groupes.is_empty() {
        return if motif.contains(&b'#') { 0 } else { 1 };
    }
    if motif.is_empty() {
        return 0;
    }
    if let Some(deja_calcule) = cache[motif.len()][groupes.len()] {
        return deja_calcule;
    }
    let mut total = 0;
    if motif[0] != b'#' {
        total += compter(&motif[1..], groupes, cache);
    }
    let taille = groupes[0];
    if motif.len() >= taille && !motif[..taille].contains(&b'.') && motif.get(taille) != Some(&b'#') {
        let reste = motif.get(taille + 1..).unwrap_or(&[]);
        total += compter(reste, &groupes[1..], cache);
    }
    cache[motif.len()][groupes.len()] = Some(total);
    total
}

fn arrangements(motif: &str, groupes: &[usize]) -> u64 {
    let mut cache = vec![vec![None; groupes.len() + 1]; motif.len() + 1];
    compter(motif.as_bytes(), groupes, &mut cache)
}

fn partie1(entree: &str) -> u64 {
    entree
        .lines()
        .filter_map(lire_ligne)
        .map(|(motif, groupes)| arrangements(motif, &groupes))
        .sum()
}

fn partie2(entree: &str) -> u64 {
    entree
        .lines()
        .filter_map(lire_ligne)
        .map(|(motif, groupes)| arrangements(&[motif; 5].join("?"), &groupes.repeat(5)))
        .sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
