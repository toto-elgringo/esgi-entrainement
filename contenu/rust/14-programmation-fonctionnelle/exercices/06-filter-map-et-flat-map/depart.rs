fn extraire_nombres(texte: &str) -> Vec<u32> {
    todo!()
}

fn domaines(emails: &[&str]) -> Vec<String> {
    todo!()
}

fn tous_les_mots(phrases: &[&str]) -> Vec<String> {
    todo!()
}

fn cases(colonnes: &str, lignes: u32) -> Vec<String> {
    todo!()
}

fn main() {
    println!("{:?}", extraire_nombres("j'ai 3 chats et 12 poissons"));
    println!("{:?}", domaines(&["ana@esgi.fr", "pas-un-email", "leo@mail.com"]));
    println!("{:?}", tous_les_mots(&["Le chat", "dort ICI"]));
    println!("{:?}", cases("ab", 3));
}
