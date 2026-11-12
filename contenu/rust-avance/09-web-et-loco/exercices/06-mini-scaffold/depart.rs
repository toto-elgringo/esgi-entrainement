fn scaffold(nom: &str, champs: &[(&str, &str)]) -> String {
    todo!()
}

fn main() {
    println!("{}", scaffold("capteur", &[("nom", "string"), ("valeur", "double")]));
    println!();
    println!("{}", scaffold("mesure", &[("valeur", "double"), ("capteur", "int")]));
}
