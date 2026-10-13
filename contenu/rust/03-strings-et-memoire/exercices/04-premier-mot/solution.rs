fn premier_mot(s: &str) -> &str {
    for (position, caractere) in s.char_indices() {
        if caractere == ' ' {
            return &s[..position];
        }
    }
    s
}

fn main() {
    println!("{}", premier_mot("bonjour le monde"));
}
