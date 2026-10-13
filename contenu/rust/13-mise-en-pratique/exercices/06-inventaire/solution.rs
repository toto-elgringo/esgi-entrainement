use std::collections::HashMap;
use std::fmt;

#[derive(Debug, PartialEq)]
enum ErreurStock {
    ArticleInconnu(String),
    StockInsuffisant {
        article: String,
        disponible: u32,
        demande: u32,
    },
}

struct Inventaire {
    stock: HashMap<String, u32>,
}

impl Inventaire {
    fn nouveau() -> Inventaire {
        Inventaire {
            stock: HashMap::new(),
        }
    }

    fn ajouter(&mut self, article: &str, quantite: u32) {
        *self.stock.entry(article.to_string()).or_insert(0) += quantite;
    }

    fn retirer(&mut self, article: &str, quantite: u32) -> Result<(), ErreurStock> {
        let disponible = self
            .stock
            .get(article)
            .copied()
            .ok_or_else(|| ErreurStock::ArticleInconnu(article.to_string()))?;
        if quantite > disponible {
            return Err(ErreurStock::StockInsuffisant {
                article: article.to_string(),
                disponible,
                demande: quantite,
            });
        }
        if quantite == disponible {
            self.stock.remove(article);
        } else {
            self.stock.insert(article.to_string(), disponible - quantite);
        }
        Ok(())
    }

    fn quantite(&self, article: &str) -> u32 {
        self.stock.get(article).copied().unwrap_or(0)
    }

    fn a_reapprovisionner(&self, seuil: u32) -> Vec<String> {
        let mut articles: Vec<String> = self
            .stock
            .iter()
            .filter(|(_, quantite)| **quantite < seuil)
            .map(|(article, _)| article.clone())
            .collect();
        articles.sort();
        articles
    }
}

impl fmt::Display for Inventaire {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut articles: Vec<(&String, &u32)> = self.stock.iter().collect();
        articles.sort();
        let lignes: Vec<String> = articles
            .iter()
            .map(|(article, quantite)| format!("{article} : {quantite}"))
            .collect();
        write!(f, "{}", lignes.join("\n"))
    }
}

fn main() {
    let mut inventaire = Inventaire::nouveau();
    inventaire.ajouter("pomme", 5);
    inventaire.ajouter("banane", 12);
    println!("{:?}", inventaire.retirer("pomme", 2));
    println!("{inventaire}");
}
