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
        texte.repeat(self.0)
    }
}

impl Transformation for Entourer {
    fn appliquer(&self, texte: &str) -> String {
        format!("{}{}{}", self.0, texte, self.0)
    }
}

fn enchainer(etapes: &[Box<dyn Transformation>], texte: &str) -> String {
    etapes.iter().fold(texte.to_string(), |acc, etape| etape.appliquer(&acc))
}

fn construire(nom: &str) -> Option<Box<dyn Transformation>> {
    match nom {
        "majuscules" => Some(Box::new(Majuscules)),
        "doubler" => Some(Box::new(Repeter(2))),
        "etoiles" => Some(Box::new(Entourer('*'))),
        _ => None,
    }
}

fn main() {
    let etapes: Vec<Box<dyn Transformation>> = ["majuscules", "doubler", "etoiles"]
        .iter()
        .filter_map(|nom| construire(nom))
        .collect();
    println!("{}", enchainer(&etapes, "hop"));
}
