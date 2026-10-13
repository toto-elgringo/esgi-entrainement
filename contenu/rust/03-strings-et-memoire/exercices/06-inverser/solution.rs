fn inverser(s: &str) -> String {
    let mut resultat = String::new();
    for caractere in s.chars() {
        resultat.insert(0, caractere);
    }
    resultat
}

fn main() {
    println!("{}", inverser("Hé🦀"));
}
