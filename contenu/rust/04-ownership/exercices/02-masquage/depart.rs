fn doubler_texte(saisie: &str) -> u32 {
    let saisie = saisie.trim();
    saisie = saisie.parse().unwrap();
    saisie * 2
}

fn main() {
    println!("{}", doubler_texte(" 21 "));
}
