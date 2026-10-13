use std::collections::HashMap;

fn compter_mots(texte: &str) -> HashMap<String, u32> {
    todo!()
}

fn nombre_de(compteur: &HashMap<String, u32>, mot: &str) -> u32 {
    todo!()
}

fn main() {
    let compteur = compter_mots("Le chat et le chien");
    println!("{:?}", compteur);
    println!("le : {}", nombre_de(&compteur, "le"));
}
