use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Joueur {
    nom: String,
    score: u32,
}

impl Joueur {
    fn new(nom: &str, score: u32) -> Joueur {
        Joueur { nom: nom.to_string(), score }
    }
}

impl Ord for Joueur {
    fn cmp(&self, autre: &Joueur) -> Ordering {
        autre.score.cmp(&self.score).then_with(|| self.nom.cmp(&autre.nom))
    }
}

impl PartialOrd for Joueur {
    fn partial_cmp(&self, autre: &Joueur) -> Option<Ordering> {
        Some(self.cmp(autre))
    }
}

fn main() {
    let mut joueurs = [
        Joueur::new("Lea", 50),
        Joueur::new("Max", 80),
        Joueur::new("Ana", 80),
        Joueur::new("Zoe", 20),
    ];
    joueurs.sort();
    for (rang, joueur) in joueurs.iter().enumerate() {
        println!("{}. {} ({})", rang + 1, joueur.nom, joueur.score);
    }
    if let Some(meilleur) = joueurs.iter().min() {
        println!("Meilleur : {}", meilleur.nom);
    }
}
