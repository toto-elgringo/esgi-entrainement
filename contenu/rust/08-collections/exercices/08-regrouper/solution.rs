use std::collections::HashMap;

fn regrouper_par_initiale(mots: &[&str]) -> HashMap<char, Vec<String>> {
    let mut groupes: HashMap<char, Vec<String>> = HashMap::new();
    for mot in mots {
        if let Some(initiale) = mot.chars().next() {
            groupes.entry(initiale).or_default().push(mot.to_string());
        }
    }
    groupes
}

fn main() {
    let groupes = regrouper_par_initiale(&["pomme", "poire", "banane", "cerise", "prune"]);
    println!("{:?}", groupes.get(&'p'));
}
