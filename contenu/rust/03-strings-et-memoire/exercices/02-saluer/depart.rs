fn saluer(nom: String) -> String {
    format!("Bonjour {nom} !")
}

fn main() {
    let prenom = String::from("Alice");
    println!("{}", saluer(&prenom));
    println!("{}", saluer("Bob"));
}
