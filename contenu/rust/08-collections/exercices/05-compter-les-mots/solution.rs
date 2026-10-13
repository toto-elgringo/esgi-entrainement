use std::collections::HashMap;

fn compter_mots(texte: &str) -> HashMap<String, u32> {
    let mut compteur = HashMap::new();
    for mot in texte.split_whitespace() {
        *compteur.entry(mot.to_lowercase()).or_insert(0) += 1;
    }
    compteur
}

fn nombre_de(compteur: &HashMap<String, u32>, mot: &str) -> u32 {
    match compteur.get(mot) {
        Some(n) => *n,
        None => 0,
    }
}

fn main() {
    let compteur = compter_mots("Le chat et le chien");
    println!("{:?}", compteur);
    println!("le : {}", nombre_de(&compteur, "le"));
}
