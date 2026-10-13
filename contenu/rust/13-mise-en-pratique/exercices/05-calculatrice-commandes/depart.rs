#[derive(Debug, PartialEq)]
enum Commande {
    Ajoute(i64),
    Retire(i64),
    Multiplie(i64),
    Reset,
}

#[derive(Debug, PartialEq)]
enum ErreurCommande {
    Inconnue(String),
    ArgumentManquant(String),
    NombreInvalide(String),
}

fn analyser(ligne: &str) -> Result<Commande, ErreurCommande> {
    todo!()
}

fn executer(programme: &str) -> Result<i64, (usize, ErreurCommande)> {
    todo!()
}

fn main() {
    println!("{:?}", executer("ajoute 5\nmultiplie 3\nretire 1"));
    println!("{:?}", executer("ajoute 1\n\nmultiplie x"));
}
