fn premier_mot(phrase: &str) -> &str {
    phrase.split_whitespace().next().unwrap_or("")
}

fn dernier_mot(phrase: &str) -> &str {
    phrase.split_whitespace().last().unwrap_or("")
}

fn main() {
    let phrase = String::from("Bonjour tout le monde");
    println!("{} ... {}", premier_mot(&phrase), dernier_mot(&phrase));
}
