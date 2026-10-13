use std::collections::HashMap;

fn decouper_en_mots(texte: &str) -> Vec<String> {
    texte
        .split(|c: char| !c.is_alphanumeric())
        .filter(|mot| !mot.is_empty())
        .map(|mot| mot.to_lowercase())
        .collect()
}

fn compter_mots(texte: &str) -> usize {
    decouper_en_mots(texte).len()
}

fn frequences(texte: &str) -> HashMap<String, usize> {
    let mut compte = HashMap::new();
    for mot in decouper_en_mots(texte) {
        *compte.entry(mot).or_insert(0) += 1;
    }
    compte
}

fn mot_le_plus_frequent(texte: &str) -> Option<(String, usize)> {
    frequences(texte)
        .into_iter()
        .max_by(|(mot_a, n_a), (mot_b, n_b)| n_a.cmp(n_b).then(mot_b.cmp(mot_a)))
}

fn main() {
    let texte = "Le chat et le chien. LE chat !";
    println!("{} mots", compter_mots(texte));
    println!("{:?}", frequences(texte));
    println!("{:?}", mot_le_plus_frequent(texte));
}
