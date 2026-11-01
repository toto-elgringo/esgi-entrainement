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

fn partie1(entree: &str) -> u64 {
    todo!()
}

fn partie2(entree: &str) -> u64 {
    todo!()
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
