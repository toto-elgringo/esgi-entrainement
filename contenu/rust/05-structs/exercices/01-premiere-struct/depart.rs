struct Livre {
}

fn creer_livre(titre: &str, pages: u32) -> Livre {
    todo!()
}

fn est_long(livre: &Livre) -> bool {
    todo!()
}

fn main() {
    let livre = creer_livre("Le Petit Prince", 96);
    println!("Long ? {}", est_long(&livre));
}
