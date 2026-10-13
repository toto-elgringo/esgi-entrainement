trait Resume {
    fn resumer(&self) -> String;
}

struct Article {
    titre: String,
    auteur: String,
}

struct Tweet {
    pseudo: String,
    texte: String,
}

impl Resume for Article {
    fn resumer(&self) -> String {
        format!("{}, par {}", self.titre, self.auteur)
    }
}

impl Resume for Tweet {
    fn resumer(&self) -> String {
        format!("@{} : {}", self.pseudo, self.texte)
    }
}

fn annoncer(element: &impl Resume) -> String {
    format!("Nouveau : {}", element.resumer())
}

fn tout_resumer<T>(elements: &[T]) -> String
where
    T: Resume,
{
    elements
        .iter()
        .map(|element| element.resumer())
        .collect::<Vec<String>>()
        .join(" | ")
}

fn tweet_du_jour() -> impl Resume {
    Tweet {
        pseudo: "rustlang".to_string(),
        texte: "Rust 2024 est sorti".to_string(),
    }
}

fn main() {
    let article = Article {
        titre: "Les traits".to_string(),
        auteur: "Léa".to_string(),
    };
    println!("{}", annoncer(&article));
    println!("{}", tweet_du_jour().resumer());
}
