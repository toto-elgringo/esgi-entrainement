fn chercher_age(nom: &str) -> Option<u32> {
    match nom {
        "Alice" => Some(30),
        "Bob" => Some(25),
        _ => None,
    }
}

fn main() {
    for nom in ["Alice", "Zoé", "Bob"] {
        if let Some(age) = chercher_age(nom) {
            println!("{nom} a {age} ans");
        } else {
            println!("{nom} : âge inconnu");
        }
    }

    let age_prochain = chercher_age("Alice").map(|age| age + 1);
    if let Some(age) = age_prochain {
        println!("L'an prochain, Alice aura {age} ans");
    }
}
