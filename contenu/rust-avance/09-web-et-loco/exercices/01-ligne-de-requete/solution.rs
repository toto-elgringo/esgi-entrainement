#[derive(Debug, PartialEq)]
struct Requete {
    methode: String,
    chemin: String,
}

fn analyser(ligne: &str) -> Option<Requete> {
    let mut mots = ligne.split_whitespace();
    let methode = mots.next()?;
    let chemin = mots.next()?;
    if mots.next().is_some() || !chemin.starts_with('/') {
        return None;
    }
    Some(Requete {
        methode: methode.to_string(),
        chemin: chemin.to_string(),
    })
}

fn main() {
    println!("{:?}", analyser("GET /users/42"));
    println!("{:?}", analyser("GET"));
}
