struct Brouillon;
struct Validee;
struct Expediee {
    suivi: String,
}

struct Commande<Etat> {
    numero: u32,
    articles: Vec<String>,
    etat: Etat,
}

impl Commande<Brouillon> {
    fn nouvelle(numero: u32) -> Commande<Brouillon> {
        Commande { numero, articles: Vec::new(), etat: Brouillon }
    }

    fn ajouter(&mut self, article: &str) {
        self.articles.push(article.to_string());
    }

    fn valider(self) -> Result<Commande<Validee>, String> {
        if self.articles.is_empty() {
            return Err(format!("Commande {} refusée : aucun article", self.numero));
        }
        Ok(Commande { numero: self.numero, articles: self.articles, etat: Validee })
    }

    fn decrire(&self) -> String {
        format!("Commande {} : brouillon, {} article(s)", self.numero, self.articles.len())
    }
}

impl Commande<Validee> {
    fn expedier(self) -> Commande<Expediee> {
        let suivi = format!("SUIVI-{}", self.numero);
        Commande { numero: self.numero, articles: self.articles, etat: Expediee { suivi } }
    }

    fn decrire(&self) -> String {
        format!("Commande {} : validée, {} article(s)", self.numero, self.articles.len())
    }
}

impl Commande<Expediee> {
    fn decrire(&self) -> String {
        format!(
            "Commande {} : expédiée, {} article(s), suivi {}",
            self.numero,
            self.articles.len(),
            self.etat.suivi
        )
    }
}

fn main() {
    let mut commande = Commande::nouvelle(42);
    println!("{}", commande.decrire());
    commande.ajouter("clavier");
    commande.ajouter("souris");
    println!("{}", commande.decrire());
    if let Ok(validee) = commande.valider() {
        println!("{}", validee.decrire());
        let expediee = validee.expedier();
        println!("{}", expediee.decrire());
    }
    match Commande::nouvelle(7).valider() {
        Ok(validee) => println!("{}", validee.decrire()),
        Err(message) => println!("{message}"),
    }
}
