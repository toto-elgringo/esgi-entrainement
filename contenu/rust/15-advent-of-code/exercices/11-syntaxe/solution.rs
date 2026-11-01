use std::io::Read;

const EXEMPLE: &str = "[({<>})]{<
<[(])>
{[(<>)]}(([<
((<{}>)}
<{[]}<()>
[<>({}[]>
(<[{}]>[(
{(<>[)]}
{<{}>[[]]((
[{<>}{(}]";

enum Etat {
    Corrompue(char),
    Incomplete(Vec<char>),
}

fn fermant(ouvrant: char) -> Option<char> {
    match ouvrant {
        '(' => Some(')'),
        '[' => Some(']'),
        '{' => Some('}'),
        '<' => Some('>'),
        _ => None,
    }
}

fn analyser(ligne: &str) -> Etat {
    let mut attendus = Vec::new();
    for caractere in ligne.trim().chars() {
        if let Some(attendu) = fermant(caractere) {
            attendus.push(attendu);
        } else if attendus.pop() != Some(caractere) {
            return Etat::Corrompue(caractere);
        }
    }
    Etat::Incomplete(attendus)
}

fn partie1(entree: &str) -> u64 {
    entree
        .lines()
        .map(|ligne| match analyser(ligne) {
            Etat::Corrompue(')') => 3,
            Etat::Corrompue(']') => 57,
            Etat::Corrompue('}') => 1197,
            Etat::Corrompue(_) => 25137,
            Etat::Incomplete(_) => 0,
        })
        .sum()
}

fn score_completion(attendus: &[char]) -> u64 {
    attendus.iter().rev().fold(0, |score, fermant| {
        let valeur = match fermant {
            ')' => 1,
            ']' => 2,
            '}' => 3,
            _ => 4,
        };
        score * 5 + valeur
    })
}

fn partie2(entree: &str) -> u64 {
    let mut scores: Vec<u64> = entree
        .lines()
        .filter_map(|ligne| match analyser(ligne) {
            Etat::Incomplete(attendus) if !attendus.is_empty() => Some(score_completion(&attendus)),
            _ => None,
        })
        .collect();
    scores.sort_unstable();
    scores.get(scores.len() / 2).copied().unwrap_or(0)
}

fn main() {
    let mut texte = String::new();
    let _ = std::io::stdin().read_to_string(&mut texte);
    let entree = if texte.trim().is_empty() { EXEMPLE } else { texte.as_str() };
    println!("Partie 1 : {}", partie1(entree));
    println!("Partie 2 : {}", partie2(entree));
}
