fn plus_long<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn plus_long_de_trois<'a>(a: &'a str, b: &'a str, c: &'a str) -> &'a str {
    plus_long(plus_long(a, b), c)
}

fn main() {
    let premier = String::from("bonjour");
    let second = String::from("salut");
    println!("{}", plus_long(&premier, &second));
    println!("{}", plus_long_de_trois("un", "trois", "deux"));
}
