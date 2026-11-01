fn extraire_nombres(texte: &str) -> Vec<u32> {
    texte
        .split_whitespace()
        .filter_map(|mot| mot.parse().ok())
        .collect()
}

fn domaines(emails: &[&str]) -> Vec<String> {
    emails
        .iter()
        .filter_map(|email| {
            email
                .split_once('@')
                .map(|(_, domaine)| domaine)
                .filter(|domaine| !domaine.is_empty())
        })
        .map(String::from)
        .collect()
}

fn tous_les_mots(phrases: &[&str]) -> Vec<String> {
    phrases
        .iter()
        .flat_map(|phrase| phrase.split_whitespace())
        .map(str::to_lowercase)
        .collect()
}

fn cases(colonnes: &str, lignes: u32) -> Vec<String> {
    colonnes
        .chars()
        .flat_map(|colonne| (1..=lignes).map(move |ligne| format!("{colonne}{ligne}")))
        .collect()
}

fn main() {
    println!("{:?}", extraire_nombres("j'ai 3 chats et 12 poissons"));
    println!("{:?}", domaines(&["ana@esgi.fr", "pas-un-email", "leo@mail.com"]));
    println!("{:?}", tous_les_mots(&["Le chat", "dort ICI"]));
    println!("{:?}", cases("ab", 3));
}
