fn chercher_age(nom: &str) -> Option<u32> {
    match nom {
        "Alice" => Some(30),
        "Bob" => Some(25),
        _ => None,
    }
}

fn main() {
    let age = chercher_age("Alice");
    println!("{:?}", age);
}
