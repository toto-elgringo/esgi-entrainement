fn nb_octets(s: &str) -> usize {
    todo!()
}

fn nb_caracteres(s: &str) -> usize {
    todo!()
}

fn main() {
    let texte = "Hé, 🦀 !";
    println!("{texte} : {} octets, {} caractères", nb_octets(texte), nb_caracteres(texte));
}
