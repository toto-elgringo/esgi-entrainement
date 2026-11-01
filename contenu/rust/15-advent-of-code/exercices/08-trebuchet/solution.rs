use std::io::Read;

const EXEMPLE: &str = "q7zx2kb
fiveab3cd
4nkfoureightwo
twonepq
zero5nine
xsevenx
9";

const MOTS: [&str; 9] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

fn chiffre_au_debut(reste: &[u8], avec_mots: bool) -> Option<u32> {
    let premier = *reste.first()?;
    if premier.is_ascii_digit() {
        return Some(u32::from(premier - b'0'));
    }
    if !avec_mots {
        return None;
    }
    MOTS.iter()
        .position(|mot| reste.starts_with(mot.as_bytes()))
        .map(|indice| indice as u32 + 1)
}

fn valeur(ligne: &str, avec_mots: bool) -> u32 {
    let octets = ligne.as_bytes();
    let chiffres: Vec<u32> = (0..octets.len())
        .filter_map(|debut| chiffre_au_debut(&octets[debut..], avec_mots))
        .collect();
    match (chiffres.first(), chiffres.last()) {
        (Some(premier), Some(dernier)) => 10 * premier + dernier,
        _ => 0,
    }
}

fn partie1(entree: &str) -> u32 {
    entree.lines().map(|ligne| valeur(ligne, false)).sum()
}

fn partie2(entree: &str) -> u32 {
    entree.lines().map(|ligne| valeur(ligne, true)).sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
