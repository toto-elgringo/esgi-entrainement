struct Extrait<'a> {
    texte: &'a str,
}

impl<'a> Extrait<'a> {
    fn nouveau(texte: &'a str) -> Extrait<'a> {
        Extrait { texte }
    }

    fn premiere_phrase(&self) -> &'a str {
        self.texte.split('.').next().unwrap_or("").trim()
    }

    fn nombre_de_mots(&self) -> usize {
        self.texte.split_whitespace().count()
    }
}

fn main() {
    let livre = String::from("Il était une fois un crabe. Il aimait Rust. Fin.");
    let extrait = Extrait::nouveau(&livre);
    println!("{}", extrait.premiere_phrase());
    println!("{} mots", extrait.nombre_de_mots());
}
