use std::io::Read;

const EXEMPLE: &str = "dBKacehGjcif
oKnPlmtPsuqr
zAwyvxDyFKCE
JMmHLISQNMRO
WgXTVUbZmYga
qmprnovrtwsu";

fn priorite(objet: u8) -> u32 {
    match objet {
        b'a'..=b'z' => u32::from(objet - b'a') + 1,
        b'A'..=b'Z' => u32::from(objet - b'A') + 27,
        _ => 0,
    }
}

fn sacs(entree: &str) -> Vec<&[u8]> {
    entree
        .lines()
        .map(|ligne| ligne.trim().as_bytes())
        .filter(|sac| !sac.is_empty())
        .collect()
}

fn partie1(entree: &str) -> u32 {
    sacs(entree)
        .into_iter()
        .filter_map(|sac| {
            let (poche1, poche2) = sac.split_at(sac.len() / 2);
            poche1.iter().find(|objet| poche2.contains(objet))
        })
        .map(|&objet| priorite(objet))
        .sum()
}

fn partie2(entree: &str) -> u32 {
    sacs(entree)
        .chunks(3)
        .filter_map(|groupe| match groupe {
            [a, b, c] => a.iter().find(|objet| b.contains(objet) && c.contains(objet)),
            _ => None,
        })
        .map(|&objet| priorite(objet))
        .sum()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
