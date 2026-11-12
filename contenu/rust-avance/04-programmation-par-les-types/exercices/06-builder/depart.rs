#[derive(Debug, PartialEq)]
struct Requete {
    url: String,
    methode: String,
    delai: u32,
    en_tetes: Vec<(String, String)>,
}

struct RequeteBuilder {
    url: Option<String>,
    methode: String,
    delai: u32,
    en_tetes: Vec<(String, String)>,
}

impl RequeteBuilder {
    fn nouveau() -> RequeteBuilder {
        todo!()
    }

    fn url(mut self, url: &str) -> RequeteBuilder {
        todo!()
    }

    fn methode(mut self, methode: &str) -> RequeteBuilder {
        todo!()
    }

    fn delai(mut self, secondes: u32) -> RequeteBuilder {
        todo!()
    }

    fn en_tete(mut self, nom: &str, valeur: &str) -> RequeteBuilder {
        todo!()
    }

    fn construire(self) -> Result<Requete, String> {
        todo!()
    }
}

fn main() {
    let requete = RequeteBuilder::nouveau()
        .url("https://exemple.fr")
        .methode("POST")
        .delai(5)
        .en_tete("Accept", "json")
        .construire();
    match requete {
        Ok(r) => {
            println!("{} {} (délai {} s)", r.methode, r.url, r.delai);
            for (nom, valeur) in &r.en_tetes {
                println!("{nom}: {valeur}");
            }
        }
        Err(message) => println!("{message}"),
    }
    match RequeteBuilder::nouveau().construire() {
        Ok(_) => println!("construite"),
        Err(message) => println!("{message}"),
    }
}
