fn mots_longs(phrase: &str) -> Vec<String> {
    phrase
        .split_whitespace()
        .filter(|mot| mot.len() >= 5)
        .map(str::to_uppercase)
        .collect()
}

fn total_lettres(phrase: &str) -> usize {
    phrase
        .split_whitespace()
        .filter(|mot| mot.len() >= 5)
        .map(str::len)
        .sum()
}

fn main() {
    let phrase = "la programmation fonctionnelle est agreable et utile";
    println!("{:?}", mots_longs(phrase));
    println!("total : {}", total_lettres(phrase));
}
