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
        todo!()
    }
}

impl Resume for Tweet {
    fn resumer(&self) -> String {
        todo!()
    }
}

fn annoncer(element: &impl Resume) -> String {
    todo!()
}

fn tout_resumer<T>(elements: &[T]) -> String
where
    T: Resume,
{
    todo!()
}

fn tweet_du_jour() -> impl Resume {
    Tweet {
        pseudo: String::new(),
        texte: String::new(),
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
