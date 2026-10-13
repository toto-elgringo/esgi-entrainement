use std::collections::HashMap;

fn compter_mots(texte: &str) -> usize {
    todo!()
}

fn frequences(texte: &str) -> HashMap<String, usize> {
    todo!()
}

fn mot_le_plus_frequent(texte: &str) -> Option<(String, usize)> {
    todo!()
}

fn main() {
    let texte = "Le chat et le chien. LE chat !";
    println!("{} mots", compter_mots(texte));
    println!("{:?}", frequences(texte));
    println!("{:?}", mot_le_plus_frequent(texte));
}
