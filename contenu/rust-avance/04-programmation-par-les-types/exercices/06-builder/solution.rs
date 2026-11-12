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
        RequeteBuilder {
            url: None,
            methode: "GET".to_string(),
            delai: 30,
            en_tetes: Vec::new(),
        }
    }

    fn url(mut self, url: &str) -> RequeteBuilder {
        self.url = Some(url.to_string());
        self
    }

    fn methode(mut self, methode: &str) -> RequeteBuilder {
        self.methode = methode.to_string();
        self
    }

    fn delai(mut self, secondes: u32) -> RequeteBuilder {
        self.delai = secondes;
        self
    }

    fn en_tete(mut self, nom: &str, valeur: &str) -> RequeteBuilder {
        self.en_tetes.push((nom.to_string(), valeur.to_string()));
        self
    }

    fn construire(self) -> Result<Requete, String> {
        let url = self.url.ok_or("l'adresse est obligatoire")?;
        if self.delai == 0 {
            return Err("le délai doit être positif".to_string());
        }
        Ok(Requete {
            url,
            methode: self.methode,
            delai: self.delai,
            en_tetes: self.en_tetes,
        })
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
