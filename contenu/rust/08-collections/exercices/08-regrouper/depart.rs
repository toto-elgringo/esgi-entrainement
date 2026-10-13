use std::collections::HashMap;

fn regrouper_par_initiale(mots: &[&str]) -> HashMap<char, Vec<String>> {
    todo!()
}

fn main() {
    let groupes = regrouper_par_initiale(&["pomme", "poire", "banane", "cerise", "prune"]);
    println!("{:?}", groupes.get(&'p'));
}
