fn creer_salutation(nom: &str) -> &str {
    let message = format!("Bonjour, {nom} !");
    &message
}

fn repeter(mot: &str, fois: usize) -> &str {
    let resultat = mot.repeat(fois);
    &resultat
}

fn main() {
    println!("{}", creer_salutation("Léa"));
    println!("{}", repeter("ha", 3));
}
