fn plus_long(a: &str, b: &str) -> &str {
    if a.len() >= b.len() { a } else { b }
}

fn plus_long_de_trois(a: &str, b: &str, c: &str) -> &str {
    todo!()
}

fn main() {
    let premier = String::from("bonjour");
    let second = String::from("salut");
    println!("{}", plus_long(&premier, &second));
    println!("{}", plus_long_de_trois("un", "trois", "deux"));
}
