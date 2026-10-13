struct Livre {
    titre: String,
    pages: u32,
}

fn creer_livre(titre: &str, pages: u32) -> Livre {
    Livre {
        titre: titre.to_string(),
        pages,
    }
}

fn est_long(livre: &Livre) -> bool {
    livre.pages > 300
}

fn main() {
    let livre = creer_livre("Le Petit Prince", 96);
    println!("{} : long ? {}", livre.titre, est_long(&livre));
}
