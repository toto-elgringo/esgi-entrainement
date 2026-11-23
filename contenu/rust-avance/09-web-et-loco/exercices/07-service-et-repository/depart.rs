use std::collections::BTreeMap;

trait Mesures {
    fn existe(&self, capteur: u32) -> bool;
    fn valeurs_de(&self, capteur: u32) -> Vec<f64>;
    fn inserer(&mut self, capteur: u32, valeurs: &[f64]) -> usize;
}

#[derive(Default)]
struct EnMemoire {
    donnees: BTreeMap<u32, Vec<f64>>,
}

impl EnMemoire {
    fn avec_capteurs(capteurs: &[u32]) -> Self {
        let donnees = capteurs.iter().map(|&c| (c, Vec::new())).collect();
        EnMemoire { donnees }
    }
}

impl Mesures for EnMemoire {
    fn existe(&self, capteur: u32) -> bool {
        todo!()
    }

    fn valeurs_de(&self, capteur: u32) -> Vec<f64> {
        todo!()
    }

    fn inserer(&mut self, capteur: u32, valeurs: &[f64]) -> usize {
        todo!()
    }
}

#[derive(Debug, PartialEq)]
struct StatsCapteur {
    capteur: u32,
    nb_mesures: usize,
    moyenne: Option<f64>,
}

fn stats_capteur<R: Mesures>(repo: &R, capteur: u32) -> Option<StatsCapteur> {
    todo!()
}

fn main() {
    let mut repo = EnMemoire::avec_capteurs(&[1, 2]);
    repo.inserer(1, &[21.0, 22.0, 20.0]);
    println!("{:?}", stats_capteur(&repo, 1));
    println!("{:?}", stats_capteur(&repo, 2));
    println!("{:?}", stats_capteur(&repo, 9));
}
