use std::ops::Deref;

struct MaBoite<T>(T);

impl<T> MaBoite<T> {
    fn new(valeur: T) -> MaBoite<T> {
        todo!()
    }
}

impl<T> Deref for MaBoite<T> {
    type Target = T;

    fn deref(&self) -> &T {
        todo!()
    }
}

fn saluer(nom: &str) -> String {
    todo!()
}

fn nombre_de_lettres(texte: &str) -> usize {
    todo!()
}

fn main() {
    let prenom = MaBoite::new(String::from("Léa"));
    println!("{}", saluer(&prenom));
    println!("{} lettres", nombre_de_lettres(&prenom));
    let nombre = MaBoite::new(41);
    println!("{}", *nombre + 1);
}
