#[derive(Debug, PartialEq)]
struct Requete {
    methode: String,
    chemin: String,
}

fn analyser(ligne: &str) -> Option<Requete> {
    todo!()
}

fn main() {
    println!("{:?}", analyser("GET /users/42"));
    println!("{:?}", analyser("GET"));
}
