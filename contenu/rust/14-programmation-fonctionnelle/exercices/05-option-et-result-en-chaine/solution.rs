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
    ligne
        .split_once(':')
        .and_then(|(_, age)| age.trim().parse().ok())
}

fn lire_personne(ligne: &str) -> Result<Personne, ErreurLecture> {
    let (nom, age) = ligne
        .split_once(':')
        .ok_or(ErreurLecture::SeparateurManquant)?;
    let nom = Some(nom.trim())
        .filter(|nom| !nom.is_empty())
        .ok_or(ErreurLecture::NomVide)?;
    let age = age.trim().parse().map_err(|_| ErreurLecture::AgeInvalide)?;
    Ok(Personne {
        nom: nom.to_string(),
        age,
    })
}

fn lire_toutes(lignes: &[&str]) -> Result<Vec<Personne>, ErreurLecture> {
    lignes.iter().map(|ligne| lire_personne(ligne)).collect()
}

fn noms_des_majeurs(lignes: &[&str]) -> Vec<String> {
    lignes
        .iter()
        .filter_map(|ligne| lire_personne(ligne).ok())
        .filter(|personne| personne.age >= 18)
        .map(|personne| personne.nom)
        .collect()
}

fn main() {
    println!("{:?}", extraire_age("Ana: 20"));
    println!("{:?}", lire_personne(" Léo :19"));
    println!("{:?}", lire_toutes(&["Ana:20", "Léo"]));
    println!("{:?}", noms_des_majeurs(&["Ana:20", "Léo:15", "???", "Mia:18"]));
}
