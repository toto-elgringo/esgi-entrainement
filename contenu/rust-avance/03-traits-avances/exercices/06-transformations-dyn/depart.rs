trait Transformation {
    fn appliquer(&self, texte: &str) -> String;
}

struct Majuscules;

struct Repeter(usize);

struct Entourer(char);

impl Transformation for Majuscules {
    fn appliquer(&self, texte: &str) -> String {
        texte.to_uppercase()
    }
}

impl Transformation for Repeter {
    fn appliquer(&self, texte: &str) -> String {
        todo!()
    }
}

impl Transformation for Entourer {
    fn appliquer(&self, texte: &str) -> String {
        todo!()
    }
}

fn enchainer(etapes: &[Box<dyn Transformation>], texte: &str) -> String {
    todo!()
}

fn construire(nom: &str) -> Option<Box<dyn Transformation>> {
    todo!()
}

fn main() {
    let etapes: Vec<Box<dyn Transformation>> = ["majuscules", "doubler", "etoiles"]
        .iter()
        .filter_map(|nom| construire(nom))
        .collect();
    println!("{}", enchainer(&etapes, "hop"));
}
