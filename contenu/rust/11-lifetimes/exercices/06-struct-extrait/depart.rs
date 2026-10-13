struct Extrait {
    texte: &str,
}

impl Extrait {
    fn nouveau(texte: &str) -> Extrait {
        todo!()
    }

    fn premiere_phrase(&self) -> &str {
        todo!()
    }

    fn nombre_de_mots(&self) -> usize {
        todo!()
    }
}

fn main() {
    let livre = String::from("Il était une fois un crabe. Il aimait Rust. Fin.");
    let extrait = Extrait::nouveau(&livre);
    println!("{}", extrait.premiere_phrase());
    println!("{} mots", extrait.nombre_de_mots());
}
