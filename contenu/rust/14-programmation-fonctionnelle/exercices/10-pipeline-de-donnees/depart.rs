use std::collections::BTreeMap;

#[derive(Debug, Clone, PartialEq)]
struct Achat {
    client: String,
    categorie: String,
    montant: u32,
}

fn achat(client: &str, categorie: &str, montant: u32) -> Achat {
    Achat {
        client: client.to_string(),
        categorie: categorie.to_string(),
        montant,
    }
}

fn exemple() -> Vec<Achat> {
    vec![
        achat("Ana", "livres", 25),
        achat("Léo", "jeux", 60),
        achat("Ana", "musique", 12),
        achat("Mia", "livres", 18),
        achat("Léo", "livres", 9),
        achat("Zoé", "jeux", 45),
        achat("Mia", "musique", 30),
        achat("Ana", "jeux", 40),
    ]
}

fn totaliser_par(achats: &[Achat], cle: impl Fn(&Achat) -> String) -> BTreeMap<String, u32> {
    todo!()
}

fn total_par_client(achats: &[Achat]) -> BTreeMap<String, u32> {
    todo!()
}

fn total_par_categorie(achats: &[Achat]) -> BTreeMap<String, u32> {
    todo!()
}

fn meilleurs_clients(achats: &[Achat], n: usize) -> Vec<(String, u32)> {
    todo!()
}

fn categorie_phare(achats: &[Achat]) -> Option<String> {
    todo!()
}

fn avec_remise(achats: &[Achat], categorie: &str, pourcentage: u32) -> Vec<Achat> {
    todo!()
}

fn main() {
    let achats = exemple();
    println!("{:?}", total_par_client(&achats));
    println!("{:?}", total_par_categorie(&achats));
    println!("{:?}", meilleurs_clients(&achats, 3));
    println!("{:?}", categorie_phare(&achats));
    println!("{:?}", categorie_phare(&avec_remise(&achats, "jeux", 100)));
}
