fn nb_octets(s: &str) -> usize {
    s.len()
}

fn nb_caracteres(s: &str) -> usize {
    s.chars().count()
}

fn main() {
    let texte = "Hé, 🦀 !";
    println!("{texte} : {} octets, {} caractères", nb_octets(texte), nb_caracteres(texte));
}
