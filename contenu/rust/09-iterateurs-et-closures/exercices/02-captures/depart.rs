fn compter_appels() -> u32 {
    let compteur = 0;
    let mut incrementer = || compteur += 1;
    incrementer();
    incrementer();
    incrementer();
    compteur
}

fn creer_salutation(nom: String) -> impl Fn() -> String {
    || format!("Bonjour {nom} !")
}

fn main() {
    println!("{}", compter_appels());
    let saluer = creer_salutation("Ana".to_string());
    println!("{}", saluer());
}
