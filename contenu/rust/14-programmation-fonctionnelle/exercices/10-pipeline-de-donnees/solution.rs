use std::cmp::Reverse;
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
    achats.iter().fold(BTreeMap::new(), |mut totaux, achat| {
        *totaux.entry(cle(achat)).or_insert(0) += achat.montant;
        totaux
    })
}

fn total_par_client(achats: &[Achat]) -> BTreeMap<String, u32> {
    totaliser_par(achats, |achat| achat.client.clone())
}

fn total_par_categorie(achats: &[Achat]) -> BTreeMap<String, u32> {
    totaliser_par(achats, |achat| achat.categorie.clone())
}

fn meilleurs_clients(achats: &[Achat], n: usize) -> Vec<(String, u32)> {
    let mut classement: Vec<(String, u32)> = total_par_client(achats).into_iter().collect();
    classement.sort_by_key(|&(_, total)| Reverse(total));
    classement.into_iter().take(n).collect()
}

fn categorie_phare(achats: &[Achat]) -> Option<String> {
    total_par_categorie(achats)
        .into_iter()
        .min_by_key(|&(_, total)| Reverse(total))
        .map(|(categorie, _)| categorie)
}

fn avec_remise(achats: &[Achat], categorie: &str, pourcentage: u32) -> Vec<Achat> {
    achats
        .iter()
        .map(|achat| {
            if achat.categorie == categorie {
                Achat {
                    montant: achat.montant * (100 - pourcentage) / 100,
                    ..achat.clone()
                }
            } else {
                achat.clone()
            }
        })
        .collect()
}

fn main() {
    let achats = exemple();
    println!("{:?}", total_par_client(&achats));
    println!("{:?}", total_par_categorie(&achats));
    println!("{:?}", meilleurs_clients(&achats, 3));
    println!("{:?}", categorie_phare(&achats));
    println!("{:?}", categorie_phare(&avec_remise(&achats, "jeux", 100)));
}
