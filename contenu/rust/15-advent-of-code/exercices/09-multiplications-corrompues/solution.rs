use std::io::Read;

const EXEMPLE: &str = "+mul(3,4)*mul(10 ,2)%don't()_mul(5,5)?mul(2,3]
where(do()mul(100,2)from()mul(1234,1)what()mul(7,7)#don't()
xmul(6,6)'do(mul(1,9)do()]mul(4,6)";

enum Instruction {
    Multiplier(u64),
    Activer,
    Desactiver,
}

fn lire_nombre(texte: &[u8]) -> Option<(u64, &[u8])> {
    let longueur = texte.iter().take(3).take_while(|octet| octet.is_ascii_digit()).count();
    if longueur == 0 {
        return None;
    }
    let nombre = texte[..longueur]
        .iter()
        .fold(0, |valeur, octet| valeur * 10 + u64::from(octet - b'0'));
    Some((nombre, &texte[longueur..]))
}

fn lire_mul(texte: &[u8]) -> Option<u64> {
    let reste = texte.strip_prefix(b"mul(")?;
    let (x, reste) = lire_nombre(reste)?;
    let reste = reste.strip_prefix(b",")?;
    let (y, reste) = lire_nombre(reste)?;
    reste.starts_with(b")").then_some(x * y)
}

fn instructions(entree: &str) -> Vec<Instruction> {
    let memoire = entree.as_bytes();
    (0..memoire.len())
        .filter_map(|debut| {
            let reste = &memoire[debut..];
            if reste.starts_with(b"do()") {
                Some(Instruction::Activer)
            } else if reste.starts_with(b"don't()") {
                Some(Instruction::Desactiver)
            } else {
                lire_mul(reste).map(Instruction::Multiplier)
            }
        })
        .collect()
}

fn partie1(entree: &str) -> u64 {
    instructions(entree)
        .iter()
        .map(|instruction| match instruction {
            Instruction::Multiplier(produit) => *produit,
            _ => 0,
        })
        .sum()
}

fn partie2(entree: &str) -> u64 {
    let mut actif = true;
    let mut somme = 0;
    for instruction in instructions(entree) {
        match instruction {
            Instruction::Activer => actif = true,
            Instruction::Desactiver => actif = false,
            Instruction::Multiplier(produit) if actif => somme += produit,
            Instruction::Multiplier(_) => {}
        }
    }
    somme
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
