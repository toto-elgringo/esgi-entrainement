fn creer_salutation(nom: &str) -> String {
    format!("Bonjour, {nom} !")
}

fn repeter(mot: &str, fois: usize) -> String {
    mot.repeat(fois)
}

fn main() {
    println!("{}", creer_salutation("Léa"));
    println!("{}", repeter("ha", 3));
}
