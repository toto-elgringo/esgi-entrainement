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
        self.donnees.contains_key(&capteur)
    }

    fn valeurs_de(&self, capteur: u32) -> Vec<f64> {
        self.donnees.get(&capteur).cloned().unwrap_or_default()
    }

    fn inserer(&mut self, capteur: u32, valeurs: &[f64]) -> usize {
        match self.donnees.get_mut(&capteur) {
            Some(liste) => {
                liste.extend_from_slice(valeurs);
                valeurs.len()
            }
            None => 0,
        }
    }
}

#[derive(Debug, PartialEq)]
struct StatsCapteur {
    capteur: u32,
    nb_mesures: usize,
    moyenne: Option<f64>,
}

fn stats_capteur<R: Mesures>(repo: &R, capteur: u32) -> Option<StatsCapteur> {
    if !repo.existe(capteur) {
        return None;
    }
    let valeurs = repo.valeurs_de(capteur);
    let moyenne = if valeurs.is_empty() {
        None
    } else {
        Some(valeurs.iter().sum::<f64>() / valeurs.len() as f64)
    };
    Some(StatsCapteur {
        capteur,
        nb_mesures: valeurs.len(),
        moyenne,
    })
}

fn main() {
    let mut repo = EnMemoire::avec_capteurs(&[1, 2]);
    repo.inserer(1, &[21.0, 22.0, 20.0]);
    println!("{:?}", stats_capteur(&repo, 1));
    println!("{:?}", stats_capteur(&repo, 2));
    println!("{:?}", stats_capteur(&repo, 9));
}
