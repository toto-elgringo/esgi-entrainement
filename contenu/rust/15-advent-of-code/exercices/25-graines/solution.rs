use std::io::Read;

const EXEMPLE: &str = "seeds: 61 8 12 25

seed-to-soil map:
70 60 10
30 10 20

soil-to-fertilizer map:
0 40 15
55 0 20

fertilizer-to-water map:
90 70 10
20 5 8

water-to-light map:
10 25 30

light-to-temperature map:
60 0 10
0 60 25

temperature-to-humidity map:
45 20 5
20 45 5

humidity-to-location map:
35 90 10
5 15 12";

struct Regle {
    destination: u64,
    source: u64,
    longueur: u64,
}

fn lire_entree(entree: &str) -> (Vec<u64>, Vec<Vec<Regle>>) {
    let mut graines = Vec::new();
    let mut cartes: Vec<Vec<Regle>> = Vec::new();
    for ligne in entree.lines().map(str::trim).filter(|ligne| !ligne.is_empty()) {
        if let Some(nombres) = ligne.strip_prefix("seeds:") {
            graines = nombres.split_whitespace().filter_map(|nombre| nombre.parse().ok()).collect();
        } else if ligne.ends_with("map:") {
            cartes.push(Vec::new());
        } else {
            let nombres: Vec<u64> = ligne.split_whitespace().filter_map(|nombre| nombre.parse().ok()).collect();
            if let (Some(carte), [destination, source, longueur]) = (cartes.last_mut(), nombres.as_slice()) {
                carte.push(Regle { destination: *destination, source: *source, longueur: *longueur });
            }
        }
    }
    (graines, cartes)
}

fn convertir(nombre: u64, carte: &[Regle]) -> u64 {
    for regle in carte {
        if regle.source <= nombre && nombre < regle.source + regle.longueur {
            return regle.destination + (nombre - regle.source);
        }
    }
    nombre
}

fn convertir_intervalles(intervalles: Vec<(u64, u64)>, carte: &[Regle]) -> Vec<(u64, u64)> {
    let mut resultat = Vec::new();
    let mut a_traiter = intervalles;
    while let Some((debut, fin)) = a_traiter.pop() {
        let regle_touchee = carte.iter().find(|regle| debut.max(regle.source) < fin.min(regle.source + regle.longueur));
        match regle_touchee {
            Some(regle) => {
                let debut_commun = debut.max(regle.source);
                let fin_commune = fin.min(regle.source + regle.longueur);
                resultat.push((
                    regle.destination + (debut_commun - regle.source),
                    regle.destination + (fin_commune - regle.source),
                ));
                if debut < debut_commun {
                    a_traiter.push((debut, debut_commun));
                }
                if fin_commune < fin {
                    a_traiter.push((fin_commune, fin));
                }
            }
            None => resultat.push((debut, fin)),
        }
    }
    resultat
}

fn partie1(entree: &str) -> u64 {
    let (graines, cartes) = lire_entree(entree);
    graines
        .iter()
        .map(|&graine| cartes.iter().fold(graine, |nombre, carte| convertir(nombre, carte)))
        .min()
        .unwrap_or(0)
}

fn partie2(entree: &str) -> u64 {
    let (graines, cartes) = lire_entree(entree);
    let (paires, _) = graines.as_chunks::<2>();
    let intervalles: Vec<(u64, u64)> = paires.iter().map(|&[debut, longueur]| (debut, debut + longueur)).collect();
    cartes
        .iter()
        .fold(intervalles, |intervalles, carte| convertir_intervalles(intervalles, carte))
        .iter()
        .map(|&(debut, _)| debut)
        .min()
        .unwrap_or(0)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
