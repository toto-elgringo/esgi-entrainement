#[derive(Debug, PartialEq)]
struct Personne {
    nom: String,
    age: u32,
}

#[derive(Debug, PartialEq)]
enum ErreurLecture {
    SeparateurManquant,
    NomVide,
    AgeInvalide,
}

fn extraire_age(ligne: &str) -> Option<u32> {
    todo!()
}

fn lire_personne(ligne: &str) -> Result<Personne, ErreurLecture> {
    todo!()
}

fn lire_toutes(lignes: &[&str]) -> Result<Vec<Personne>, ErreurLecture> {
    todo!()
}

fn noms_des_majeurs(lignes: &[&str]) -> Vec<String> {
    todo!()
}

fn main() {
    println!("{:?}", extraire_age("Ana: 20"));
    println!("{:?}", lire_personne(" Léo :19"));
    println!("{:?}", lire_toutes(&["Ana:20", "Léo"]));
    println!("{:?}", noms_des_majeurs(&["Ana:20", "Léo:15", "???", "Mia:18"]));
}
